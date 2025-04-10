import React, { useState, useEffect } from 'react';
import { Table, Form, Select, Checkbox, Button, Card, Tabs, message, Modal, Input, Space, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import './QuanLyPhanQuyen.css';
import { getAllQuyen, addQuyen, updateQuyen, deleteQuyen } from "../../../DAL/api.jsx";
import QuyenDTO from "../../../DTO/QuyenDTO";
import PhanQuyenDTO from "../../../DTO/PhanQuyenDTO";

const { TabPane } = Tabs;
const { Option } = Select;

const QuanLyPhanQuyen = () => {
  // States
  const [quyenList, setQuyenList] = useState([]);
  const [chucNangList, setChucNangList] = useState([]);
  const [phanQuyenList, setPhanQuyenList] = useState([]);
  const [selectedQuyen, setSelectedQuyen] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [editingQuyen, setEditingQuyen] = useState(null);
  const [editingChucNang, setEditingChucNang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form refs
  const [quyenForm] = Form.useForm();
  const [chucNangForm] = Form.useForm();

  // Mock data fetching
  useEffect(() => {
    fetchQuyenList();
    fetchChucNangList();
    fetchPhanQuyenList();
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
      const data = await getAllQuyen();
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

  const fetchChucNangList = () => {
    const mockChucNangList = [
      { IDChucNang: 1, TenChucNang: 'Quản lý tài khoản' },
      { IDChucNang: 2, TenChucNang: 'Quản lý phân quyền' },
      { IDChucNang: 3, TenChucNang: 'Quản lý sản phẩm' },
      { IDChucNang: 4, TenChucNang: 'Quản lý đơn hàng' },
    ];
    setChucNangList(mockChucNangList);
  };

  const fetchPhanQuyenList = () => {
    const mockPhanQuyenList = [
      { IDChucNang: 1, IDQuyen: 1, Them: 1, Xoa: 1, Sua: 1 },
      { IDChucNang: 2, IDQuyen: 1, Them: 1, Xoa: 1, Sua: 1 },
      { IDChucNang: 3, IDQuyen: 1, Them: 1, Xoa: 1, Sua: 1 },
      { IDChucNang: 4, IDQuyen: 1, Them: 1, Xoa: 1, Sua: 1 },
      { IDChucNang: 1, IDQuyen: 2, Them: 1, Xoa: 0, Sua: 1 },
      { IDChucNang: 2, IDQuyen: 2, Them: 0, Xoa: 0, Sua: 0 },
      { IDChucNang: 3, IDQuyen: 2, Them: 1, Xoa: 1, Sua: 1 },
      { IDChucNang: 4, IDQuyen: 2, Them: 1, Xoa: 0, Sua: 1 },
      { IDChucNang: 1, IDQuyen: 3, Them: 0, Xoa: 0, Sua: 0 },
      { IDChucNang: 3, IDQuyen: 3, Them: 0, Xoa: 0, Sua: 1 },
      { IDChucNang: 4, IDQuyen: 3, Them: 0, Xoa: 0, Sua: 0 },
    ];
    setPhanQuyenList(mockPhanQuyenList);
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
        // Cập nhật quyền
        await updateQuyen({
          IDQuyen: editingQuyen.IDQuyen,
          TenQuyen: values.TenQuyen,
          ChucNang: getPhanQuyenBySelectedQuyen()
        });
      } else {
        // Thêm quyền mới
        await addQuyen({
          TenQuyen: values.TenQuyen,
          ChucNang: []
        });
      }

      setNotification({
        message: editingQuyen ? 'Cập nhật quyền thành công!' : 'Thêm quyền mới thành công!',
        type: 'success'
      });

      fetchQuyenList(); // Reload danh sách
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
          fetchQuyenList(); // Reload danh sách
        } catch (error) {
          setNotification({
            message: error.message,
            type: 'error'
          });
        }
      }
    });
  };

  const handleSaveChucNang = (values) => {
    const isDuplicate = chucNangList.some(
      cn => cn.TenChucNang === values.TenChucNang && cn.IDChucNang !== (editingChucNang?.IDChucNang)
    );

    if (isDuplicate) {
      setNotification({
        message: 'Tên chức năng này đã tồn tại!',
        type: 'error'
      });
      return;
    }

    if (editingChucNang) {
      const updatedList = chucNangList.map((cn) =>
        cn.IDChucNang === editingChucNang.IDChucNang ? { ...cn, ...values } : cn
      );
      setChucNangList(updatedList);
    } else {
      const newChucNang = {
        IDChucNang: Math.max(...chucNangList.map(cn => cn.IDChucNang), 0) + 1,
        ...values
      };
      setChucNangList([...chucNangList, newChucNang]);
    }

    setNotification({
      message: editingChucNang ? 'Cập nhật chức năng thành công!' : 'Thêm chức năng mới thành công!',
      type: 'success'
    });

    setEditingChucNang(null);
    chucNangForm.resetFields();
  };

  const handleDeleteChucNang = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa chức năng này?',
      onOk: () => {
        setChucNangList(chucNangList.filter(cn => cn.IDChucNang !== id));
        setNotification({
          message: 'Xóa chức năng thành công!',
          type: 'success'
        });
      }
    });
  };

  const handleSavePhanQuyen = async () => {
    if (!selectedQuyen) {
      setNotification({
        message: 'Vui lòng chọn quyền trước khi lưu!',
        type: 'error'
      });
      return;
    }

    try {
      await updateQuyen({
        IDQuyen: selectedQuyen,
        ChucNang: getPhanQuyenBySelectedQuyen()
      });

      setNotification({
        message: 'Cập nhật phân quyền thành công!',
        type: 'success'
      });
      setIsModalVisible(false);
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handlePhanQuyenChange = (chucNangId, type, checked) => {
    if (!selectedQuyen) return;

    const newPhanQuyenList = [...phanQuyenList];
    const index = newPhanQuyenList.findIndex(
      pq => pq.IDChucNang === chucNangId && pq.IDQuyen === selectedQuyen
    );

    if (index >= 0) {
      newPhanQuyenList[index] = {
        ...newPhanQuyenList[index],
        [type]: checked ? 1 : 0
      };
    } else {
      newPhanQuyenList.push({
        IDChucNang: chucNangId,
        IDQuyen: selectedQuyen,
        Them: type === 'Them' ? (checked ? 1 : 0) : 0,
        Xoa: type === 'Xoa' ? (checked ? 1 : 0) : 0,
        Sua: type === 'Sua' ? (checked ? 1 : 0) : 0,
      });
    }

    setPhanQuyenList(newPhanQuyenList);
  };

  const handleQuyenChange = (quyenId) => {
    setSelectedQuyen(quyenId);
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

  const chucNangColumns = [
    {
      title: 'ID',
      dataIndex: 'IDChucNang',
      key: 'IDChucNang',
    },
    {
      title: 'Tên Chức Năng',
      dataIndex: 'TenChucNang',
      key: 'TenChucNang',
      sorter: (a, b) => a.TenChucNang.localeCompare(b.TenChucNang),
      filterSearch: true,
      filters: chucNangList.map(cn => ({ text: cn.TenChucNang, value: cn.TenChucNang })),
      onFilter: (value, record) => record.TenChucNang.indexOf(value) === 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingChucNang(record);
              chucNangForm.setFieldsValue(record);
            }}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteChucNang(record.IDChucNang)}
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
      render: (_, record) => {
        const chucNang = chucNangList.find(cn => cn.IDChucNang === record.IDChucNang);
        return chucNang ? chucNang.TenChucNang : '';
      }
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

  const getPhanQuyenBySelectedQuyen = () => {
    if (!selectedQuyen) return [];
    
    return chucNangList.map(chucNang => {
      const phanQuyen = phanQuyenList.find(
        pq => pq.IDChucNang === chucNang.IDChucNang && pq.IDQuyen === selectedQuyen
      );
      
      return {
        IDChucNang: chucNang.IDChucNang,
        TenChucNang: chucNang.TenChucNang,
        Them: phanQuyen ? phanQuyen.Them : 0,
        Xoa: phanQuyen ? phanQuyen.Xoa : 0,
        Sua: phanQuyen ? phanQuyen.Sua : 0,
      };
    });
  };

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
                  placeholder="Chọn quyền"
                  onChange={handleQuyenChange}
                  value={selectedQuyen}
                >
                  {quyenList.map(quyen => (
                    <Option key={quyen.IDQuyen} value={quyen.IDQuyen}>
                      {quyen.TenQuyen}
                    </Option>
                  ))}
                </Select>
              </div>

              {selectedQuyen && (
                <>
                  <Table 
                    dataSource={getPhanQuyenBySelectedQuyen()} 
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
          
          <TabPane tab="Quản lý Chức Năng" key="3">
            <Card>
              <Form
                form={chucNangForm}
                layout="inline"
                onFinish={handleSaveChucNang}
                style={{ marginBottom: 20 }}
              >
                <Form.Item
                  name="TenChucNang"
                  label="Tên Chức Năng"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chức năng!' }]}
                >
                  <Input placeholder="Nhập tên chức năng" style={{ width: 200 }} />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={editingChucNang ? <EditOutlined /> : <PlusOutlined />}
                  >
                    {editingChucNang ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
                </Form.Item>
                
                {editingChucNang && (
                  <Form.Item>
                    <Button 
                      onClick={() => {
                        setEditingChucNang(null);
                        chucNangForm.resetFields();
                      }}
                    >
                      Hủy
                    </Button>
                  </Form.Item>
                )}
              </Form>
              
              <Table 
                dataSource={chucNangList} 
                columns={chucNangColumns} 
                rowKey="IDChucNang"
              />
            </Card>
          </TabPane>
        </Tabs>

        <Modal
          title="Xác nhận thay đổi"
          visible={isModalVisible}
          onOk={handleSavePhanQuyen}
          onCancel={() => setIsModalVisible(false)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn lưu các thay đổi phân quyền?</p>
          <p>Các thay đổi này sẽ ảnh hưởng đến quyền truy cập của người dùng.</p>
        </Modal>
      </Spin>
    </div>
  );
};

export default QuanLyPhanQuyen;