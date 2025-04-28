import React from "react";
import { Outlet } from "react-router-dom";
import NavGioiThieuTrangWeb from "../Pages/User/Components/NavGioiThieuTrangWeb";
import Footer from "../Pages/User/Components/Footer";
import Header from "../Pages/User/Components/Header";
import DanhMuc from "../Components/TrangChuNguoiDung/DanhMuc";
const UserLayout = () => {
  return (
    <>
      <NavGioiThieuTrangWeb />
      <Header/>
      <DanhMuc/>
      <div className="content flex-grow-1" style={{ height: "fit-content"}}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default UserLayout;