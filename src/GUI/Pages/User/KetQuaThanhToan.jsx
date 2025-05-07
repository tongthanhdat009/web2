import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HoaDon from './Components/HoaDon.jsx';
import { XoaGioHang } from "../../../DAL/apiGioHang.jsx";

export default function KetQuaThanhToan() {
  const navigate = useNavigate();
  const maHoaDon = JSON.parse(localStorage.getItem("maHoaDonThanhToan"));

  // Kiểm tra và chuyển hướng trong useEffect
  useEffect(() => {
    if (!maHoaDon) {
      navigate("/");  // Chuyển hướng về trang chủ nếu không có mã hóa đơn
    }
  }, [maHoaDon, navigate]);

  // Nếu không có mã hóa đơn thì không render thêm gì nữa
  if (!maHoaDon) {
    return null; // Tránh render nếu không có mã hóa đơn
  }

  useEffect(() => {
    const IDTaiKhoan = localStorage.getItem("IDTaiKhoan");
    if (IDTaiKhoan) {
      XoaGioHang(IDTaiKhoan);
    }
  }, []);

  const thankYouStyle = {
    textAlign: "center",
    backgroundColor: "#e6ffed",
    border: "1px solid #b2f2bb",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    color: "#2f855a",
  };

  const thankYouTitleStyle = {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  };

  const handleContinueShopping = () => {
    navigate("/");  // Chuyển hướng về trang chủ
  };

  return (
    <div className="ket-qua-thanh-toan">
      <div style={thankYouStyle}>
        <h2 style={thankYouTitleStyle}>Cảm ơn bạn đã mua hàng tại FITNESS SGU!</h2>
        <p>Chúng tôi rất vui khi bạn chọn mua sản phẩm của chúng tôi. Hóa đơn của bạn đã được xử lý thành công.</p>
      </div>
      <HoaDon maHoaDon={maHoaDon} />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleContinueShopping} style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#2f855a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Tiếp tục mua hàng
        </button>
      </div>
    </div>
  );
}
