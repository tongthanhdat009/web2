import React from "react";
import BangHoaDon from "../../Components/QuanLyDonHang/BangHoaDon";
const QuanLyDonHang = () => {
  return (
    <div style={{ height: "fit-content", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "brown", marginBottom: "20px" }}>Quản lý đơn hàng</h2>
        <BangHoaDon />
    </div>
  );
};

export default QuanLyDonHang;
