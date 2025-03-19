import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/MainNavCSS.css";
import { FaShoppingCart, FaUser } from "react-icons/fa";

function MainNav() {
  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm">
      <div className="container-fluid">
        <span className="navbar-text ms-3 fw-bold text-primary">
          📞 0123-456-789
        </span>
        
        <div className="mx-auto text-center">
          <img src="src/assets/logo1.png" alt="Brain Logo" height="100" className="d-block mx-auto" />
          <span className="fw-bold h4">SGU Fitness</span>
        </div>

        <div className="d-flex me-3">
          <button className="btn btn-outline-primary me-2">
            <FaShoppingCart /> Giỏ hàng
          </button>
          <button className="btn btn-primary">
            <FaUser /> Đăng nhập/Đăng ký
          </button>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
