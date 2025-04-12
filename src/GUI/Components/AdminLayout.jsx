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
import Header from "./Header"; // Import Header nếu chưa có
import { layThongTinTaiKhoan } from "../../DAL/apiDangNhapAdmin.jsx";
import "./css/AdminLayout.css";

const AdminLayout = () => {
  const [thongTinTKAdmin, setThongTinTKAdmin] = useState([]); // biến lưu mảng thông tin
  const [menuItems, setMenu] = useState([]);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  useEffect(() => {
    const IDTKAdmin = localStorage.getItem("IDTKAdmin");
    console.log("IDTKAdmin:", IDTKAdmin);

    if (!IDTKAdmin) {
      navigate("/admin/dang-nhap-admin");
    } else {
      layThongTinTaiKhoan(IDTKAdmin)
        .then((data) => {
          setThongTinTKAdmin(data); // lưu vào state
          const menuItems = data.map(item => item.TenChucNang); // tạo danh sách TenChucNang
          setMenu(menuItems); // gán vào biến menu
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin tài khoản:", error);
        });
    }
  }, [navigate]);

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
  const user = thongTinTKAdmin.length > 0 ? thongTinTKAdmin[0] : {};

  return (
    <>
      <Header user={{ name: user.HoTen, avatar: user.Anh }} toggleMenu={toggleMenu} />
      <div className="admin-layout">
        {isMenuOpen && <AdminSidebar menuItems={menuItems} />}
        <div className="admin-main">
          <div className="admin-header">
            <h2>{getBreadcrumb()}</h2>
          </div>
          <div className="admin-content">
            <Routes>
              <Route path="/admin" element={<Navigate to="/admin/trang-chu" />} />
              <Route path="/trang-chu" element={<TrangChu />} />
              <Route path="/tra-cuu-san-pham" element={<TraCuuSanPham />} />
              <Route path="/quan-ly-khuyen-mai" element={<QuanLyKhuyenMai />} />
              <Route path="/quan-ly-hang" element={<QuanLyHang />} />
              <Route path="/quan-ly-nha-cung-cap" element={<QuanLyNhaCungCap />} />
              <Route path="/quan-ly-phieu-nhap" element={<QuanLyPhieuNhap />} />
              <Route path="/quan-ly-hang-hoa" element={<QuanLyHangHoa />} />
              <Route path="/quan-ly-chung-loai" element={<QuanLyChungLoai />} />
              <Route path="/quan-ly-don-hang" element={<QuanLyDonHang />} />
              <Route path="/quan-ly-nguoi-dung" element={<QuanLyNguoiDung />} />
              <Route path="/quan-ly-phan-quyen" element={<QuanLyPhanQuyen />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
