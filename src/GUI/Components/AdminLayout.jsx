import React, { useState, useEffect  } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import Header from "./Header";
import { layThongTinTaiKhoan } from "../../DAL/apiDangNhapAdmin.jsx";
import "./css/AdminLayout.css";

// Danh sách menu cố định
const MENU_ITEMS = [
  "Trang chủ",
  "Quản lý khuyến mãi",
  "Quản lý hãng",
  "Quản lý nhà cung cấp",
  "Quản lý phiếu nhập",
  "Quản lý hàng hóa",
  "Quản lý chủng loại",
  "Quản lý đơn hàng",
  "Quản lý người dùng",
  "Quản lý phân quyền",
  "Tra cứu sản phẩm",
];

const AdminLayout = () => {
  console.log("--- AdminLayout Component Rendered ---");
  const [thongTinTKAdmin, setThongTinTKAdmin] = useState([]); 
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const IDTaiKhoan = localStorage.getItem("IDTaiKhoan");
    const IDQuyen = localStorage.getItem("IDQuyen");
    
    console.log("AdminLayout - IDTaiKhoan:", IDTaiKhoan);
    console.log("AdminLayout - IDQuyen:", IDQuyen);

    // Kiểm tra quyền admin
    if (!IDTaiKhoan || IDQuyen !== "1") {
      console.log("Redirecting to login - Invalid credentials");
      navigate("/admin/dang-nhap");
      return;
    }

    // Chỉ lấy thông tin cơ bản của tài khoản
    layThongTinTaiKhoan(IDTaiKhoan)
      .then((data) => {
        console.log("Admin account info:", data);
        setThongTinTKAdmin(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin tài khoản:", error);
        navigate("/admin/dang-nhap");
      });
  }, [navigate]);

  const getBreadcrumb = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
  
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

  const user = thongTinTKAdmin.length > 0 ? thongTinTKAdmin[0] : {};

  return (
    <>
      <Header user={{ name: user.HoTen, avatar: user.Anh }} toggleMenu={toggleMenu} />
      <div className="admin-layout">
        {isMenuOpen && <AdminSidebar />}
        <div className="admin-main">
          <div className="admin-header">
            <h2>{getBreadcrumb()}</h2>
          </div>
          <div className="admin-content">
            <Routes>
              <Route index element={<Navigate to="trang-chu" replace />} />
              <Route path="trang-chu" element={<TrangChu />} />
              <Route path="tra-cuu-san-pham" element={<TraCuuSanPham />} />
              <Route path="quan-ly-khuyen-mai" element={<QuanLyKhuyenMai />} />
              <Route path="quan-ly-hang" element={<QuanLyHang />} />
              <Route path="quan-ly-nha-cung-cap" element={<QuanLyNhaCungCap />} />
              <Route path="quan-ly-phieu-nhap" element={<QuanLyPhieuNhap />} />
              <Route path="quan-ly-hang-hoa" element={<QuanLyHangHoa />} />
              <Route path="quan-ly-chung-loai" element={<QuanLyChungLoai />} />
              <Route path="quan-ly-don-hang" element={<QuanLyDonHang />} />
              <Route path="quan-ly-nguoi-dung" element={<QuanLyNguoiDung />} />
              <Route path="quan-ly-phan-quyen" element={<QuanLyPhanQuyen />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
