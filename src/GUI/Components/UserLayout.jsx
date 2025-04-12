import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <h1>Trang Bán Hàng</h1>
      <nav>
        <a href="/">Trang Chủ</a>
        <a href="/shop">Cửa Hàng</a>
        <a href="/cart">Giỏ Hàng</a>
      </nav>
      <div>
        <Outlet /> {/* Hiển thị các trang con bên trong */}
      </div>
    </div>
  );
};

export default UserLayout;
