import React, { useState, useEffect } from 'react';
import { chiTietHangHoa, addToCart } from "../../../DAL/apiChiTietHangHoa.jsx";
import { useParams, useNavigate } from 'react-router-dom';
import { FaTags } from "react-icons/fa";
import SanPhamGoiY from "./Components/SanPhamGoiY.jsx";
import "./css/chiTietHangHoa.css";
import DanhGia from './Components/DanhGia.jsx';

function TrangChiTietHangHoa() {
  const [chiTiet, setChiTiet] = useState([]);
  const [selectedKL, setSelectedKL] = useState(null);
  const [selectedAo, setSelectedAo] = useState(null);
  const [selectedGiay, setSelectedGiay] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const { maHangHoa } = useParams();
  const navigate = useNavigate();
  const idTaiKhoan = localStorage.getItem("IDTaiKhoan");

  useEffect(() => {
    async function fetchData() {
      const data = await chiTietHangHoa(maHangHoa) || [];
      setChiTiet(data);
      if (data.length) {
        const min = data.reduce((a, b) => (a.GiaBan < b.GiaBan ? a : b));
        setSelectedKL(min.IDKhoiLuongTa);
        setSelectedAo(min.IDKichThuocQuanAo);
        setSelectedGiay(min.IDKichThuocGiay);
      }
    }
    fetchData();
  }, [maHangHoa]);

  const current = chiTiet.find(item =>
    item.IDKhoiLuongTa === selectedKL &&
    item.IDKichThuocQuanAo === selectedAo &&
    item.IDKichThuocGiay === selectedGiay
  ) || {};
  console.log("current", current);

  const adjustQty = delta => {
    setQuantity(q => {
      const next = q + delta;
      if (next < 1) return 1;
      if (current.SoLuongTon != null && next > current.SoLuongTon) return current.SoLuongTon;
      return next;
    });
    setMessage(null);
  };

  const handleAddToCart = async () => {
    if (!idTaiKhoan) {
      navigate("/dang-nhap-dang-ky");
      return;
    }

    const res = await addToCart(
      idTaiKhoan,
      maHangHoa,
      quantity,
      selectedKL,
      selectedAo,
      selectedGiay
    );
    setMessage(res.success ? { type: 'success', text: res.message } : { type: 'error', text: res.error });
  };

  const tinhGiaSauKhuyenMai = () => {
    if (!current.PhanTram || isNaN(current.PhanTram)) return current.GiaBan;
    const giam = (current.GiaBan * parseFloat(current.PhanTram)) / 100;
    return current.GiaBan - giam;
  };

  return (
    <div className="cthh-container">
      <div className="cthh-product-image">
        <img src={current.Anh} alt={current.TenHangHoa} />
        {current.PhanTram && parseFloat(current.PhanTram) > 0 && (
          <div className="cthh-sale-badge">
            <FaTags /> SALE {parseFloat(current.PhanTram)}%
          </div>
        )}
      </div>

      <div className="cthh-product-info">
        <h1>{current.TenHangHoa}</h1>
        <p><strong>Mã:</strong> {maHangHoa}</p>

        <div className="cthh-price-section">
          {current.PhanTram && parseFloat(current.PhanTram) > 0 ? (
            <>
              <p className="cthh-old-price">{current.GiaBan?.toLocaleString()} VND</p>
              <p className="cthh-price">
                {tinhGiaSauKhuyenMai()?.toLocaleString()} VND
              </p>
            </>
          ) : (
            <p className="cthh-price">{current.GiaBan?.toLocaleString()} VND</p>
          )}
        </div>

        {/* Khối lượng */}
        {chiTiet.some(i => i.IDKhoiLuongTa > 0) && (
          <div className="cthh-option-group">
            <h3>Chọn khối lượng:</h3>
            <div className="cthh-select-size">
              {[...new Set(chiTiet.map(i => i.IDKhoiLuongTa))].filter(v => v > 0).map(id => (
                <div
                  key={id}
                  className={`cthh-size-option ${selectedKL === id ? 'cthh-selected' : ''}`}
                  onClick={() => { setSelectedKL(id); setQuantity(1); setMessage(null); }}
                >
                  {chiTiet.find(i => i.IDKhoiLuongTa === id).KhoiLuong}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Áo */}
        {chiTiet.some(i => i.IDKichThuocQuanAo > 0) && (
          <div className="cthh-option-group">
            <h3>Chọn kích thước áo:</h3>
            <div className="cthh-select-size">
              {[...new Set(chiTiet.map(i => i.IDKichThuocQuanAo))].filter(v => v > 0).map(id => (
                <div
                  key={id}
                  className={`cthh-size-option ${selectedAo === id ? 'cthh-selected' : ''}`}
                  onClick={() => { setSelectedAo(id); setQuantity(1); setMessage(null); }}
                >
                  {chiTiet.find(i => i.IDKichThuocQuanAo === id).KichThuocQuanAo}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Giày */}
        {chiTiet.some(i => i.IDKichThuocGiay > 0) && (
          <div className="cthh-option-group">
            <h3>Chọn kích thước giày:</h3>
            <div className="cthh-select-size">
              {[...new Set(chiTiet.map(i => i.IDKichThuocGiay))].filter(v => v > 0).map(id => (
                <div
                  key={id}
                  className={`cthh-size-option ${selectedGiay === id ? 'cthh-selected' : ''}`}
                  onClick={() => { setSelectedGiay(id); setQuantity(1); setMessage(null); }}
                >
                  {chiTiet.find(i => i.IDKichThuocGiay === id).KichThuocGiay}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="cthh-quantity-row">
          <label>Số lượng còn: {current.SoLuongTon}</label>
          <div className="cthh-qty-control">
            <button onClick={() => adjustQty(-1)}>-</button>
            <input type="text" readOnly value={quantity} />
            <button onClick={() => adjustQty(1)}>+</button>
          </div>
        </div>

        {/* Add to cart */}
        <div className="cthh-add-cart-row">
          {current.TinhTrang === "Hết hàng" ? (
            <button className="cthh-add-to-cart cthh-disabled" disabled>Sản phẩm đã hết</button>
          ) : (
            <button className="cthh-add-to-cart" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
          )}
        </div>
        {message && <div className={`cthh-message ${message.type}`}>{message.text}</div>}
      </div>

      <div className="cthh-product-description">
        <h3>Mô Tả Sản Phẩm:</h3>
        <p className="cthh-description-content">{current.MoTa}</p>
      </div>

      {/* Sản phẩm gợi ý */}
      <div className="cthh-goiy-section" style={{ background: "#fffff", width: "100%" }}>
        <h3>Sản phẩm gợi ý</h3>
        {current.MaChungLoai && (
          <SanPhamGoiY maChungLoai={current.MaChungLoai} maHangHoaHienTai={maHangHoa} />
        )}
      </div>
      <DanhGia maHangHoa={maHangHoa}></DanhGia>
    </div>
  );
}

export default TrangChiTietHangHoa;