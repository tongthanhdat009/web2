import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/LichSuMuaHang.css';
import HoaDon from './Components/HoaDon.jsx'; // import component HoaDon

const LichSuMuaHang = () => {
  const [donHangList, setDonHangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHoaDon, setSelectedHoaDon] = useState(null); // State để lưu mã hóa đơn đã chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // State để điều khiển modal
  const IDTaiKhoan = localStorage.getItem('IDTaiKhoan');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost/web2/server/api/getHoaDonNguoiDung.php`, {
          params: { IDTaiKhoan: IDTaiKhoan }
        });
        if (res.data.success) {
          setDonHangList(res.data.data);
        } else {
          console.error('Không lấy được dữ liệu hóa đơn');
        }
      } catch (err) {
        console.error('Lỗi khi tải lịch sử mua hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    if (IDTaiKhoan) {
      fetchData();
    }
  }, [IDTaiKhoan]);

  const handleXemChiTiet = (maHoaDon) => {
    setSelectedHoaDon(maHoaDon); // Lưu mã hóa đơn đã chọn vào state
    setIsModalOpen(true); // Mở modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  const handleOverlayClick = (e) => {
    // Nếu người dùng click vào overlay (bên ngoài modal), thì đóng modal
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  if (!IDTaiKhoan) return <p>Vui lòng đăng nhập để xem lịch sử mua hàng.</p>;
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="lsmh-container">
      <h2>Lịch Sử Mua Hàng</h2>
      {donHangList.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <table className="lsmh-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Ngày Mua</th>
              <th>Trạng Thái</th>
              <th>Hình Thức Thanh Toán</th>
              <th>Tổng Tiền</th>
              <th></th> {/* Cột nút Xem chi tiết */}
            </tr>
          </thead>
          <tbody>
            {donHangList.map((item) => (
              <tr key={item.MaHoaDon}>
                <td>{item.MaHoaDon}</td>
                <td>{item.NgayXuatHoaDon}</td>
                <td>{item.TrangThai}</td>
                <td>{item.HinhThucThanhToan}</td>
                <td>{Number(item.TongTien).toLocaleString()} đ</td>
                <td>
                  <button
                    className="lsmh-xem-chi-tiet-btn"
                    onClick={() => handleXemChiTiet(item.MaHoaDon)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="lsmh-modal-overlay" onClick={handleOverlayClick}>
          <div className="lsmh-modal-content">
            <button className="lsmh-close-btn" onClick={handleCloseModal}>X</button>
            <HoaDon maHoaDon={selectedHoaDon} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LichSuMuaHang;
