// import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
// import { Table, Form, Select, Checkbox, Button, Card, Tabs, message, Modal, Input, Space, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import './QuanLyPhanQuyen.css';
import QuyenDTO from "../../../DTO/QuyenDTO";
import PhanQuyenDTO from "../../../DTO/PhanQuyenDTO";
import ChucNangDTO from "../../../DTO/ChucNangDTO"; // Import ChucNangDTO

// const { TabPane } = Tabs;
// const { Option } = Select;

const QuanLyPhanQuyen = () => {
  // // States
  // const [quyenList, setQuyenList] = useState([]);
  // const [chucNangList, setChucNangList] = useState([]);
  // const [phanQuyenList, setPhanQuyenList] = useState([]); // This will hold the permissions for the currently selected role
  // const [selectedQuyenId, setSelectedQuyenId] = useState(null); // Changed state name for clarity
  // // const [isModalVisible, setIsModalVisible] = useState(false); // Modal seems unused, removing for now
  // const [currentTab, setCurrentTab] = useState('1');
  // const [editingQuyen, setEditingQuyen] = useState(null);
  // const [editingChucNang, setEditingChucNang] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [notification, setNotification] = useState(null);

  // // Form refs
  // const [quyenForm] = Form.useForm();
  // const [chucNangForm] = Form.useForm();

  // // Fetch initial data
  // useEffect(() => {
  //   fetchQuyenList();
  //   fetchChucNangList();
  //   // fetchPhanQuyenList is removed as it's derived from quyenList and chucNangList
  // }, []);

  // // Notification effect
  // useEffect(() => {
  //   if (notification) {
  //     const timer = setTimeout(() => {
  //       setNotification(null);
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [notification]);

  // // Functions to fetch data
  // const fetchQuyenList = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getAllQuyen();
  //     setQuyenList(data);
  //   } catch (error) {
  //     setNotification({
  //       message: "Lỗi khi tải dữ liệu quyền: " + error.message,
  //       type: 'error'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchChucNangList = async () => {
  //   setLoading(true); // Consider separate loading states if needed
  //   try {
  //     const data = await getAllChucNang(); // Call API
  //     setChucNangList(data);
  //   } catch (error) {
  //     setNotification({
  //       message: "Lỗi khi tải dữ liệu chức năng: " + error.message,
  //       type: 'error'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Removed fetchPhanQuyenList as it's now derived data

  // // CRUD operations
  // const handleSaveQuyen = async (values) => {
  //   if (!values.TenQuyen.trim()) {
  //     setNotification({
  //       message: 'Vui lòng nhập tên quyền!',
  //       type: 'error'
  //     });
  //     return;
  //   }

  //   try {
  //     if (editingQuyen) {
  //       // Cập nhật quyền - Ensure ChucNang data is correctly formatted if needed by API
  //       // The current updateQuyen API seems to expect ChucNang array for permissions
  //       // Let's assume it handles the update based on TenQuyen only for now,
  //       // or adjust if the API requires full permission data on update.
  //       await updateQuyen({
  //         IDQuyen: editingQuyen.IDQuyen,
  //         TenQuyen: values.TenQuyen,
  //         // ChucNang: [] // Sending empty array might clear permissions, check API logic
  //         // Or send existing permissions if API requires it:
  //         // ChucNang: quyenList.find(q => q.IDQuyen === editingQuyen.IDQuyen)?.ChucNang || []
  //       });
  //     } else {
  //       // Thêm quyền mới - API expects TenQuyen and optionally ChucNang array
  //       await addQuyen({
  //         TenQuyen: values.TenQuyen,
  //         ChucNang: [] // Start with no permissions by default
  //       });
  //     }

  //     setNotification({
  //       message: editingQuyen ? 'Cập nhật quyền thành công!' : 'Thêm quyền mới thành công!',
  //       type: 'success'
  //     });

  //     fetchQuyenList(); // Reload danh sách
  //     setEditingQuyen(null);
  //     quyenForm.resetFields();
  //   } catch (error) {
  //     setNotification({
  //       message: error.message,
  //       type: 'error'
  //     });
  //   }
  // };

  // const handleDeleteQuyen = async (id) => {
  //   Modal.confirm({
  //     title: 'Xác nhận xóa',
  //     content: 'Bạn có chắc chắn muốn xóa quyền này?',
  //     onOk: async () => {
  //       try {
  //         await deleteQuyen(id);
  //         setNotification({
  //           message: 'Xóa quyền thành công!',
  //           type: 'success'
  //         });
  //         fetchQuyenList(); // Reload danh sách
  //       } catch (error) {
  //         setNotification({
  //           message: error.message,
  //           type: 'error'
  //         });
  //       }
  //     }
  //   });
  // };

  // // Updated handleSaveChucNang to use API
  // const handleSaveChucNang = async (values) => {
  //    if (!values.TenChucNang || !values.TenChucNang.trim()) {
  //       setNotification({ message: 'Vui lòng nhập tên chức năng!', type: 'error' });
  //       return;
  //    }

  //   setLoading(true);
  //   try {
  //     let result;
  //     if (editingChucNang) {
  //       result = await updateChucNang({
  //         IDChucNang: editingChucNang.IDChucNang,
  //         TenChucNang: values.TenChucNang
  //       });
  //     } else {
  //       result = await addChucNang({ TenChucNang: values.TenChucNang });
  //     }

  //     if (result.success) {
  //       setNotification({
  //         message: editingChucNang ? 'Cập nhật chức năng thành công!' : 'Thêm chức năng mới thành công!',
  //         type: 'success'
  //       });
  //       fetchChucNangList(); // Reload list
  //       setEditingChucNang(null);
  //       chucNangForm.resetFields();
  //     } else {
  //        // Error message comes from API result
  //        throw new Error(result.message || (editingChucNang ? 'Lỗi cập nhật chức năng' : 'Lỗi thêm chức năng'));
  //     }
  //   } catch (error) {
  //     setNotification({
  //       message: error.message,
  //       type: 'error'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Updated handleDeleteChucNang to use API
  // const handleDeleteChucNang = (id) => {
  //   Modal.confirm({
  //     title: 'Xác nhận xóa',
  //     content: 'Bạn có chắc chắn muốn xóa chức năng này? Thao tác này không thể hoàn tác.',
  //     onOk: async () => {
  //       setLoading(true);
  //       try {
  //         const result = await deleteChucNang(id);
  //         if (result.success) {
  //           setNotification({
  //             message: 'Xóa chức năng thành công!',
  //             type: 'success'
  //           });
  //           fetchChucNangList(); // Reload list
  //           // Also need to update phanQuyenList if the deleted chucnang was part of it
  //           setPhanQuyenList(prev => prev.filter(pq => pq.IDChucNang !== id));
  //         } else {
  //            throw new Error(result.message || 'Lỗi khi xóa chức năng');
  //         }
  //       } catch (error) {
  //         setNotification({
  //           message: error.message,
  //           type: 'error'
  //         });
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   });
  // };

  // // Updated handleSavePhanQuyen
  // const handleSavePhanQuyen = async () => {
  //   if (!selectedQuyenId) {
  //     setNotification({
  //       message: 'Vui lòng chọn quyền trước khi lưu!',
  //       type: 'error'
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // Find the TenQuyen corresponding to the selectedQuyenId
  //     const selectedQuyenObj = quyenList.find(q => q.IDQuyen === selectedQuyenId);
  //     if (!selectedQuyenObj) {
  //         throw new Error("Không tìm thấy thông tin quyền đã chọn.");
  //     }

  //     // Prepare the ChucNang data in the format expected by updateQuyen API
  //     // The API expects an array of { IDChucNang, Them, Xoa, Sua }
  //     const chucNangPermissions = phanQuyenList.map(pq => ({
  //         IDChucNang: pq.IDChucNang,
  //         Them: pq.Them,
  //         Xoa: pq.Xoa,
  //         Sua: pq.Sua
  //     }));

  //     const result = await updateQuyen({
  //       IDQuyen: selectedQuyenId,
  //       TenQuyen: selectedQuyenObj.TenQuyen, // Send TenQuyen as API might require it
  //       ChucNang: chucNangPermissions
  //     });

  //      if (result.success) {
  //           setNotification({
  //               message: 'Cập nhật phân quyền thành công!',
  //               type: 'success'
  //           });
  //           // Optionally reload quyenList to reflect changes if API returns updated data
  //           fetchQuyenList();
  //      } else {
  //          throw new Error(result.message || 'Lỗi khi cập nhật phân quyền');
  //      }
  //     // setIsModalVisible(false); // Modal removed
  //   } catch (error) {
  //     setNotification({
  //       message: error.message,
  //       type: 'error'
  //     });
  //   } finally {
  //       setLoading(false);
  //   }
  // };

  // // Updated handlePhanQuyenChange to modify the local state `phanQuyenList`
  // const handlePhanQuyenChange = (chucNangId, type, checked) => {
  //   setPhanQuyenList(currentPhanQuyen => {
  //     return currentPhanQuyen.map(pq => {
  //       if (pq.IDChucNang === chucNangId) {
  //         return { ...pq, [type]: checked ? 1 : 0 };
  //       }
  //       return pq;
  //     });
  //   });
  // };

  // // Updated handleQuyenChange to populate phanQuyenList from selected role's data
  // const handleQuyenChange = (quyenId) => {
  //   setSelectedQuyenId(quyenId);
  //   const selectedRole = quyenList.find(q => q.IDQuyen === quyenId);

  //   if (selectedRole && chucNangList.length > 0) {
  //       // Map all available chucNangList and merge with permissions from selectedRole.ChucNang
  //       const currentPermissions = chucNangList.map(cn => {
  //           const existingPermission = selectedRole.ChucNang.find(p => p.IDChucNang === cn.IDChucNang);
  //           return {
  //               IDChucNang: cn.IDChucNang,
  //               TenChucNang: cn.TenChucNang, // Keep TenChucNang for display purposes if needed
  //               Them: existingPermission ? existingPermission.Them : 0,
  //               Xoa: existingPermission ? existingPermission.Xoa : 0,
  //               Sua: existingPermission ? existingPermission.Sua : 0,
  //           };
  //       });
  //       setPhanQuyenList(currentPermissions);
  //   } else {
  //       setPhanQuyenList([]); // Clear if no role selected or no chucNang loaded
  //   }
  // };

  // const quyenColumns = [
  //   {
  //     title: 'ID',
  //     dataIndex: 'IDQuyen',
  //     key: 'IDQuyen',
  //   },
  //   {
  //     title: 'Tên Quyền',
  //     dataIndex: 'TenQuyen',
  //     key: 'TenQuyen',
  //     sorter: (a, b) => a.TenQuyen.localeCompare(b.TenQuyen),
  //     filterSearch: true,
  //     filters: quyenList.map(q => ({ text: q.TenQuyen, value: q.TenQuyen })),
  //     onFilter: (value, record) => record.TenQuyen.indexOf(value) === 0,
  //   },
  //   {
  //     title: 'Thao tác',
  //     key: 'action',
  //     render: (_, record) => (
  //       <Space>
  //         <Button 
  //           icon={<EditOutlined />} 
  //           onClick={() => {
  //             setEditingQuyen(record);
  //             quyenForm.setFieldsValue(record);
  //           }}
  //         />
  //         <Button 
  //           danger 
  //           icon={<DeleteOutlined />} 
  //           onClick={() => handleDeleteQuyen(record.IDQuyen)}
  //         />
  //       </Space>
  //     ),
  //   },
  // ];

  // const chucNangColumns = [
  //   {
  //     title: 'ID',
  //     dataIndex: 'IDChucNang',
  //     key: 'IDChucNang',
  //   },
  //   {
  //     title: 'Tên Chức Năng',
  //     dataIndex: 'TenChucNang',
  //     key: 'TenChucNang',
  //     sorter: (a, b) => a.TenChucNang.localeCompare(b.TenChucNang),
  //     filterSearch: true,
  //     filters: chucNangList.map(cn => ({ text: cn.TenChucNang, value: cn.TenChucNang })),
  //     onFilter: (value, record) => record.TenChucNang.indexOf(value) === 0,
  //   },
  //   {
  //     title: 'Thao tác',
  //     key: 'action',
  //     render: (_, record) => (
  //       <Space>
  //         <Button 
  //           icon={<EditOutlined />} 
  //           onClick={() => {
  //             setEditingChucNang(record);
  //             chucNangForm.setFieldsValue(record);
  //           }}
  //         />
  //         <Button 
  //           danger 
  //           icon={<DeleteOutlined />} 
  //           onClick={() => handleDeleteChucNang(record.IDChucNang)}
  //         />
  //       </Space>
  //     ),
  //   },
  // ];

  // const phanQuyenColumns = [
  //   {
  //     title: 'Chức năng',
  //     dataIndex: 'TenChucNang',
  //     key: 'TenChucNang',
  //     // Render TenChucNang directly from the phanQuyenList item which now includes it
  //     render: (text, record) => record.TenChucNang
  //   },
  //   {
  //     title: 'Thêm',
  //     dataIndex: 'Them',
  //     key: 'Them',
  //     render: (them, record) => (
  //       <Checkbox 
  //         checked={them === 1} 
  //         onChange={(e) => handlePhanQuyenChange(record.IDChucNang, 'Them', e.target.checked)}
  //       />
  //     )
  //   },
  //   {
  //     title: 'Xóa',
  //     dataIndex: 'Xoa',
  //     key: 'Xoa',
  //     render: (xoa, record) => (
  //       <Checkbox 
  //         checked={xoa === 1} 
  //         onChange={(e) => handlePhanQuyenChange(record.IDChucNang, 'Xoa', e.target.checked)}
  //       />
  //     )
  //   },
  //   {
  //     title: 'Sửa',
  //     dataIndex: 'Sua',
  //     key: 'Sua',
  //     render: (sua, record) => (
  //       <Checkbox 
  //         checked={sua === 1} 
  //         onChange={(e) => handlePhanQuyenChange(record.IDChucNang, 'Sua', e.target.checked)}
  //       />
  //     )
  //   },
  // ];

  // // Removed getPhanQuyenBySelectedQuyen as phanQuyenList state now holds the data directly

  return (
    // <div style={{ padding: 20 }}>
    //   {notification && (
    //     <div className={`notification-container notification-${notification.type}`}>
    //       <span>{notification.message}</span>
    //     </div>
    //   )}

    //   <h1>Quản lý Phân Quyền</h1>
      
    //   <Spin spinning={loading}>
    //     <Tabs activeKey={currentTab} onChange={setCurrentTab}>
    //       <TabPane tab="Phân Quyền" key="1">
    //         <Card>
    //           <div style={{ marginBottom: 20 }}>
    //             <h3>Chọn nhóm quyền:</h3>
    //             <Select 
    //               style={{ width: 300 }} 
    //               placeholder="Chọn nhóm quyền"
    //               onChange={handleQuyenChange} // This now populates phanQuyenList
    //               value={selectedQuyenId} // Use selectedQuyenId
    //               allowClear // Allow deselecting
    //               onClear={() => { setSelectedQuyenId(null); setPhanQuyenList([]); }}
    //             >
    //               {quyenList.map(quyen => (
    //                 <Option key={quyen.IDQuyen} value={quyen.IDQuyen}>
    //                   {quyen.TenQuyen}
    //                 </Option>
    //               ))}
    //             </Select>
    //           </div>

    //           {selectedQuyenId && ( // Check selectedQuyenId
    //             <>
    //               <Table
    //                 dataSource={phanQuyenList} // Use phanQuyenList directly
    //                 columns={phanQuyenColumns}
    //                 rowKey="IDChucNang"
    //                 pagination={false} // Consider adding pagination if many features
    //               />
    //               <div style={{ marginTop: 20, textAlign: 'right' }}>
    //                 <Button 
    //                   type="primary" 
    //                   icon={<SaveOutlined />} 
    //                   onClick={handleSavePhanQuyen}
    //                 >
    //                   Lưu Phân Quyền
    //                 </Button>
    //               </div>
    //             </>
    //           )}
    //         </Card>
    //       </TabPane>
          
    //       <TabPane tab="Quản lý Quyền" key="2">
    //         <Card>
    //           <Form
    //             form={quyenForm}
    //             layout="inline"
    //             onFinish={handleSaveQuyen}
    //             style={{ marginBottom: 20 }}
    //           >
    //             <Form.Item
    //               name="TenQuyen"
    //               label="Tên Quyền"
    //               rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
    //             >
    //               <Input placeholder="Nhập tên quyền" style={{ width: 200 }} />
    //             </Form.Item>
                
    //             <Form.Item>
    //               <Button 
    //                 type="primary" 
    //                 htmlType="submit" 
    //                 icon={editingQuyen ? <EditOutlined /> : <PlusOutlined />}
    //               >
    //                 {editingQuyen ? 'Cập nhật' : 'Thêm mới'}
    //               </Button>
    //             </Form.Item>
                
    //             {editingQuyen && (
    //               <Form.Item>
    //                 <Button 
    //                   onClick={() => {
    //                     setEditingQuyen(null);
    //                     quyenForm.resetFields();
    //                   }}
    //                 >
    //                   Hủy
    //                 </Button>
    //               </Form.Item>
    //             )}
    //           </Form>
              
    //           <Table 
    //             dataSource={quyenList} 
    //             columns={quyenColumns} 
    //             rowKey="IDQuyen"
    //           />
    //         </Card>
    //       </TabPane>
          
    //       <TabPane tab="Quản lý Chức Năng" key="3">
    //         <Card>
    //           <Form
    //             form={chucNangForm}
    //             layout="inline"
    //             onFinish={handleSaveChucNang}
    //             style={{ marginBottom: 20 }}
    //           >
    //             <Form.Item
    //               name="TenChucNang"
    //               label="Tên Chức Năng"
    //               rules={[{ required: true, message: 'Vui lòng nhập tên chức năng!' }]}
    //             >
    //               <Input placeholder="Nhập tên chức năng" style={{ width: 200 }} />
    //             </Form.Item>
                
    //             <Form.Item>
    //               <Button 
    //                 type="primary" 
    //                 htmlType="submit" 
    //                 icon={editingChucNang ? <EditOutlined /> : <PlusOutlined />}
    //               >
    //                 {editingChucNang ? 'Cập nhật' : 'Thêm mới'}
    //               </Button>
    //             </Form.Item>
                
    //             {editingChucNang && (
    //               <Form.Item>
    //                 <Button 
    //                   onClick={() => {
    //                     setEditingChucNang(null);
    //                     chucNangForm.resetFields();
    //                   }}
    //                 >
    //                   Hủy
    //                 </Button>
    //               </Form.Item>
    //             )}
    //           </Form>
              
    //           <Table 
    //             dataSource={chucNangList} 
    //             columns={chucNangColumns} 
    //             rowKey="IDChucNang"
    //           />
    //         </Card>
    //       </TabPane>
    //     </Tabs>

    //     {/* Modal removed as it seemed unused */}
    //   </Spin>
    // </div>
    <>
    </>
  );
};

export default QuanLyPhanQuyen;
