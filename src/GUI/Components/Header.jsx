import "./css/Header.css";
import React from "react";
import { useNavigate } from "react-router-dom"; // Để điều hướng tới trang đăng nhập

const Header = ({ user, toggleMenu }) => {
  const navigate = useNavigate();
  
  // Hàm đăng xuất
  const handleLogout = () => {
    // Xóa tất cả thông tin đăng nhập trong localStorage
    localStorage.removeItem("IDTaiKhoan");
    localStorage.removeItem("IDQuyen");
    localStorage.removeItem("MaNguoiDung");
    localStorage.removeItem("HoTen");
    localStorage.removeItem("Anh");
    localStorage.removeItem("IDTKAdmin"); // Xóa cả key cũ để đảm bảo

    // Điều hướng về trang chủ
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white px-3 d-flex align-items-center">
      <img className="logoimg" src="/assets/logo2.png" alt="" />
      <span className="logo">SGU Fitness</span>
      <button className="menu-toggle ms-3" onClick={toggleMenu}>☰</button>
      <div className="d-flex ms-auto align-items-center">
        {user && (
          <div className="d-flex align-items-center me-3">
            <img
              // Kiểm tra avatar: nếu avatar là 'NULL' hoặc null, dùng ảnh mặc định
              src={user.avatar === "NULL" || !user.avatar ? "/assets/avatar/0.png" : user.avatar}
              alt="Avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <span>{user.name}</span>
            {/* Nút đăng xuất */}
            <button className="btn btn-danger ms-3" onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
