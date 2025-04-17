import { useState } from "react";
import { Button, Container, Row, Col, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HeaderDangNhapDangKy from "./Components/HeaderDangNhapDangKy";

function TrangDangNhapDangKy() {
  // State để kiểm soát hiển thị form đăng nhập hay đăng ký
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  // Hàm xử lý đăng ký
  const handleSubmitRegister = (e) => {
    e.preventDefault();
    // Xử lý logic đăng ký ở đây
    console.log("Đăng ký thành công");
    // Chuyển sang trang đăng nhập sau khi đăng ký thành công
    setShowLogin(true);
  };

  // Hàm xử lý đăng nhập  
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây
    console.log("Đăng nhập thành công");
    // Chuyển về trang chủ sau khi đăng nhập thành công
    localStorage.setItem("IDTKUser",1);
    navigate('/');
  };

  return (
    <div className="min-vh-100 bg-light">
      <HeaderDangNhapDangKy />    
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                {!showLogin ? (
                  // Form Đăng ký
                  <>
                    <h2 className="text-center mb-4">Đăng Ký</h2>
                    <Form onSubmit={handleSubmitRegister}>

                      <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg">
                          Đăng Ký
                        </Button>
                      </div>
                    </Form>
                    <div className="text-center mt-3">
                      <p>Đã có tài khoản? 
                        <Button 
                          variant="link" 
                          className="p-0 ms-1" 
                          onClick={() => setShowLogin(true)}
                        >
                          Đăng nhập ngay
                        </Button>
                      </p>
                    </div>
                  </>
                ) : (
                  // Form Đăng nhập
                  <>
                    <h2 className="text-center mb-4">Đăng Nhập</h2>
                    <Form onSubmit={handleSubmitLogin}>

                      <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg">
                          Đăng Nhập
                        </Button>
                      </div>
                    </Form>
                    <div className="text-center mt-3">
                      <p>Chưa có tài khoản? 
                        <Button 
                          variant="link" 
                          className="p-0 ms-1" 
                          onClick={() => setShowLogin(false)}
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
  );
}

export default TrangDangNhapDangKy;