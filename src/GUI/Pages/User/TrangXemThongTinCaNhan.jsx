import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TrangXemThongTinCaNhan() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    hoTen: '',
    gioiTinh: 'Nam',
    email: '',
    soDienThoai: '',
    anh: null
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const IDTaiKhoan = localStorage.getItem("IDTaiKhoan");
    if (!IDTaiKhoan) {
      navigate('/dang-nhap-dang-ky');
      return;
    }

    // Lấy thông tin người dùng
    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost/web2/server/api/manageUsers.php?keyword=${localStorage.getItem("HoTen")}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const user = data.data[0];
        setUserInfo({
          hoTen: user.HoTen,
          gioiTinh: user.GioiTinh,
          email: user.Email,
          soDienThoai: user.SoDienThoai,
          anh: user.Anh
        });
        if (user.Anh) {
          setPreviewImage(`http://localhost/web2/server/uploads/avatars/${user.Anh}`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      setAlertMessage('Lỗi khi lấy thông tin người dùng');
      setAlertVariant('danger');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserInfo({ ...userInfo, anh: file });
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('maNguoiDung', localStorage.getItem("MaNguoiDung"));
    formData.append('hoTen', userInfo.hoTen);
    formData.append('gioiTinh', userInfo.gioiTinh);
    formData.append('email', userInfo.email);
    formData.append('soDienThoai', userInfo.soDienThoai);
    
    if (userInfo.anh instanceof File) {
      formData.append('anh', userInfo.anh);
    }

    try {
      const response = await fetch('http://localhost/web2/server/api/updateUser.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setAlertMessage('Cập nhật thông tin thành công');
        setAlertVariant('success');
        setShowAlert(true);
        localStorage.setItem("HoTen", userInfo.hoTen);
        if (userInfo.anh) {
          localStorage.setItem("Anh", userInfo.anh);
        }
        // Lấy lại thông tin mới nhất
        fetchUserInfo();
      } else {
        throw new Error(data.message || 'Lỗi khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      setAlertMessage(error.message);
      setAlertVariant('danger');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userInfo.hoTen) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Thông tin cá nhân</h2>
          
          {showAlert && (
            <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible className="mb-4">
              {alertMessage}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded">
            <div className="text-center mb-4">
              <div className="d-flex flex-column align-items-center">
                <Image
                  src={previewImage || '/assets/default-avatar.png'}
                  roundedCircle
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  className="mb-3"
                />
                <label 
                  htmlFor="avatar-upload" 
                  className="btn btn-primary btn-sm"
                  style={{ cursor: 'pointer' }}
                >
                  Chọn ảnh
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="d-none"
                />
              </div>
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="hoTen"
                    value={userInfo.hoTen}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    name="gioiTinh"
                    value={userInfo.gioiTinh}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    name="soDienThoai"
                    value={userInfo.soDienThoai}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    pattern="[0-9]{10}"
                    title="Số điện thoại phải gồm 10 chữ số"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button 
                variant="success" 
                type="submit" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Đang lưu...</span>
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default TrangXemThongTinCaNhan;
