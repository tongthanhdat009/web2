import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { layGioHang, capNhatGioHang, getThongTinNguoiDung, ThanhToan } from "../../../DAL/apiGioHang.jsx";
import "./css/GioHang.css";
import FormXacNhanThanhToan from "./Components/FormXacNhanThanhToan.jsx";

export default function TrangGioHang() {
  const [currentCart, setCurrentCart] = useState([]);
  const [productList, setProductList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const idTaiKhoan = localStorage.getItem("IDTaiKhoan");
    if (!idTaiKhoan) {
      navigate("/dang-nhap-dang-ky");
      return;
    }
    layGioHang(idTaiKhoan)
      .then((data) => {
        if (data.giohang && data.sanpham) {
          setProductList(data.sanpham);
          const merged = data.giohang.map(item => {
            const product = data.sanpham.find(p =>
              Number(p.MaHangHoa) === Number(item.MaHangHoa) &&
              Number(p.IDKhoiLuongTa || 0) === Number(item.IDKhoiLuongTa || 0) &&
              Number(p.IDKichThuocQuanAo || 0) === Number(item.IDKichThuocQuanAo || 0) &&
              Number(p.IDKichThuocGiay || 0) === Number(item.IDKichThuocGiay || 0)
            );
            // Nếu SoLuong > SoLuongTon thì gán SoLuong = SoLuongTon
            let soLuongTon = product ? product.SoLuongTon : 0;
            let soLuong = item.SoLuong;
            return {
              ...item,
              ...(product || {}),
              SoLuongTon: soLuongTon,
              SoLuong: soLuong
            };
          });
          setCurrentCart(merged);
        }
        console.log("Giỏ hàng:", data.sanpham);
      })
      .catch(console.error);
    getThongTinNguoiDung(idTaiKhoan)
      .then((data) => {
        if (data && data.IDTaiKhoan) {
          setUserInfo(data);
        }
      })
      .catch(console.error);
  }, [navigate]);

  const formatPrice = (price) => price.toLocaleString("vi-VN") + " VND";

  const calculateTotal = () => {
    return currentCart.reduce((sum, item) => {
      const basePrice = item.GiaBan || 0;
      const discount = item.PhanTram ? Number(item.PhanTram) : 0;
      const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      return sum + finalPrice * item.SoLuong;
    }, 0);
  };

  const handleQuantityChange = (id, delta) => {
    const updatedCart = currentCart.map(item =>
      item.IDChiTietPhieuNhap === id
        ? {
            ...item,
            SoLuong: item.SoLuongTon === 0
              ? 0
              : Math.min(Math.max(item.SoLuong + delta, 1), item.SoLuongTon)
          }
        : item
    );

    setCurrentCart(updatedCart);

    const idTaiKhoan = localStorage.getItem("IDTaiKhoan");
    capNhatGioHang(idTaiKhoan, updatedCart)
      .then(result => {
        if (result.success) {
          console.log("Giỏ hàng đã được cập nhật");
        } else {
          console.error(result.message);
        }
      })
      .catch(error => {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
      });
  };

  const handleRemoveItem = (id) => {
    setCurrentCart(prevCart => prevCart.filter(item => item.IDChiTietPhieuNhap !== id));
  };

  const getOptionsByAttribute = (maHangHoa, attr) => {
    const filtered = productList.filter(p => p.MaHangHoa === maHangHoa);
    const unique = [...new Set(filtered.map(p => p[attr]))];
    console.log(unique.filter(v => v !== 0));
    return unique.filter(v => v !== 0);
  };

  const handleSaveEdit = async () => {
    const variant = productList.find(p =>
      p.MaHangHoa === editingItem.MaHangHoa &&
      (editingItem.KhoiLuong === undefined || p.KhoiLuong === editingItem.KhoiLuong) &&
      (editingItem.KichThuocQuanAo === undefined || p.KichThuocQuanAo === editingItem.KichThuocQuanAo) &&
      (editingItem.KichThuocGiay === undefined || p.KichThuocGiay === editingItem.KichThuocGiay)
    );

    if (!variant) {
      alert("Không tìm thấy biến thể sản phẩm phù hợp.");
      return;
    }

    const isDuplicate = currentCart.some(item =>
      item.IDChiTietPhieuNhap !== editingItem.IDChiTietPhieuNhap &&
      item.MaHangHoa === variant.MaHangHoa &&
      item.IDKhoiLuongTa === variant.IDKhoiLuongTa &&
      item.IDKichThuocQuanAo === variant.IDKichThuocQuanAo &&
      item.IDKichThuocGiay === variant.IDKichThuocGiay
    );

    if (isDuplicate) {
      alert("Sản phẩm với thuộc tính này đã có trong giỏ hàng.");
      return;
    }

    const newCart = currentCart.map(item =>
      item.IDChiTietPhieuNhap === editingItem.IDChiTietPhieuNhap
        ? {
            ...item,
            ...variant,
            SoLuong: 1,
            SoLuongTon: variant.SoLuongTon
          }
        : item
    );

    const idTaiKhoan = localStorage.getItem("IDTaiKhoan");

    try {
      const result = await capNhatGioHang(idTaiKhoan, newCart);
      if (!result.success) {
        alert("Lỗi khi cập nhật giỏ hàng: " + result.message);
        return;
      }
    } catch (error) {
      alert("Lỗi khi cập nhật giỏ hàng trên server.");
      return;
    }

    setCurrentCart(newCart);
    setEditingItem(null);
  };

  // Hiện form xác nhận thanh toán
  const handleShowForm = () => setShowForm(true);

  // Đóng form xác nhận thanh toán
  const handleCancel = () => setShowForm(false);

  // Xử lý submit form xác nhận thanh toán (nếu cần)
  const handleFormSubmit = async (info) => {
    const IDTaiKhoan = localStorage.getItem("IDTaiKhoan");
    setShowForm(false);
    const result = await ThanhToan(
      IDTaiKhoan,
      info.TenNguoiMua,
      info.SoDienThoai,
      info.DiaChi,
      info.HinhThucThanhToan,
      currentCart
    );
    if (result.success) {
      alert("Thanh toán thành công!");
      setCurrentCart([]);
    } else {
      alert("Thanh toán thất bại: " + result.message);
    }
  };

  return (
    <div className="giohang-container">
      <div className="giohang-main">
        <div className="giohang-wrapper">
          {/* Danh sách */}
          <div className="giohang-list">
            {currentCart.length === 0 ? (
              <p>Giỏ hàng trống.</p>
            ) : (
              currentCart.map(item => {
                const basePrice = item.GiaBan || 0;
                const discount = item.PhanTram ? Number(item.PhanTram) : 0;
                const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
                return (
                  <div key={item.IDChiTietPhieuNhap} className="giohang-item">
                    <div className="giohang-item-image">
                      <img src={item.Anh} alt={item.TenHangHoa} />
                    </div>
                    <div className="giohang-item-details">
                      <div className="giohang-item-info-and-quantity">
                        <div className="giohang-item-info">
                          <h3>{item.TenHangHoa}</h3>
                          <div className="giohang-item-price">
                            {item.SoLuongTon === 0 ? (
                              <span className="out-of-stock">Hết hàng</span>
                            ) : discount > 0 ? (
                              <>
                                <span className="old-price">{formatPrice(basePrice)}</span>
                                <span className="new-price">{formatPrice(finalPrice)}</span>
                                <span className="discount-percent">-{discount}%</span>
                              </>
                            ) : (
                              <span className="price">{formatPrice(basePrice)}</span>
                            )}
                          </div>
                          {item.IDKichThuocQuanAo > 0 && <p>Kích thước: {item.KichThuocQuanAo}</p>}
                          {item.IDKichThuocGiay > 0 && <p>Kích thước giày: {item.KichThuocGiay}</p>}
                          {item.IDKhoiLuongTa > 0 && <p>Khối lượng: {item.KhoiLuong}</p>}
                          <p>Hãng: {item.TenHang}</p>
                        </div>
                        <div className="quantity-controls">
                          {item.SoLuongTon === 0 ? null : (
                            <>
                              <button onClick={() => handleQuantityChange(item.IDChiTietPhieuNhap, -1)}>-</button>
                              <span>{item.SoLuong}</span>
                              <button onClick={() => handleQuantityChange(item.IDChiTietPhieuNhap, 1)}>+</button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="giohang-item-actions">
                        <button onClick={() => handleRemoveItem(item.IDChiTietPhieuNhap)}>Xóa</button>
                        <button onClick={() => setEditingItem(item)}>Sửa</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Tổng tiền */}
          <div className="tinh-tien">
            <h3>Chi tiết đơn hàng:</h3>
            <ul className="tinh-tien-chi-tiet">
              {currentCart.map((item) => {
                const basePrice = item.GiaBan || 0;
                const discount = item.PhanTram ? Number(item.PhanTram) : 0;
                const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

                const chiTiet = [];
                if (item.KichThuocGiay) chiTiet.push(`${item.KichThuocGiay}`);
                if (item.KhoiLuong) chiTiet.push(`${item.KhoiLuong}`);
                if (item.KichThuocQuanAo) chiTiet.push(`${item.KichThuocQuanAo}`);

                return (
                  <li key={item.IDChiTietPhieuNhap}>
                    {item.TenHangHoa} ({chiTiet.join(" - ")}) × {item.SoLuong}: <strong>{formatPrice(finalPrice * item.SoLuong)}</strong>
                  </li>
                );
              })}
            </ul>
            <h3 style={{ marginTop: "1rem" }}>Tổng tiền: {formatPrice(calculateTotal())}</h3>
            <button className="btn-checkout" onClick={handleShowForm}>Thanh toán</button>
          </div>
          {showForm && (
            <FormXacNhanThanhToan
              currentCart={currentCart}
              userInfo={userInfo}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}
          {/* Form sửa */}
          {editingItem && (
            <div className="edit-overlay">
              <div className="edit-form">
                <h3>Chỉnh sửa sản phẩm</h3>
                {getOptionsByAttribute(editingItem.MaHangHoa, "IDKhoiLuongTa")
                  .filter(val => val !== 0).length > 0 && (
                  <div className="form-group">
                    <p>Khối lượng:</p>
                    <div className="options-grid">
                      {getOptionsByAttribute(editingItem.MaHangHoa, "KhoiLuong")
                        .filter(val => val !== 0)
                        .map(val => (
                          <button
                            key={val}
                            type="button"
                            className={editingItem.KhoiLuong === val ? "option-box selected" : "option-box"}
                            onClick={() => setEditingItem({ ...editingItem, KhoiLuong: val })}
                          >{val}</button>
                        ))}
                    </div>
                  </div>
                )}

                {getOptionsByAttribute(editingItem.MaHangHoa, "IDKichThuocQuanAo")
                  .filter(val => val !== 0).length > 0 && (
                  <div className="form-group">
                    <p>Kích thước quần áo:</p>
                    <div className="options-grid">
                      {getOptionsByAttribute(editingItem.MaHangHoa, "KichThuocQuanAo")
                        .filter(val => val !== 0)
                        .map(val => (
                          <button
                            key={val}
                            type="button"
                            className={editingItem.KichThuocQuanAo === val ? "option-box selected" : "option-box"}
                            onClick={() => setEditingItem({ ...editingItem, KichThuocQuanAo: val })}
                          >{val}</button>
                        ))}
                    </div>
                  </div>
                )}

                {getOptionsByAttribute(editingItem.MaHangHoa, "IDKichThuocGiay")
                  .filter(val => val !== 0).length > 0 && (
                  <div className="form-group">
                    <p>Kích thước giày:</p>
                    <div className="options-grid">
                      {getOptionsByAttribute(editingItem.MaHangHoa, "KichThuocGiay")
                        .filter(val => val !== 0)
                        .map(val => (
                          <button
                            key={val}
                            type="button"
                            className={editingItem.KichThuocGiay === val ? "option-box selected" : "option-box"}
                            onClick={() => setEditingItem({ ...editingItem, KichThuocGiay: val })}
                          >{val}</button>
                        ))}
                    </div>
                  </div>
                )}
                <div className="edit-actions">
                  <button onClick={handleSaveEdit}>Lưu</button>
                  <button onClick={() => setEditingItem(null)}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}