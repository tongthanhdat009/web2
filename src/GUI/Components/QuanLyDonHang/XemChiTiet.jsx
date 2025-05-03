import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Spinner } from "react-bootstrap";

const XemChiTiet = ({ show, onHide, maHoaDon }) => {
  const [chiTietHoaDon, setChiTietHoaDon] = useState([]);
  const [thongTinHoaDon, setThongTinHoaDon] = useState(null);
  const [tongtien, setTongTien] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chỉ tải dữ liệu khi modal hiển thị và có mã hóa đơn
    if (show && maHoaDon) {
      fetchChiTietHoaDon();
    }
  }, [show, maHoaDon]);

  const fetchChiTietHoaDon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy chi tiết hóa đơn
      const response = await axios.get(`http://localhost/Web2/server/api/getChiTietHoaDon.php?maHoaDon=${maHoaDon}`);
      
      if (response.data.success) {
        setChiTietHoaDon(response.data.chiTiet || []);
        setThongTinHoaDon(response.data.hoaDon || null);
        setTongTien(response.data.tongTien || 0);
      } else {
        setError(response.data.message || "Không thể tải dữ liệu chi tiết hóa đơn");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Lỗi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return parseInt(amount).toLocaleString('vi-VN') + ' đ';
  };

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };


  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: "#d2a679"}}>
        <Modal.Title>Chi tiết đơn hàng #{maHoaDon}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            {thongTinHoaDon && (
              <div className="mb-4">
                <h5 className="border-bottom pb-2 mb-3">Thông tin đơn hàng</h5>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Khách hàng:</strong> {thongTinHoaDon.IDTaiKhoan}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> {thongTinHoaDon.DiaChi}</p>
                    <p><strong>Số điện thoại:</strong> {thongTinHoaDon.SoDienThoai}</p>
                    <p><strong>Tên người mua:</strong> {thongTinHoaDon.TenNguoiMua}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Mã đơn hàng:</strong> {thongTinHoaDon.MaHoaDon}</p>
                    <p><strong>Trạng thái:</strong> {thongTinHoaDon.TrangThai}</p>
                    <p><strong>Ngày đặt:</strong> {formatDate(thongTinHoaDon.NgayXuatHoaDon)}</p>
                    <p><strong>Ngày duyệt:</strong> {formatDate(thongTinHoaDon.NgayDuyet) || "Chưa duyệt"}</p>
                    <p><strong>Tổng tiền:</strong> {formatCurrency(tongtien)}</p>
                  </div>
                </div>
              </div>
            )}

            <h5 className="border-bottom pb-2 mb-3">Chi tiết sản phẩm</h5>
            
            {chiTietHoaDon.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th style={{backgroundColor:"#d2a679"}}>STT</th>
                    <th style={{backgroundColor:"#d2a679"}}>Tên sản phẩm</th>
                    <th style={{backgroundColor:"#d2a679"}}>Số seri</th>
                    <th style={{backgroundColor:"#d2a679"}}>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {chiTietHoaDon.map((item, index) => (
                    <tr key={item.Seri}>
                      <td>{index + 1}</td>
                      <td>{item.TenHangHoa}</td>
                      <td>{item.Seri}</td>
                      <td className="text-end">{formatCurrency(item.GiaBan)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                    <td className="text-end fw-bold">{tongtien ? formatCurrency(tongtien) : "0"}</td>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <div className="alert alert-info">Không có sản phẩm nào trong đơn hàng này</div>
            )}
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button variant="success" onClick={() => window.print()}>
          In hóa đơn
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default XemChiTiet;