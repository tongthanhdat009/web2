import { useEffect, useState } from "react";
import { getHoaDon } from "../../../../DAL/apiGioHang.jsx";
import './css/HoaDon.css';

export default function HoaDon({ maHoaDon }) {
  const [hoaDon, setHoaDon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (maHoaDon) {
      setLoading(true);
      getHoaDon(maHoaDon)
        .then(data => {
          setHoaDon(data);
          setLoading(false);
          localStorage.removeItem("maHoaDonThanhToan");
        })
        .catch(error => {
          setLoading(false);
          console.error("Lỗi khi lấy hóa đơn:", error);
        });
    }
  }, [maHoaDon]);

  if (loading) return <div className="loading">Đang tải hóa đơn...</div>;
  if (!hoaDon || hoaDon.length === 0) return <div className="not-found">Không tìm thấy hóa đơn.</div>;

  // Gộp các mặt hàng giống nhau (theo mã hàng, khối lượng, size quần áo, size giày)
  const groupedItems = [];
  hoaDon.forEach(item => {
    const key = `${item.MaHangHoa}-${item.IDKhoiLuongTa}-${item.IDKichThuocQuanAo}-${item.IDKichThuocGiay}`;
    const existing = groupedItems.find(g => g.key === key);

    if (existing) {
      existing.seri.push(item.Seri);
      existing.count += 1;
    } else {
      groupedItems.push({
        key,
        TenHangHoa: item.TenHangHoa,
        GiaBan: parseFloat(item.GiaBan) || 0,
        Anh: item.Anh,
        IDKhoiLuongTa: item.IDKhoiLuongTa,
        KhoiLuong: item.KhoiLuong,
        IDKichThuocQuanAo: item.IDKichThuocQuanAo,
        KichThuocQuanAo: item.KichThuocQuanAo,
        IDKichThuocGiay: item.IDKichThuocGiay,
        KichThuocGiay: item.KichThuocGiay,
        seri: [item.Seri],
        count: 1,
      });
    }
  });

  const hd = hoaDon[0]; // Thông tin chung của hóa đơn

  // Tổng tiền = tổng giá bán * số lượng
  const totalAmount = groupedItems.reduce((acc, item) => acc + item.GiaBan * item.count, 0);

  return (
    <div className="hoa-don-container">
      <div className="hoa-don-header">
        <div className="left">
          <p><strong>Mã hóa đơn:</strong> {hd.MaHoaDon}</p>
          <p><strong>Tên người mua:</strong> {hd.TenNguoiMua}</p>
          <p><strong>Địa chỉ:</strong> {hd.DiaChi ? hd.DiaChi.split('$$').join(', ') : 'N/A'}</p>
          <p><strong>SĐT:</strong> {hd.SoDienThoai}</p>
        </div>
        <div className="right">
          <p><strong>Trạng thái:</strong> {hd.TrangThai}</p>
          <p><strong>Ngày xuất:</strong> {hd.NgayXuatHoaDon ? new Date(hd.NgayXuatHoaDon).toLocaleDateString('vi-VN') : 'N/A'}</p>
          <p><strong>Ngày duyệt:</strong> {hd.NgayDuyet ? new Date(hd.NgayDuyet).toLocaleDateString('vi-VN') : "Chưa duyệt"}</p>
        </div>
      </div>

      <table className="hoa-don-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tên hàng hóa</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
            <th>Sê-ri</th>
          </tr>
        </thead>
        <tbody>
          {groupedItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img src={item.Anh} alt={item.TenHangHoa} className="product-image" />
              </td>
              <td>
                {item.TenHangHoa}
                {item.IDKhoiLuongTa !== 0 && item.KhoiLuong && ` - KL: ${item.KhoiLuong}`}
                {item.IDKichThuocQuanAo !== 0 && item.KichThuocQuanAo && ` - Size: ${item.KichThuocQuanAo}`}
                {item.IDKichThuocGiay !== 0 && item.KichThuocGiay && ` - Size: ${item.KichThuocGiay}`}
              </td>
              <td>{item.count}</td>
              <td>{item.GiaBan.toLocaleString()} VND</td>
              <td>{(item.GiaBan * item.count).toLocaleString()} VND</td>
              <td>
                {item.seri.map((s, i) => <div key={i}>- {s}</div>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hoa-don-footer">
        <strong>Tổng tiền:</strong> <span>{totalAmount.toLocaleString()} VND</span>
      </div>
    </div>
  );
}