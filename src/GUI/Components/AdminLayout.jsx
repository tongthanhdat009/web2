import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import TrangChu from "../Pages/Admin/TrangChu";
import TraCuuSanPham from "../Pages/Admin/TraCuuSanPham";
import QuanLyKhuyenMai from "../Pages/Admin/QuanLyKhuyenMai";
import QuanLyHang from "../Pages/Admin/QuanLyHang";  
import QuanLyNhaCungCap from "../Pages/Admin/QuanLyNhaCungCap";
import QuanLyPhieuNhap from "../Pages/Admin/QuanLyPhieuNhap"; 
import QuanLyHangHoa from "../Pages/Admin/QuanLyHangHoa";
import QuanLyChungLoai from "../Pages/Admin/QuanLyChungLoai";
import QuanLyDonHang from "../Pages/Admin/QuanLyDonHang";
import QuanLyNguoiDung from "../Pages/Admin/QuanLyNguoiDung";
import QuanLyPhanQuyen from "../Pages/Admin/QuanLyPhanQuyen";
import "./css/AdminLayout.css";

const AdminLayout = ({ isMenuOpen }) => {
  const location = useLocation();

  // Tạo đường dẫn dạng "admin\Trang chủ"
  const getBreadcrumb = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
  
    // Bảng ánh xạ đường dẫn → Tiêu đề hiển thị
    const pathMapping = {
      "trang-chu": "Trang chủ",
      "quan-ly-khuyen-mai": "Quản lý khuyến mãi",
      "quan-ly-hang": "Quản lý hãng",
      "quan-ly-nha-cung-cap": "Quản lý nhà cung cấp",
      "quan-ly-phieu-nhap": "Quản lý phiếu nhập",
      "quan-ly-hang-hoa": "Quản lý hàng hóa",
      "quan-ly-chung-loai": "Quản lý chủng loại",
      "quan-ly-don-hang": "Quản lý đơn hàng",
      "quan-ly-nguoi-dung": "Quản lý người dùng",
      "quan-ly-phan-quyen": "Quản lý phân quyền",
      "tra-cuu-san-pham": "Tra cứu sản phẩm",
    };
  
    return `${pathParts.slice(1).map(part => pathMapping[part] || part).join(" \\ ")}`;
  };
  const menuItems = [
    "Trang chủ", "Quản lý khuyến mãi", "Quản lý hãng", "Quản lý nhà cung cấp",
    "Quản lý phiếu nhập", "Quản lý hàng hóa", "Quản lý chủng loại",
    "Quản lý đơn hàng", "Quản lý người dùng",
    "Quản lý phân quyền", "Tra cứu sản phẩm"
  ];

  return (
    <div className="admin-layout">
      {isMenuOpen && <AdminSidebar menuItems = {menuItems}/>}
      <div className="admin-main">
        <div className="admin-header">
          <h2>{getBreadcrumb()}</h2>
        </div>
        <div className="admin-content">
          <Routes>
          <Route path="/" element={<Navigate to="/admin/trang-chu" />} />
            <Route path="/admin" element={<Navigate to="/admin/trang-chu" />} />
            <Route path="/admin/trang-chu" element={<TrangChu />} />
            <Route path="/admin/tra-cuu-san-pham" element={<TraCuuSanPham />} />
            <Route path="/admin/quan-ly-khuyen-mai" element={<QuanLyKhuyenMai />} />
            <Route path="/admin/quan-ly-hang" element={<QuanLyHang />} />
            <Route path="/admin/quan-ly-nha-cung-cap" element={<QuanLyNhaCungCap />} />
            <Route path="/admin/quan-ly-phieu-nhap" element={<QuanLyPhieuNhap />} />
            <Route path="/admin/quan-ly-hang-hoa" element={<QuanLyHangHoa />} />
            <Route path="/admin/quan-ly-chung-loai" element={<QuanLyChungLoai />} />
            <Route path="/admin/quan-ly-don-hang" element={<QuanLyDonHang />} />
            <Route path="/admin/quan-ly-nguoi-dung" element={<QuanLyNguoiDung />} />
            <Route path="/admin/quan-ly-phan-quyen" element={<QuanLyPhanQuyen />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
