import React, { useState, useEffect } from "react";
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
import { layThongTinTaiKhoan } from "../../DAL/apiDangNhapAdmin";
import { dangNhap } from "../../DAL/apiDangNhapAdmin";
import "./css/AdminLayout.css";

const AdminLayout = () => {
  const [thongTinTKAdmin, setThongTinTKAdmin] = useState([]); 
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [quyen, setQuyen] = useState([]); // Thêm state cho quyền
  const [allowedRoutes, setAllowedRoutes] = useState([]); // Mảng các đường dẫn hợp lệ
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const tenTaiKhoan = localStorage.getItem("TaiKhoanAdmin");
    const matKhau = localStorage.getItem("MatKhauAdmin");

    const loginAndFetchInfo = async () => {
      try {
        // Đăng nhập và nhận thông tin tài khoản
        const result = await dangNhap(tenTaiKhoan, matKhau);
        localStorage.setItem("IDTaiKhoanAdmin", result.idTaiKhoan);
        // Nếu đăng nhập thành công, lấy thông tin tài khoản
        const thongTin = await layThongTinTaiKhoan(result.idTaiKhoan);
        setThongTinTKAdmin(thongTin);

        const quyenResponse = await fetch(`http://localhost/web2/server/api/getQuyen.php?IDTaiKhoan=${result.idTaiKhoan}`);
        const quyenData = await quyenResponse.json();  // Trích xuất dữ liệu JSON
        setQuyen(quyenData.data);

        // Tạo mảng các đường dẫn hợp lệ từ TenChucNang
        const validRoutes = quyenData.data.map(item => reversePathMapping(item.TenChucNang)).filter(Boolean);
        setAllowedRoutes(validRoutes);
      } catch (error) {
        // Nếu có lỗi xảy ra, có thể chuyển hướng về trang đăng nhập
        console.error("Lỗi đăng nhập:", error);
        navigate("/admin/dang-nhap-admin");
      }
    };

    // Nếu có tài khoản và mật khẩu trong localStorage thì thực hiện đăng nhập
    if (tenTaiKhoan && matKhau) {
      loginAndFetchInfo();
    } else {
      navigate("/admin/dang-nhap-admin"); // Chuyển hướng nếu không có thông tin đăng nhập
    }
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

  const reversePathMapping = (pageName) => {
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
    for (let key in pathMapping) {
      if (pathMapping[key] === pageName) {
        return key; // Trả về đường dẫn tương ứng
      }
    }
    return null;
  };

  const user = thongTinTKAdmin.length > 0 ? thongTinTKAdmin[0] : {};
  return (
    <>
      <Header user={{ name: user.HoTen, avatar: user.Anh }} toggleMenu={toggleMenu} />
      <div className="admin-layout">
        {isMenuOpen && <AdminSidebar menuItems={Array.isArray(quyen) ? quyen.map((item) => item.TenChucNang) : []} />}
        <div className="admin-main">
          <div className="admin-header">
            <h2>{getBreadcrumb()}</h2>
          </div>
          <div className="admin-content">
            <Routes>
              <Route index element={<Navigate to={allowedRoutes.length > 0 ? `/admin/${allowedRoutes[0]}` : "/admin"} replace />} />
              {allowedRoutes.includes('trang-chu') && <Route path="trang-chu" element={<TrangChu />} />}
              {allowedRoutes.includes('tra-cuu-san-pham') && <Route path="tra-cuu-san-pham" element={<TraCuuSanPham />} />}
              {allowedRoutes.includes('quan-ly-khuyen-mai') && <Route path="quan-ly-khuyen-mai" element={<QuanLyKhuyenMai />} />}
              {allowedRoutes.includes('quan-ly-hang') && <Route path="quan-ly-hang" element={<QuanLyHang />} />}
              {allowedRoutes.includes('quan-ly-nha-cung-cap') && <Route path="quan-ly-nha-cung-cap" element={<QuanLyNhaCungCap />} />}
              {allowedRoutes.includes('quan-ly-phieu-nhap') && <Route path="quan-ly-phieu-nhap" element={<QuanLyPhieuNhap />} />}
              {allowedRoutes.includes('quan-ly-hang-hoa') && <Route path="quan-ly-hang-hoa" element={<QuanLyHangHoa />} />}
              {allowedRoutes.includes('quan-ly-chung-loai') && <Route path="quan-ly-chung-loai" element={<QuanLyChungLoai />} />}
              {allowedRoutes.includes('quan-ly-don-hang') && <Route path="quan-ly-don-hang" element={<QuanLyDonHang />} />}
              {allowedRoutes.includes('quan-ly-nguoi-dung') && <Route path="quan-ly-nguoi-dung" element={<QuanLyNguoiDung />} />}
              {allowedRoutes.includes('quan-ly-phan-quyen') && <Route path="quan-ly-phan-quyen" element={<QuanLyPhanQuyen />} />}
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
