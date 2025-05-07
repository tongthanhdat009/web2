import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dangNhap } from "../../../DAL/apiDangNhapAdmin.jsx";

const DangNhapAdmin = () => {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dangNhap(taiKhoan, matKhau);
      localStorage.setItem("TaiKhoanAdmin", taiKhoan);
      localStorage.setItem("MatKhauAdmin", matKhau);
      navigate("/admin");
    } catch (error) {
      setError(error.message);
    }
  };
    
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center">Đăng nhập Admin</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Tên tài khoản</label>
            <input
              type="text"
              className="form-control"
              value={taiKhoan}
              onChange={(e) => setTaiKhoan(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default DangNhapAdmin;
