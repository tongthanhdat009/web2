import React from 'react';
import { Navbar, Container, Nav, Form, InputGroup, Image, Row, Col, Stack } from 'react-bootstrap';
import { Search, ChatDots, Cart, Person } from 'react-bootstrap-icons'; // Import icons


function Header() {
  return (
    <>
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
                <Nav.Link href="/dang-nhap-dang-ky" className="text-center ps-2 pe-0">
                  <Stack gap={1} className="align-items-center">
                    <Person size={24} />
                    <small>Đăng nhập</small>
                  </Stack>
                </Nav.Link>
              </Nav>
            </Col>

          </Row>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;