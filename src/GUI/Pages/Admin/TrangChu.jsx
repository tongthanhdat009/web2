import React from "react";
import ThongKePhieuNhap from "../../Components/TrangChuAdmin/ThongKePhieuNhap";
import ThongKeSanPhamDaNhap from "../../Components/TrangChuAdmin/ThongKeSanPhamDaNhap";
import ThongKeHangDaNhap from "../../Components/TrangChuAdmin/ThongKeHangDaNhap";
import ThongKeHoaDon from "../../Components/TrangChuAdmin/ThongKeHoaDon";
import ThongKeSanPhamMuaNhieuNhat from "../../Components/TrangChuAdmin/ThongKeSanPhamMuaNhieuNhat";
import ThongKeDoanhThuTheoHang from "../../Components/TrangChuAdmin/ThongKeDoanhThuTheoHang";
import ThongKeNguoiDung from "../../Components/TrangChuAdmin/ThongKeNguoiDung";
const TrangChu = () => {
  return (
    <div style={{ height: "fit-content", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px" }}>
      <h2 className="text-center mb-2" style={{color: "brown"}}>Trang chủ</h2>
      <ThongKeNguoiDung/>
      <ThongKePhieuNhap/>
      <div className="d-flex">
        <ThongKeSanPhamDaNhap/>
        <ThongKeHangDaNhap/>
      </div>
      <ThongKeHoaDon/>
      <div className="d-flex">
        <ThongKeSanPhamMuaNhieuNhat/>
        <ThongKeDoanhThuTheoHang/>
      </div>
    </div>
  );
};

export default TrangChu;
