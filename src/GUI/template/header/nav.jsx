import React from "react";
import "../assets/css/nav/nav.css";

function nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark d-md-block">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="./gioiThieu.jsx">Giới thiệu</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./vanChuyen.jsx">Vận chuyển</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./thanhToan.jsx">Thanh toán</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./huongDanMuaHang.jsx">Hướng dẫn mua hàng</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./chiTietLienHe.jsx">Chi tiết liên hệ</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./chinhSachBaoHanh.jsx">Chính sách bảo hành</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default nav;