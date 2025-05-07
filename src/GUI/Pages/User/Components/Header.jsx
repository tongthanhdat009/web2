import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Form, InputGroup, Image, Row, Col, Stack, Dropdown, Toast, ToastContainer } from 'react-bootstrap';
import { Search, ChatDots, Cart, Person } from 'react-bootstrap-icons'; // Import icons
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const IDTaiKhoan = localStorage.getItem("IDTaiKhoan");
    if (IDTaiKhoan) {
      // Lấy thông tin người dùng từ localStorage hoặc API
      const userData = {
        HoTen: localStorage.getItem("HoTen"),
        Anh: localStorage.getItem("Anh")
      };
      setUserInfo(userData);
    }

    // Kiểm tra URL để hiển thị thông báo phù hợp
    if (location.pathname === '/dang-nhap-dang-ky' && location.search.includes('success=true')) {
      setToastMessage('Đăng nhập thành công!');
      setToastType('success');
      setShowToast(true);
    } else if (location.pathname === '/dang-nhap-dang-ky' && location.search.includes('register=true')) {
      setToastMessage('Đăng ký thành công!');
      setToastType('success');
      setShowToast(true);
    }
  }, [location]);

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("IDTaiKhoan");
    localStorage.removeItem("IDQuyen");
    localStorage.removeItem("HoTen");
    localStorage.removeItem("Anh");
    setUserInfo(null);
    
    // Hiển thị thông báo đăng xuất
    setToastMessage('Đăng xuất thành công!');
    setToastType('success');
    setShowToast(true);
    
    // Chuyển hướng về trang chủ sau 1.5 giây
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <>
      <ToastContainer 
        position="top-end" 
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastType}
        >
          <Toast.Header>
            <strong className="me-auto">Thông báo</strong>
            <small>Vừa xong</small>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Navbar bg="light" variant="light" className="border-bottom" style={{height: 'fit-content'}}>
        <Container fluid className="px-md-5">
          <Row className="w-100 align-items-center">

            <Col xs="auto" md={3} className="d-flex align-items-center">
              <Navbar.Brand href="/" className="d-flex align-items-center me-auto">
                <Image
                  src="/assets/logo2.png"
                  width="60" 
                  height="60"
                  className="d-inline-block align-top me-2"
                  alt="SGU Fitness Club Logo"
                  roundedCircle
                />
                <span className="fw-bold fs-4 text-primary fst-italic">SGU FITNESS</span>
              </Navbar.Brand>
            </Col>

            <Col xs={12} md={6} className="my-2 my-md-0">
              <Form className="d-flex">
                 <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                        <Search color="grey" />
                    </InputGroup.Text>
                    <Form.Control
                        type="search"
                        placeholder="Tìm kiếm sản phẩm..."
                        aria-label="Search"
                        style={{ borderLeft: 'none' }}
                        className="me-2" 
                    />
                 </InputGroup>
              </Form>
            </Col>

            <Col xs="auto" md={3} className="ms-md-auto">
              <Nav className="justify-content-end align-items-center">
                <Nav.Link href="/lien-he" className="text-center px-2">
                  <Stack gap={1} className="align-items-center">
                    <ChatDots size={24} />
                    <small>Hỗ trợ</small>
                  </Stack>
                </Nav.Link>
                <Nav.Link href="/gio-hang" className="text-center px-2">
                  <Stack gap={1} className="align-items-center">
                    <Cart size={24} />
                    <small>Giỏ hàng</small>
                  </Stack>
                </Nav.Link>
                {userInfo ? (
                  <Dropdown className="text-center ps-2 pe-0">
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
                      <Stack gap={1} className="align-items-center">
                        <Person size={24} />
                        <small>{userInfo.HoTen}</small>
                      </Stack>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="/thong-tin-tai-khoan">Thông tin tài khoản</Dropdown.Item>
                      <Dropdown.Item href="/don-hang-cua-toi">Đơn hàng của tôi</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Nav.Link href="/dang-nhap-dang-ky" className="text-center ps-2 pe-0">
                    <Stack gap={1} className="align-items-center">
                      <Person size={24} />
                      <small>Đăng nhập</small>
                    </Stack>
                  </Nav.Link>
                )}
              </Nav>
            </Col>

          </Row>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;