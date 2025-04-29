import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./Components/UserLayout";
import AdminLayout from "./Components/AdminLayout";
import DangNhapAdmin from "./Pages/Admin/DangNhapAdmin";

import TrangGioiThieu from "./Pages/User/TrangGioiThieu/TrangGioiThieu";
import TrangVanChuyen from "./Pages/User/TrangGioiThieu/TrangVanChuyen";
import TrangThanhToan from "./Pages/User/TrangGioiThieu/TrangThanhToan";
import TrangLienHe from "./Pages/User/TrangGioiThieu/TrangLienHe";
import TrangHuongDanMuaHang from "./Pages/User/TrangGioiThieu/TrangHuongDanMuaHang";
import TrangChinhSachBaoHanh from "./Pages/User/TrangGioiThieu/TrangChinhSachBaoHanh";
import TrangTraCuuSanPham from "./Pages/User/TrangGioiThieu/TrangTraCuuSanPham";
import TrangGioHang from "./Pages/User/TrangGioHang";
import TrangDangNhapDangKy from "./Pages/User/TrangDangNhapDangKy";
import TrangChuUser from "./Pages/User/TrangChuUser";
import TrangChiTietHangHoa from "./Pages/User/TrangChiTietHangHoa";
import TrangSanPhamTheoTheLoai from "./Pages/User/TrangSanPhamTheoTheLoai";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />} >
          <Route index element={<TrangChuUser />} />
          <Route path="gioi-thieu" element={<TrangGioiThieu />} />
          <Route path="van-chuyen" element={<TrangVanChuyen />} />
          <Route path="thanh-toan" element={<TrangThanhToan />} />
          <Route path="lien-he" element={<TrangLienHe />} />
          <Route path="huong-dan-mua-hang" element={<TrangHuongDanMuaHang />} />
          <Route path="chinh-sach-bao-hanh" element={<TrangChinhSachBaoHanh />} />
          <Route path="tra-cuu-san-pham" element={<TrangTraCuuSanPham />} />
          <Route path="gio-hang" element={<TrangGioHang />} />
          <Route path="the-loai/:maTheLoai" element={<TrangSanPhamTheoTheLoai />} />
          <Route path="/the-loai/:maTheLoai/:maChungLoaiUrl?" element={<TrangSanPhamTheoTheLoai />} />
        </Route>
        <Route path="/dang-nhap-dang-ky" element={<TrangDangNhapDangKy />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/admin/dang-nhap-admin" element={<DangNhapAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
