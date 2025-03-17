import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import "./css/InforNavCSS.css";

function InforNav() {
  return (
    <div className="infor-nav">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Giới thiệu</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Vận chuyển</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Thanh toán</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Liên hệ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Hướng dẫn mua hàng</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Tra cứu bảo hành</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default InforNav;
