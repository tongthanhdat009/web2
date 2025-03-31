import "./css/Header.css";
import React from "react";

const Header = ({ user, toggleMenu }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white px-3 d-flex align-items-center">
      <img className="logoimg" src="/assets/logo2.png" alt="" />
      <span className="logo">SGU Fitness</span>
      <button className="menu-toggle ms-3" onClick={toggleMenu}>☰</button> {/* Chỉ gọi toggleMenu */}
      <div className="d-flex ms-auto align-items-center">
        {user && (
          <div className="d-flex align-items-center me-3">
            <img
              src={user.avatar}
              alt="Avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <span>{user.name}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
