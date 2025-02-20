import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">MyApp</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Trang chủ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Giới thiệu</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Liên hệ</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;