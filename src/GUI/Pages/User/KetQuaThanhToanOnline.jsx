import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { XoaGioHang, XoaHoaDon } from "../../../DAL/apiGioHang.jsx";
import HoaDon from './Components/HoaDon.jsx';

export default function KetQuaThanhToanOnline() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const responseCode = params.get("vnp_ResponseCode");
  const orderId = params.get("vnp_TxnRef");
  const amount = params.get("vnp_Amount");

  const [showHoaDon, setShowHoaDon] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null); // null = chưa xử lý, true = thành công, false = thất bại

  const maHoaDon = JSON.parse(localStorage.getItem("maHoaDonThanhToan"));
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu không có mã hóa đơn, điều hướng về trang chủ
    if (!maHoaDon) {
      navigate("/");  // Chuyển hướng về trang chủ nếu không có mã hóa đơn
    }
  }, [maHoaDon, navigate]);

  const IDTaiKhoan = localStorage.getItem("IDTaiKhoan");

  useEffect(() => {
    if (responseCode === "00" && IDTaiKhoan) {
      XoaGioHang(IDTaiKhoan);
      setShowHoaDon(true);
      setIsSuccess(true);
    } else if (responseCode !== "00" && maHoaDon?.maHoaDon) {
      XoaHoaDon(maHoaDon.maHoaDon);
      setIsSuccess(false);
    }
  }, [responseCode, IDTaiKhoan, maHoaDon]);

  const handleContinueShopping = () => {
    navigate("/");  // Quay lại trang chủ sau khi thanh toán thành công hoặc thất bại
  };

  const messageStyle = {
    textAlign: "center",
    backgroundColor: isSuccess ? "#e6ffed" : "#ffe6e6",
    border: isSuccess ? "1px solid #b2f2bb" : "1px solid #ffb2b2",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    color: isSuccess ? "#2f855a" : "#c53030",
  };

  const messageTitleStyle = {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  };

  return (
    <div className="ket-qua-thanh-toan">
      <div style={messageStyle}>
        <h2 style={messageTitleStyle}>
          {isSuccess
            ? "Cảm ơn bạn đã mua hàng tại FITNESS SGU!"
            : "Thanh toán thất bại"}
        </h2>
        <p>
          {isSuccess
            ? "Chúng tôi rất vui khi bạn chọn mua sản phẩm của chúng tôi. Hóa đơn của bạn đã được xử lý thành công."
            : "Rất tiếc! Giao dịch của bạn không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
        </p>
      </div>

      {showHoaDon && <HoaDon maHoaDon={maHoaDon} />}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleContinueShopping}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: isSuccess ? "#2f855a" : "#c53030",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isSuccess ? "Tiếp tục mua hàng" : "Quay lại trang chủ"}
        </button>
      </div>
    </div>
  );
}
