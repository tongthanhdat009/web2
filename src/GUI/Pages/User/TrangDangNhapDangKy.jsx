import { useState, useEffect } from "react";
  import {
    Button,
    Container,
    Row,
    Col,
    Form,
    Card,
    Toast,
    ToastContainer,
    Spinner
  } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HeaderDangNhapDangKy from "./Components/HeaderDangNhapDangKy.jsx";
import './Components/css/TrangDangNhapDangKy.css';

function TrangDangNhapDangKy() {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // State cho form đăng nhập
  const [loginTenDangNhap, setLoginTenDangNhap] = useState("");
  const [loginMatKhau, setLoginMatKhau] = useState("");

  // State cho form đăng ký
  const [registerHoTen, setRegisterHoTen] = useState("");
  const [registerGioiTinh, setRegisterGioiTinh] = useState("Nam");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerSoDienThoai, setRegisterSoDienThoai] = useState("");
  const [registerTenDangNhap, setRegisterTenDangNhap] = useState("");
  const [registerMatKhau, setRegisterMatKhau] = useState("");
  const [registerConfirmMatKhau, setRegisterConfirmMatKhau] = useState("");

  // Hàm đóng Toast
  const handleCloseNotification = () => setNotification({ ...notification, show: false });

  // Hàm xử lý đăng ký
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    handleCloseNotification();

    if (registerMatKhau !== registerConfirmMatKhau) {
      setNotification({ show: true, type: 'danger', message: 'Mật khẩu nhập lại không khớp.' });
      setLoading(false);
      return;
    }

    if (!registerHoTen || !registerEmail || !registerSoDienThoai || !registerTenDangNhap || !registerMatKhau) {
        setNotification({ show: true, type: 'danger', message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
        setLoading(false);
        return;
    }
    // Simple phone validation (basic check)
    if (!/^[0-9]{10}$/.test(registerSoDienThoai)) {
      setNotification({ show: true, type: 'danger', message: 'Số điện thoại không hợp lệ (cần 10 chữ số).' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost/web2/server/api/manageUsers.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hoTen: registerHoTen,
          gioiTinh: registerGioiTinh,
          email: registerEmail,
          soDienThoai: registerSoDienThoai,
          tenDangNhap: registerTenDangNhap,
          matKhau: registerMatKhau,
          // Không cần gửi idQuyen nếu muốn dùng giá trị mặc định ở backend
          // idQuyen: 3 
        })
      });

      // Kiểm tra response trước khi parse JSON
      if (!response.ok) {
        // Cố gắng đọc lỗi từ server nếu có
        let errorData = { message: `Đăng ký thất bại. Status: ${response.status}` };
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // Không thể parse JSON, dùng thông báo mặc định
        }
        throw new Error(errorData.message || 'Đăng ký thất bại.');
      }

      const data = await response.json();

      if (data.success) {
        setNotification({ show: true, type: 'success', message: 'Đăng ký thành công! Chuyển sang trang đăng nhập...' });
        // Reset form
        setRegisterHoTen("");
        setRegisterGioiTinh("Nam");
        setRegisterEmail("");
        setRegisterSoDienThoai("");
        setRegisterTenDangNhap("");
        setRegisterMatKhau("");
        setRegisterConfirmMatKhau("");
        setTimeout(() => {
           setShowLogin(true);
           handleCloseNotification();
        }, 2000);

        // Chuyển hướng với tham số register
        navigate("/dang-nhap-dang-ky?register=true");
      } else {
        setNotification({ show: true, type: 'danger', message: data.message || 'Đăng ký thất bại.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setNotification({ show: true, type: 'danger', message: error.message || 'Lỗi kết nối server.' });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đăng nhập
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    handleCloseNotification();

    if (!loginTenDangNhap || !loginMatKhau) {
        setNotification({ show: true, type: 'danger', message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
        setLoading(false);
        return;
    }

    try {
      // --- Bước 1: Gọi API đăng nhập --- 
      const loginResponse = await fetch('http://localhost/web2/server/api/kiemTraDangNhapAdmin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenTaiKhoan: loginTenDangNhap,
          matKhau: loginMatKhau
        })
      });

      if (!loginResponse.ok) {
        let errorData = { message: `Đăng nhập thất bại. Status: ${loginResponse.status}` };
        try {
          errorData = await loginResponse.json();
        } catch (jsonError) {}
        throw new Error(errorData.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      }

      const loginData = await loginResponse.json();
      console.log("Login Data:", loginData);

      if (loginData.idTaiKhoan) {
        // --- Bước 2: Nếu đăng nhập thành công, lấy thông tin chi tiết --- 
        const userInfoResponse = await fetch('http://localhost/web2/server/api/layThongTinDangNhapAdmin.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idTaiKhoan: loginData.idTaiKhoan
          })
        });
        
        if (!userInfoResponse.ok) {
          throw new Error("Lỗi khi lấy thông tin người dùng.");
        }

        const userInfo = await userInfoResponse.json();
        console.log("User Info:", userInfo);

        if (Array.isArray(userInfo) && userInfo.length > 0) {
          // --- Lưu thông tin vào localStorage --- 
          localStorage.setItem("MaNguoiDung", userInfo[0].MaNguoiDung);
          localStorage.setItem("IDTaiKhoan", loginData.idTaiKhoan);
          localStorage.setItem("IDQuyen", loginData.idQuyen); // Lưu cả quyền
          localStorage.setItem("HoTen", userInfo[0].HoTen); // Lưu họ tên
          localStorage.setItem("Anh", userInfo[0].Anh); // Lưu ảnh (nếu có)
          
          console.log("Stored in localStorage:", {
            MaNguoiDung: localStorage.getItem("MaNguoiDung"),
            IDTaiKhoan: localStorage.getItem("IDTaiKhoan"),
            IDQuyen: localStorage.getItem("IDQuyen"),
            HoTen: localStorage.getItem("HoTen"),
            Anh: localStorage.getItem("Anh")
          });

          // --- Cập nhật trạng thái hoạt động (online) --- 
          try {
            await fetch('http://localhost/web2/server/api/updateUserStatus.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                idTaiKhoan: loginData.idTaiKhoan,
                trangThai: 1 // 1 = online
              })
            });
          } catch (statusError) {
            console.error("Lỗi cập nhật trạng thái:", statusError);
          }

          // --- Thông báo và chuyển hướng --- 
          setNotification({ show: true, type: 'success', message: 'Đăng nhập thành công!' });
          setTimeout(() => {
            navigate('/');
          }, 1500);
          // Chuyển hướng với tham số success
          navigate("/dang-nhap-dang-ky?success=true");
        } else {
          throw new Error("Không tìm thấy thông tin người dùng.");
        }
      } else {
         // Trường hợp API login trả về success false hoặc không có idTaiKhoan
         setNotification({ show: true, type: 'danger', message: loginData.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
      }
    } catch (error) {
      console.error("Login Error:", error);
      setNotification({ show: true, type: 'danger', message: error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderDangNhapDangKy />

      <ToastContainer 
        position="fixed" 
        style={{ 
          top: "20px", 
          right: "20px", 
          zIndex: 9999,
          position: "fixed"
        }}
      >
        <Toast 
          onClose={handleCloseNotification} 
          show={notification.show} 
          delay={3000} 
          autohide
          bg={notification.type}
          className="text-white"
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">Thông báo</strong>
          </Toast.Header>
          <Toast.Body>{notification.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="dangnhap-dangky-page">
        <Container>
          <Row className="justify-content-center">
            <Col>
              <Card className="dangnhap-dangky-card">
                <div className="dangnhap-dangky-card-header-gradient position-relative">
                  <div className="w-100 text-center">
                    <h2 className="mb-0">{showLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>
                  </div>
                  <button
                    type="button"
                    className="dangnhap-dangky-close-btn"
                    onClick={() => navigate('/')}
                    aria-label="Đóng"
                  >
                    ×
                  </button>
                </div>
                <Card.Body>
                  {!showLogin ? (
                    <>
                      <Form onSubmit={handleSubmitRegister} noValidate>
                        <Form.Group className="mb-3" controlId="registerHoTen">
                          <Form.Label className="dangnhap-dangky-form-label">Họ và tên<span className="dangnhap-dangky-text-danger">*</span></Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="text" placeholder="Nhập họ và tên" value={registerHoTen} onChange={(e) => setRegisterHoTen(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerGioiTinh">
                          <Form.Label className="dangnhap-dangky-form-label">Giới tính<span className="dangnhap-dangky-text-danger">*</span></Form.Label>
                          <Form.Select className="dangnhap-dangky-form-select" value={registerGioiTinh} onChange={(e) => setRegisterGioiTinh(e.target.value)} required>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerEmail">
                          <Form.Label className="dangnhap-dangky-form-label">Email<span className="dangnhap-dangky-text-danger">*</span></Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="email" placeholder="Nhập địa chỉ email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="registerSoDienThoai">
                          <Form.Label className="dangnhap-dangky-form-label">Số điện thoại<span className="dangnhap-dangky-text-danger">*</span></Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="tel" placeholder="Nhập số điện thoại" value={registerSoDienThoai} onChange={(e) => setRegisterSoDienThoai(e.target.value)} required pattern="[0-9]{10}" title="Số điện thoại phải gồm 10 chữ số"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerTenDangNhap">
                          <Form.Label className="dangnhap-dangky-form-label">Tên đăng nhập<span className="dangnhap-dangky-text-danger">*</span></Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="text" placeholder="Nhập tên đăng nhập" value={registerTenDangNhap} onChange={(e) => setRegisterTenDangNhap(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerMatKhau">
                          <Form.Label className="dangnhap-dangky-form-label">Mật khẩu<span className="dangnhap-dangky-text-danger">*</span></Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="password" placeholder="Nhập mật khẩu" value={registerMatKhau} onChange={(e) => setRegisterMatKhau(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerConfirmMatKhau">
                          <Form.Label className="dangnhap-dangky-form-label">Nhập lại mật khẩu<span className="dangnhap-dangky-text-danger">*</span></Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="password" placeholder="Nhập lại mật khẩu" value={registerConfirmMatKhau} onChange={(e) => setRegisterConfirmMatKhau(e.target.value)} required />
                        </Form.Group>

                        <div className="d-grid gap-2 mt-4">
                          <Button className="dangnhap-dangky-btn-primary" variant="primary" type="submit" size="lg" disabled={loading}>
                            {loading ? (
                              <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                                Đang xử lý...
                              </>
                            ) : 'Đăng Ký'}
                          </Button>
                        </div>
                      </Form>
                      <div className="text-center mt-4">
                        <p className="mb-0">Đã có tài khoản? 
                          <Button 
                            className="dangnhap-dangky-btn-link p-0 ms-1"
                            variant="link" 
                            onClick={() => { setShowLogin(true); handleCloseNotification(); }}
                            disabled={loading}
                          >
                            Đăng nhập ngay
                          </Button>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Form onSubmit={handleSubmitLogin}>
                        <Form.Group className="mb-3" controlId="loginTenDangNhap">
                          <Form.Label className="dangnhap-dangky-form-label">Tên đăng nhập</Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="text" placeholder="Nhập tên đăng nhập" value={loginTenDangNhap} onChange={(e) => setLoginTenDangNhap(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="dangnhap-dangky-form-label">Mật khẩu</Form.Label>
                          <Form.Control className="dangnhap-dangky-form-control" type="password" placeholder="Nhập mật khẩu" value={loginMatKhau} onChange={(e) => setLoginMatKhau(e.target.value)} required />
                        </Form.Group>
                        
                        <div className="d-grid gap-2">
                          <Button className="dangnhap-dangky-btn-primary" variant="primary" type="submit" size="lg" disabled={loading}>
                             {loading ? (
                              <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                                Đang xử lý...
                              </>
                            ) : 'Đăng Nhập'}
                          </Button>
                        </div>
                      </Form>
                      <div className="text-center mt-4">
                        <p className="mb-0">Chưa có tài khoản? 
                          <Button 
                            className="dangnhap-dangky-btn-link p-0 ms-1"
                            variant="link" 
                            onClick={() => { setShowLogin(false); handleCloseNotification(); }}
                            disabled={loading}
                          >
                            Đăng ký ngay
                          </Button>
                        </p>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default TrangDangNhapDangKy;