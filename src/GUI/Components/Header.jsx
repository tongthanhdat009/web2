import "./css/Header.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/HeaderAdmin.css";
import DanhMuc from "./TrangChuNguoiDung/DanhMuc";

const Header = ({ user, toggleMenu }) => {
  const navigate = useNavigate();

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("IDTaiKhoan");
    localStorage.removeItem("IDQuyen");
    localStorage.removeItem("MaNguoiDung");
    localStorage.removeItem("HoTen");
    localStorage.removeItem("Anh");
    localStorage.removeItem("IDTaiKhoanAdmin");
    localStorage.removeItem("TaiKhoanAdmin");
    localStorage.removeItem("MatKhauAdmin");
    navigate("/admin/dang-nhap-admin");
  };
  console.log(user);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white px-3 d-flex align-items-center">
        <img className="logoimg" src="/assets/logo2.png" alt="" />
        <span className="logo">SGU Fitness</span>
        <button className="menu-toggle ms-3" onClick={toggleMenu}>☰</button>
        <div className="d-flex ms-auto align-items-center">
        {user && (
          <div className="d-flex align-items-center me-3">
            <span className="user-info-responsive">
                <img
                src={
                    !user.avatar || user.avatar === "NULL"
                    ? "/assets/avatar/0.png"
                    : `http://localhost/web2/server/uploads/avatars/${user.avatar}`
                }
                alt="Avatar"
                className="rounded-circle me-2"
                width="40"
                height="40"
                />

              <span>{user.name}</span>
            </span>
            <button className="btn btn-danger ms-3" onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
        </div>
      </nav>
    </>
  );
};
export default Header;

