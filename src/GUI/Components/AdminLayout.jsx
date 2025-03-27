import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import "./css/AdminLayout.css"; 

import TrangChu from "../Pages/Admin/TrangChu";
import TraCuuSanPham from "../Pages/Admin/TraCuuSanPham";
const AdminLayout = ({ isMenuOpen, TenChucNang }) => {
  const [selectedFunction, setSelectedFunction] = useState("Trang chủ");
  const menuItems = [
    "Trang chủ", "Quản lý khuyến mãi", "Quản lý hãng", "Quản lý nhà cung cấp",
    "Quản lý phiếu nhập", "Quản lý hàng hóa", "Quản lý chủng loại",
    "Quản lý đơn hàng", "Quản lý người dùng",
    "Quản lý phân quyền", "Tra cứu sản phẩm"
  ];
  const components = {
    "Trang chủ": TrangChu,
    // "Quản lý khuyến mãi": QuanLyKhuyenMai,
    // "Quản lý hãng": QuanLyHang,
    // "Quản lý nhà cung cấp": QuanLyNhaCungCap,
    // "Quản lý phiếu nhập": QuanLyPhieuNhap,
    // "Quản lý hàng hóa": QuanLyHangHoa,
    // "Quản lý chủng loại": QuanLyChungLoai,
    // "Quản lý đơn hàng": QuanLyDonHang,
    // "Quản lý người dùng": QuanLyNguoiDung,
    // "Quản lý phân quyền": QuanLyPhanQuyen,
    "Tra cứu sản phẩm": TraCuuSanPham,
  };
  const ComponentToRender = components[selectedFunction] || TrangChu;
  console.log("ComponentToRender:", ComponentToRender);
  console.log("selectedFunction:", selectedFunction);
  return (
    <div className="admin-layout">
      {isMenuOpen && <AdminSidebar menuItems={menuItems} setSelectedFunction={setSelectedFunction}/>}
      <div className="admin-main">
        <div className="admin-header">
          <h2>{selectedFunction}</h2>
        </div>

        <ComponentToRender />
      </div>
    </div>
  );
};

export default AdminLayout;
