import React, { useState, useEffect } from 'react';
import { Table, Form, Select, Checkbox, Button, Card, Tabs, Modal, Input, Space, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import './QuanLyPhanQuyen.css';
import { fetchAllQuyen, getAllChucNang, addQuyen, updateQuyen, deleteQuyen } from '../../../DAL/api.jsx';

const { TabPane } = Tabs;
const { Option } = Select;

const QuanLyPhanQuyen = () => {
  // States
  const [quyenList, setQuyenList] = useState([]);
  const [chucNangList, setChucNangList] = useState([]);
  const [phanQuyenList, setPhanQuyenList] = useState([]); // This will hold the permissions for the currently selected role
  const [selectedQuyenId, setSelectedQuyenId] = useState(null); // Changed state name for clarity
  const [currentTab, setCurrentTab] = useState('1');
  const [editingQuyen, setEditingQuyen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form refs
  const [quyenForm] = Form.useForm();

  // Fetch initial data
  useEffect(() => {
    fetchQuyenList();
    fetchChucNangList();
  }, []);

  // Notification effect
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Functions to fetch data
  const fetchQuyenList = async () => {
    setLoading(true);
    try {
      const data = await fetchAllQuyen();
      setQuyenList(data);
    } catch (error) {
      setNotification({
        message: "Lỗi khi tải dữ liệu quyền: " + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChucNangList = async () => {
    setLoading(true);
    try {
      const data = await getAllChucNang();
      setChucNangList(data);
    } catch (error) {
      setNotification({
        message: "Lỗi khi tải dữ liệu chức năng: " + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const handleSaveQuyen = async (values) => {
    if (!values.TenQuyen.trim()) {
      setNotification({
        message: 'Vui lòng nhập tên quyền!',
        type: 'error'
      });
      return;
    }

    try {
      if (editingQuyen) {
        await updateQuyen({
          IDQuyen: editingQuyen.IDQuyen,
          TenQuyen: values.TenQuyen,
        });
      } else {
        await addQuyen({
          TenQuyen: values.TenQuyen,
          ChucNang: []
        });
      }

      setNotification({
        message: editingQuyen ? 'Cập nhật quyền thành công!' : 'Thêm quyền mới thành công!',
        type: 'success'
      });

      fetchQuyenList();
      setEditingQuyen(null);
      quyenForm.resetFields();
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleDeleteQuyen = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa quyền này?',
      onOk: async () => {
        try {
          await deleteQuyen(id);
          setNotification({
            message: 'Xóa quyền thành công!',
            type: 'success'
          });
          fetchQuyenList();
        } catch (error) {
          setNotification({
            message: error.message,
            type: 'error'
          });
        }
      }
    });
  };

  const handleSavePhanQuyen = async () => {
    if (!selectedQuyenId) {
      setNotification({
        message: 'Vui lòng chọn quyền trước khi lưu!',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const selectedQuyenObj = quyenList.find(q => q.IDQuyen === selectedQuyenId);
      if (!selectedQuyenObj) {
        throw new Error("Không tìm thấy thông tin quyền đã chọn.");
      }

      const chucNangPermissions = phanQuyenList.map(pq => ({
        IDChucNang: pq.IDChucNang,
        Them: pq.Them,
        Xoa: pq.Xoa,
        Sua: pq.Sua
      }));

      const result = await updateQuyen({
        IDQuyen: selectedQuyenId,
        TenQuyen: selectedQuyenObj.TenQuyen,
        ChucNang: chucNangPermissions
      });

      if (result.success) {
        setNotification({
          message: 'Cập nhật phân quyền thành công!',
          type: 'success'
        });
        fetchQuyenList();
      } else {
        throw new Error(result.message || 'Lỗi khi cập nhật phân quyền');
      }
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhanQuyenChange = (chucNangId, type, checked) => {
    setPhanQuyenList(currentPhanQuyen => {
      return currentPhanQuyen.map(pq => {
        if (pq.IDChucNang === chucNangId) {
          return { ...pq, [type]: checked ? 1 : 0 };
        }
        return pq;
      });
    });
  };

  const handleQuyenChange = (quyenId) => {
    setSelectedQuyenId(quyenId);
    const selectedRole = quyenList.find(q => q.IDQuyen === quyenId);

    if (selectedRole && chucNangList.length > 0) {
      const currentPermissions = chucNangList.map(cn => {
        const existingPermission = selectedRole.ChucNang.find(p => p.IDChucNang === cn.IDChucNang);
        return {
          IDChucNang: cn.IDChucNang,
          TenChucNang: cn.TenChucNang,
          Them: existingPermission ? existingPermission.Them : 0,
          Xoa: existingPermission ? existingPermission.Xoa : 0,
          Sua: existingPermission ? existingPermission.Sua : 0,
        };
      });
      setPhanQuyenList(currentPermissions);
    } else {
      setPhanQuyenList([]);
    }
  };

  const quyenColumns = [
    {
      title: 'ID',
      dataIndex: 'IDQuyen',
      key: 'IDQuyen',
    },
    {
      title: 'Tên Quyền',
      dataIndex: 'TenQuyen',
      key: 'TenQuyen',
      sorter: (a, b) => a.TenQuyen.localeCompare(b.TenQuyen),
      filterSearch: true,
      filters: quyenList.map(q => ({ text: q.TenQuyen, value: q.TenQuyen })),
      onFilter: (value, record) => record.TenQuyen.indexOf(value) === 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingQuyen(record);
              quyenForm.setFieldsValue(record);
            }}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteQuyen(record.IDQuyen)}
          />
        </Space>
      ),
    },
  ];

  const phanQuyenColumns = [
    {
      title: 'Chức năng',
      dataIndex: 'TenChucNang',
      key: 'TenChucNang',
      render: (text, record) => record.TenChucNang
    },
    {
      title: 'Thêm',
      dataIndex: 'Them',
      key: 'Them',
      render: (them, record) => (
        <Checkbox 
          checked={them === 1} 
          onChange={(e) => handlePhanQuyenChange(record.IDChucNang, 'Them', e.target.checked)}
        />
      )
    },
    {
      title: 'Xóa',
      dataIndex: 'Xoa',
      key: 'Xoa',
      render: (xoa, record) => (
        <Checkbox 
          checked={xoa === 1} 
          onChange={(e) => handlePhanQuyenChange(record.IDChucNang, 'Xoa', e.target.checked)}
        />
      )
    },
    {
      title: 'Sửa',
      dataIndex: 'Sua',
      key: 'Sua',
      render: (sua, record) => (
        <Checkbox 
          checked={sua === 1} 
          onChange={(e) => handlePhanQuyenChange(record.IDChucNang, 'Sua', e.target.checked)}
        />
      )
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {notification && (
        <div className={`notification-container notification-${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}

      <h1>Quản lý Phân Quyền</h1>
      
      <Spin spinning={loading}>
        <Tabs activeKey={currentTab} onChange={setCurrentTab}>
          <TabPane tab="Phân Quyền" key="1">
            <Card>
              <div style={{ marginBottom: 20 }}>
                <h3>Chọn nhóm quyền:</h3>
                <Select 
                  style={{ width: 300 }} 
                  placeholder="Chọn nhóm quyền"
                  onChange={handleQuyenChange}
                  value={selectedQuyenId}
                  allowClear
                  onClear={() => { setSelectedQuyenId(null); setPhanQuyenList([]); }}
                >
                  {quyenList.map(quyen => (
                    <Option key={quyen.IDQuyen} value={quyen.IDQuyen}>
                      {quyen.TenQuyen}
                    </Option>
                  ))}
                </Select>
              </div>

              {selectedQuyenId && (
                <>
                  <Table
                    dataSource={phanQuyenList}
                    columns={phanQuyenColumns}
                    rowKey="IDChucNang"
                    pagination={false}
                  />
                  <div style={{ marginTop: 20, textAlign: 'right' }}>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />} 
                      onClick={handleSavePhanQuyen}
                    >
                      Lưu Phân Quyền
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </TabPane>
          
          <TabPane tab="Quản lý Quyền" key="2">
            <Card>
              <Form
                form={quyenForm}
                layout="inline"
                onFinish={handleSaveQuyen}
                style={{ marginBottom: 20 }}
              >
                <Form.Item
                  name="TenQuyen"
                  label="Tên Quyền"
                  rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
                >
                  <Input placeholder="Nhập tên quyền" style={{ width: 200 }} />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={editingQuyen ? <EditOutlined /> : <PlusOutlined />}
                  >
                    {editingQuyen ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
                </Form.Item>
                
                {editingQuyen && (
                  <Form.Item>
                    <Button 
                      onClick={() => {
                        setEditingQuyen(null);
                        quyenForm.resetFields();
                      }}
                    >
                      Hủy
                    </Button>
                  </Form.Item>
                )}
              </Form>
              
              <Table 
                dataSource={quyenList} 
                columns={quyenColumns} 
                rowKey="IDQuyen"
              />
            </Card>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default QuanLyPhanQuyen;
