import React, { useState, useEffect, useCallback } from 'react';
import { Table, Form, Select, Checkbox, Button, Card, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import './QuanLyPhanQuyen.css';
import { getAllQuyen, getPhanQuyenBySelectedQuyen, getAllChucNang, updatePhanQuyen } from '../../../DAL/apiQuanLyPhanQuyen';

const { Option } = Select;

const QuanLyPhanQuyen = () => {
  const [quyenList, setQuyenList] = useState([]);
  const [chucNangList, setChucNangList] = useState([]);
  const [phanQuyenList, setPhanQuyenList] = useState([]);
  const [selectedQuyenId, setSelectedQuyenId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [quyenData, chucNangData] = await Promise.all([getAllQuyen(), getAllChucNang()]);
      setQuyenList(quyenData);
      setChucNangList(chucNangData.data || []);
    } catch (error) {
      message.error(`Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhanQuyenList = async (quyenId) => {
    setLoading(true);
    try {
      // Gọi API để lấy dữ liệu phân quyền
      const data = await getPhanQuyenBySelectedQuyen(quyenId);
  
      // Tạo một Map để ánh xạ IDChucNang đến perm (dữ liệu từ ChucNang)
      const permissionsMap = new Map(
        data.map(item => [item.ChucNang.IDChucNang, item.ChucNang])
      );
  
      // Cập nhật danh sách phân quyền với thông tin từ permissionsMap
      const updatedPhanQuyenList = chucNangList.map(cn => {
        const perm = permissionsMap.get(cn.IDChucNang);
  
        // Nếu tồn tại trong permissionsMap, tự động đánh dấu checkbox
        return {
          IDChucNang: cn.IDChucNang,
          TenChucNang: cn.TenChucNang,
          Xem: perm ? 1 : 0, // Nếu tồn tại, đánh dấu xem
          Them: perm?.Them ? 1 : 0,
          Xoa: perm?.Xoa ? 1 : 0,
          Sua: perm?.Sua ? 1 : 0,
        };
      });
  
      // Cập nhật state phanQuyenList
      setPhanQuyenList(updatedPhanQuyenList);
    } catch (error) {
      // Hiển thị thông báo lỗi nếu xảy ra lỗi
      message.error(`Lỗi khi tải dữ liệu phân quyền: ${error.message}`);
    } finally {
      // Tắt trạng thái loading
      setLoading(false);
    }
  };

  const handleQuyenChange = (quyenId) => {
    console.log('Selected Quyen ID:', quyenId); // Kiểm tra giá trị được truyền vào
    setSelectedQuyenId(quyenId);
    if (quyenId) {
      fetchPhanQuyenList(quyenId);
    } else {
      setPhanQuyenList(
        chucNangList.map(cn => ({
          IDChucNang: cn.IDChucNang,
          TenChucNang: cn.TenChucNang,
          Xem: 0,
          Them: 0,
          Xoa: 0,
          Sua: 0,
        }))
      );
    }
  };

  const handlePhanQuyenChange = (chucNangId, type, checked) => {
    setPhanQuyenList(currentList =>
      currentList.map(item => {
        if (item.IDChucNang === chucNangId) {
          if (type === 'Xem' && !checked) {
            // Uncheck all other permissions if "Xem" is unchecked
            return { ...item, Xem: 0, Them: 0, Xoa: 0, Sua: 0 };
          }
          return { ...item, [type]: checked ? 1 : 0 };
        }
        return item;
      })
    );
  };

  const handleSavePhanQuyen = async () => {
    if (!selectedQuyenId) {
      return message.error('Vui lòng chọn quyền trước khi lưu!');
    }
    console.log('Saving permissions for IDQuyen:', selectedQuyenId);
  
    setLoading(true);
    try {
      const selectedQuyen = quyenList.find(q => q.IDQuyen === selectedQuyenId);
  
      // Tách danh sách các quyền thành hai nhóm: cần thêm/cập nhật và cần xóa
      const toAddOrUpdate = phanQuyenList
        .filter(({ Xem }) => Xem === 1) // Chỉ giữ những quyền có Xem được chọn
        .map(({ IDChucNang, Xem, Them, Xoa, Sua }) => ({
          IDChucNang,
          Xem,
          Them,
          Xoa,
          Sua,
        }));
  
      const toDelete = phanQuyenList
        .filter(({ Xem }) => Xem === 0) // Chỉ giữ những quyền không có Xem được chọn
        .map(({ IDChucNang }) => ({
          IDChucNang,
        }));
  
      // Tạo JSON chính xác
      const requestBody = {
        IDQuyen: selectedQuyen?.IDQuyen,
        TenQuyen: selectedQuyen?.TenQuyen,
        ChucNangToAddOrUpdate: toAddOrUpdate,
        ChucNangToDelete: toDelete,
      };
  
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
  
      // Gửi yêu cầu API
      const result = await updatePhanQuyen(requestBody);
  
      console.log('Update result:', result);
  
      if (result.success) {
        message.success('Cập nhật phân quyền thành công!');
      } else {
        throw new Error(result.message || 'Lỗi khi cập nhật phân quyền');
      }
    } catch (error) {
      message.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const phanQuyenColumns = [
    {
      title: 'Chức năng',
      dataIndex: 'TenChucNang',
      key: 'TenChucNang',
    },
    {
      title: 'Xem',
      dataIndex: 'Xem',
      key: 'Xem',
      render: (value, record) => (
        <Checkbox
          checked={value === 1}
          onChange={e => handlePhanQuyenChange(record.IDChucNang, 'Xem', e.target.checked)}
        />
      ),
    },
    {
      title: 'Thêm',
      dataIndex: 'Them',
      key: 'Them',
      render: (value, record) => (
        <Checkbox
          checked={value === 1}
          disabled={record.Xem !== 1} // Disable if "Xem" is not checked
          onChange={e => handlePhanQuyenChange(record.IDChucNang, 'Them', e.target.checked)}
        />
      ),
    },
    {
      title: 'Xóa',
      dataIndex: 'Xoa',
      key: 'Xoa',
      render: (value, record) => (
        <Checkbox
          checked={value === 1}
          disabled={record.Xem !== 1} // Disable if "Xem" is not checked
          onChange={e => handlePhanQuyenChange(record.IDChucNang, 'Xoa', e.target.checked)}
        />
      ),
    },
    {
      title: 'Sửa',
      dataIndex: 'Sua',
      key: 'Sua',
      render: (value, record) => (
        <Checkbox
          checked={value === 1}
          disabled={record.Xem !== 1} // Disable if "Xem" is not checked
          onChange={e => handlePhanQuyenChange(record.IDChucNang, 'Sua', e.target.checked)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Phân Quyền</h1>
      <Card>
        <div style={{ marginBottom: 20 }}>
          <h3>Chọn nhóm quyền:</h3>
          <Select
            style={{ width: 300 }}
            placeholder="Chọn nhóm quyền"
            onChange={handleQuyenChange}
            value={selectedQuyenId}
            allowClear
          >
            {quyenList.map(quyen => (
              <Option key={quyen.IDQuyen} value={quyen.IDQuyen}>
                {quyen.TenQuyen}
              </Option>
            ))}
          </Select>
        </div>
        {loading ? (
          <Spin />
        ) : (
          <>
            <Table
              dataSource={phanQuyenList}
              columns={phanQuyenColumns}
              rowKey="IDChucNang"
              pagination={false}
            />
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSavePhanQuyen}>
                Lưu Phân Quyền
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default QuanLyPhanQuyen;