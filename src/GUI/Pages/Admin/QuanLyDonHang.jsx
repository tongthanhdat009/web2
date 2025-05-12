import React from "react";
import BangHoaDon from "../../Components/QuanLyDonHang/BangHoaDon";
const QuanLyDonHang = ({Them, Sua, Xoa}) => {
  console.log({Them, Sua, Xoa});
  if(Sua !== null) {
    return (
      <div style={{ height: "fit-content", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px" }}>
        <h2 style={{ textAlign: "center", color: "brown", marginBottom: "20px" }}>Quản lý đơn hàng</h2>
          <BangHoaDon Sua = {Sua} />
      </div>
    );
  }
};

export default QuanLyDonHang;
