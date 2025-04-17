import { Navbar, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

function HeaderDangNhapDangKy() {
  return (
    <Navbar bg="light" variant="light" className="border-bottom" style={{ height: 'fit-content' }}>
      <Container fluid className="px-md-5">
        <Link to="/" className="text-decoration-none">
          <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Trang chủ
          </Button>
        </Link>
        
        <Navbar.Brand className="mx-auto d-flex align-items-center">
          <img
            src="/assets/logo2.png"
            width="60"
            height="60"
            className="d-inline-block align-top me-2"
            alt="SGU Fitness Club Logo"
          />
          <span className="fw-bold fs-4 text-primary fst-italic">SGU FITNESS</span>
        </Navbar.Brand>
        
        <div style={{ width: '110px' }}></div>
      </Container>
    </Navbar>
  );
}

export default HeaderDangNhapDangKy;