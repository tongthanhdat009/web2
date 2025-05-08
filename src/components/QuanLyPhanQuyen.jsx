import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Button, Table, Form, Modal, Alert, Card
} from 'react-bootstrap';
import {
  fetchAllQuyen, fetchAllChucNang, addQuyen, updateQuyen, deleteQuyen
} from '../../../DAL/api';
import ChucNangDTO from '../../../DTO/ChucNangDTO';
import PhanQuyenDTO from '../../../DTO/PhanQuyenDTO';

const QuanLyPhanQuyen = () => {
  // Role states
  const [roles, setRoles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState('add'); // 'add' or 'edit'
  const [roleForm, setRoleForm] = useState(new PhanQuyenDTO());
  
  // Alert states
  const [alert, setAlert] = useState({ show: false, variant: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  // Load roles and features on component mount
  useEffect(() => {
    loadRoles();
    loadFeatures();
  }, []);

  // Load roles from API
  const loadRoles = async () => {
    const response = await fetchAllQuyen();
    if (response.success) {
      setRoles(response.data);
    } else {
      showAlert('danger', response.message || 'Không thể tải danh sách quyền');
    }
  };

  // Load features from API - still needed for role permissions
  const loadFeatures = async () => {
    const response = await fetchAllChucNang();
    if (response.success) {
      setFeatures(response.data);
    } else {
      showAlert('danger', response.message || 'Không thể tải danh sách chức năng');
    }
  };

  // Show alert message
  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ ...alert, show: false }), 3000);
  };

  // Handle role actions
  const handleRoleAction = (action, role = null) => {
    switch (action) {
      case 'add':
        setRoleForm(new PhanQuyenDTO());
        setRoleModalMode('add');
        setShowRoleModal(true);
        break;
      case 'edit':
        setRoleForm(role.clone());
        setRoleModalMode('edit');
        setShowRoleModal(true);
        break;
      case 'delete':
        setConfirmDelete({ show: true, id: role.IDQuyen });
        break;
      default:
        break;
    }
  };

  // Handle role form input change
  const handleRoleFormChange = (field, value) => {
    setRoleForm(prevForm => {
      const newForm = prevForm.clone();
      newForm[field] = value;
      return newForm;
    });
  };

  // Handle role feature permission change
  const handleRoleFeatureChange = (featureId, permission, value) => {
    setRoleForm(prevForm => {
      const newForm = prevForm.clone();
      newForm.updatePermission(featureId, permission, value);
      return newForm;
    });
  };

  // Submit role form
  const handleSubmitRole = async () => {
    try {
      const response = roleModalMode === 'add' 
        ? await addQuyen(roleForm)
        : await updateQuyen(roleForm);

      if (response.success) {
        showAlert('success', response.message || 'Cập nhật quyền thành công');
        setShowRoleModal(false);
        loadRoles();
      } else {
        showAlert('danger', response.message || 'Có lỗi xảy ra khi cập nhật quyền');
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      showAlert('danger', 'Có lỗi xảy ra khi kết nối với máy chủ');
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteQuyen(confirmDelete.id);

      if (response && response.success) {
        showAlert('success', response.message || 'Xóa quyền thành công');
        loadRoles();
      } else {
        showAlert('danger', (response && response.message) || 'Có lỗi xảy ra khi xóa quyền');
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu xóa:", error);
      showAlert('danger', 'Có lỗi xảy ra khi kết nối với máy chủ');
    }
    
    setConfirmDelete({ show: false, id: null });
  };

  return (
    <Container fluid>
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} className="mt-3">
          {alert.message}
        </Alert>
      )}

      <Card className="mt-4">
        <Card.Header>
          <h4>Quản lý phân quyền</h4>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => handleRoleAction('add')}>
              Thêm quyền mới
            </Button>
          </div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên quyền</th>
                <th>Số chức năng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.IDQuyen}>
                  <td>{role.IDQuyen}</td>
                  <td>{role.TenQuyen}</td>
                  <td>{role.ChucNang.length}</td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleRoleAction('edit', role)}
                    >
                      Sửa
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRoleAction('delete', role)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Role Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {roleModalMode === 'add' ? 'Thêm quyền mới' : 'Cập nhật quyền'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên quyền</Form.Label>
              <Form.Control
                type="text"
                value={roleForm.TenQuyen}
                onChange={(e) => handleRoleFormChange('TenQuyen', e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmitRole}>
            {roleModalMode === 'add' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={confirmDelete.show} onHide={() => setConfirmDelete({ show: false, id: null })}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa quyền này?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete({ show: false, id: null })}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default QuanLyPhanQuyen;