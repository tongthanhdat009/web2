import React, { useState, useEffect } from "react";
import "./css/TraCuuSanPham.css";
import { traCuuSanPham } from "../../../DAL/apiTraCuuSanPham.jsx";

const TraCuuSanPham = () => {
  const [seri, setSeri] = useState("");
  const [tenSanPham, setTenSanPham] = useState("");
  const [maPhieuNhap, setMaPhieuNhap] = useState("");
  const [maHangHoa, setMaHangHoa] = useState("");
  const [maTaiKhoan, setMaTaiKhoan] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ChiTietMoKhong, setChiTietMoKhong] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await traCuuSanPham();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Dữ liệu không phải là mảng:", result);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seri && !tenSanPham && !maPhieuNhap && !maHangHoa && !maTaiKhoan) {
      setError("Vui lòng nhập ít nhất một trường để tra cứu.");
      return;
    }
    setError("");
    try {
      const filteredData = data.filter((item) => {
        return (
          (seri ? item.Seri === seri : true) &&
          (tenSanPham ? item.TenHangHoa?.toLowerCase().includes(tenSanPham.toLowerCase()) : true) &&
          (maPhieuNhap ? item.MaPhieuNhap?.includes(maPhieuNhap) : true) &&
          (maHangHoa ? item.MaHangHoa?.includes(maHangHoa) : true) &&
          (maTaiKhoan ? item.IDTaiKhoan?.includes(maTaiKhoan) : true)
        );
      });

      setResults(filteredData);
    } catch (error) {
      console.error("Lỗi khi tra cứu sản phẩm:", error);
      setError("Có lỗi xảy ra trong quá trình tra cứu.");
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setChiTietMoKhong(true);
  };

  const calculateWarrantyEndDate = (startDate, warrantyPeriod) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + parseInt(warrantyPeriod));
    return end;
  };

  // ...existing code...
  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px" }} className="tcsp-page">
      <form onSubmit={handleSubmit}>
        <div className="tcsp-nhom-input">
          <div className="tcsp-o-nhap">
            <label htmlFor="seri">Seri</label>
            <input
              type="text"
              id="seri"
              value={seri}
              onChange={(e) => setSeri(e.target.value)}
              placeholder="Nhập seri"
            />
          </div>
          <div className="tcsp-o-nhap">
            <label htmlFor="tenSanPham">Tên sản phẩm</label>
            <input
              type="text"
              id="tenSanPham"
              value={tenSanPham}
              onChange={(e) => setTenSanPham(e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </div>
        </div>

        <div className="tcsp-nhom-input">
          <div className="tcsp-o-nhap">
            <label htmlFor="maPhieuNhap">Mã phiếu nhập</label>
            <input
              type="text"
              id="maPhieuNhap"
              value={maPhieuNhap}
              onChange={(e) => setMaPhieuNhap(e.target.value)}
              placeholder="Nhập mã phiếu nhập"
            />
          </div>
          <div className="tcsp-o-nhap">
            <label htmlFor="maHangHoa">Mã hàng hóa</label>
            <input
              type="text"
              id="maHangHoa"
              value={maHangHoa}
              onChange={(e) => setMaHangHoa(e.target.value)}
              placeholder="Nhập mã hàng hóa"
            />
          </div>
        </div>

        <div className="tcsp-nhom-input">
          <div className="tcsp-o-nhap">
            <label htmlFor="maTaiKhoan">Mã tài khoản</label>
            <input
              type="text"
              id="maTaiKhoan"
              value={maTaiKhoan}
              onChange={(e) => setMaTaiKhoan(e.target.value)}
              placeholder="Nhập mã tài khoản"
            />
          </div>
        </div>

        {error && <div className="tcsp-error-message">{error}</div>}
        <button type="submit" className="tcsp-nut-tra-cuu">
          Tra cứu
        </button>
      </form>

      {results.length > 0 && (
        <table className="tcsp-bang-ket-qua">
          <thead>
            <tr>
              <th>Seri</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Thời gian bảo hành</th>
              <th>Tình trạng bảo hành</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => {
              const ngayDuyet = new Date(item.NgayDuyet);
              const ngayHetHan = calculateWarrantyEndDate(ngayDuyet, item.ThoiGianBaoHanh);

              const conBaoHanh = item.TinhTrang === "0" || ngayHetHan > new Date();
              return (
                <tr key={index}>
                  <td>{item.Seri}</td>
                  <td>
                    <img src={item.Anh} alt={item.TenHangHoa} width="50" />
                  </td>
                  <td>{item.TenHangHoa}</td>
                  <td>{item.ThoiGianBaoHanh} tháng</td>
                  <td>
                    <div
                      className={
                        item.ThoiGianBaoHanh === "0"
                          ? "tcsp-khong-bao-hanh"
                          : conBaoHanh
                          ? "tcsp-con-bao-hanh"
                          : "tcsp-het-bao-hanh"
                      }
                    >
                      {item.ThoiGianBaoHanh === "0"
                        ? "Không bảo hành"
                        : conBaoHanh
                        ? "Còn bảo hành"
                        : "Hết bảo hành"}
                    </div>
                  </td>
                  <td>
                    {item.TinhTrang !== "Đã bán" ? (
                      <button disabled style={{ cursor: "not-allowed" }}>
                        Xem đơn hàng
                      </button>
                    ) : (
                      <button onClick={() => handleProductClick(item)}>
                        Xem đơn hàng
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Hiển thị chi tiết sản phẩm nếu ChiTietMoKhong là true */}
      {ChiTietMoKhong && selectedProduct && (
        <div className="tcsp-product-details">
          <button className="tcsp-close-button" onClick={() => setChiTietMoKhong(false)}>x</button>
          <div className="tcsp-product-details-header">
            <div className="tcsp-product-image-wrapper">
              <img
                src={selectedProduct.Anh}
                alt={selectedProduct.TenHangHoa}
                className="tcsp-product-image"
              />
            </div>
            <table className="tcsp-product-detail-table">
              <tbody>
                <tr>
                  <td><strong>Tên sản phẩm:</strong></td>
                  <td>{selectedProduct.TenHangHoa}</td>
                </tr>
                <tr>
                  <td><strong>Tên khách hàng:</strong></td>
                  <td>{selectedProduct.TenNguoiMua}</td>
                </tr>
                <tr>
                  <td><strong>SĐT:</strong></td>
                  <td>{selectedProduct.SoDienThoai}</td>
                </tr>
                <tr>
                  <td><strong>Địa chỉ</strong></td>
                  <td>{selectedProduct.DiaChi}</td>
                </tr>
                <tr>
                  <td><strong>Ngày duyệt đơn:</strong></td>
                  <td>{selectedProduct.NgayDuyet ? new Date(selectedProduct.NgayDuyet).toLocaleDateString() : ""}</td>
                </tr>
                <tr>
                  <td><strong>Hạn bảo hành:</strong></td>
                  <td>{selectedProduct.NgayDuyet ? calculateWarrantyEndDate(selectedProduct.NgayDuyet, selectedProduct.ThoiGianBaoHanh).toLocaleDateString() : ""}</td>
                </tr>
                {selectedProduct.IDKhoiLuongTa && selectedProduct.IDKhoiLuongTa !== "0" && (
                  <tr>
                    <td><strong>Khối lượng:</strong></td>
                    <td>{selectedProduct.KhoiLuong}</td>
                  </tr>
                )}
                {selectedProduct.IDKichThuocQuanAo && selectedProduct.IDKichThuocQuanAo !== "0" && (
                  <tr>
                    <td><strong>Kích thước quần áo:</strong></td>
                    <td>{selectedProduct.KichThuocQuanAo}</td>
                  </tr>
                )}
                {selectedProduct.IDKichThuocGiay && selectedProduct.IDKichThuocGiay !== "0" && (
                  <tr>
                    <td><strong>Kích thước giày:</strong></td>
                    <td>{selectedProduct.KichThuocGiay}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  // ...existing code...
};

export default TraCuuSanPham;
