import React, { useState, useEffect } from "react";
import { fetchPhieuNhap, fetchNCC, fetchChiTietPhieuNhap, fetchHangHoa, addPhieuNhap, addKhoHang, addChiTietPhieuNhap, 
  fetchKhoiLuongTa, fetchKichThuocQuanAo, fetchKichThuocGiay, fetchChungLoai, fetchTheLoai, updatePhieuNhap } from "../../../DAL/api";
import "../../../GUI/Components/css/QuanLyPhieuNhap.css";

const ITEMS_PER_PAGE = 10;

const QuanLyPhieuNhap = ({Them, Sua}) => {
  console.log({Them, Sua});
  const [phieuNhaps, setPhieuNhaps] = useState([]);
  const [nhaCungCaps, setNhaCungCaps] = useState([]);
  const [hangHoas, setHangHoas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhieuNhap, setSelectedPhieuNhap] = useState(null);
  const [khoHangItems, setKhoHangItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedNCC, setSelectedNCC] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [chiTietPhieuNhapItems, setChiTietPhieuNhapItems] = useState([]);
  const [khoiLuongTas, setKhoiLuongTas] = useState([]);
  const [kichThuocQuanAos, setKichThuocQuanAos] = useState([]);
  const [kichThuocGiays, setKichThuocGiays] = useState([]);
  const [chungLoais, setChungLoais] = useState([]);
  const [theLoais, setTheLoais] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [phieuNhapData, nccData, hangHoaData, khoiLuongTaData, kichThuocQuanAoData, kichThuocGiayData, chungLoaiData, theLoaiData] = await Promise.all([
        fetchPhieuNhap(),
        fetchNCC(),
        fetchHangHoa(),
        fetchKhoiLuongTa(),
        fetchKichThuocQuanAo(),
        fetchKichThuocGiay(),
        fetchChungLoai(),
        fetchTheLoai()
      ]);
      
      setPhieuNhaps(phieuNhapData);
      setNhaCungCaps(nccData);
      setHangHoas(hangHoaData);
      setKhoiLuongTas(khoiLuongTaData);
      setKichThuocQuanAos(kichThuocQuanAoData);
      setKichThuocGiays(kichThuocGiayData);
      setChungLoais(chungLoaiData);
      setTheLoais(theLoaiData);
    } catch (error) {
      setNotification({
        message: "Lỗi khi tải dữ liệu: " + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filterPhieuNhaps = () => {
    if (!searchTerm.trim()) return phieuNhaps;

    return phieuNhaps.filter(phieuNhap => {
      const searchLower = searchTerm.toLowerCase();
      const nhaCungCap = nhaCungCaps.find(ncc => ncc.MaNhaCungCap === phieuNhap.MaNhaCungCap);
      
      switch (searchCriteria) {
        case "maPhieuNhap":
          return phieuNhap.MaPhieuNhap.toLowerCase().includes(searchLower);
        case "ngayNhap":
          return formatDate(phieuNhap.NgayNhap).toLowerCase().includes(searchLower);
        case "nhaCungCap":
          return nhaCungCap?.TenNhaCungCap.toLowerCase().includes(searchLower);
        case "trangThai":
          return phieuNhap.TrangThai.toLowerCase().includes(searchLower);
        case "all":
          return (
            phieuNhap.MaPhieuNhap.toLowerCase().includes(searchLower) ||
            formatDate(phieuNhap.NgayNhap).toLowerCase().includes(searchLower) ||
            (nhaCungCap?.TenNhaCungCap.toLowerCase().includes(searchLower)) ||
            phieuNhap.TrangThai.toLowerCase().includes(searchLower)
          );
        default:
          return true;
      }
    });
  };

  const filteredPhieuNhaps = filterPhieuNhaps();
  const totalPages = Math.ceil(filteredPhieuNhaps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPhieuNhaps = filteredPhieuNhaps.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = async (phieuNhap) => {
    setSelectedPhieuNhap(phieuNhap);
    setLoadingDetails(true);
    setShowModal(true);
    
    try {
      const items = await fetchChiTietPhieuNhap(phieuNhap.MaPhieuNhap);
      setChiTietPhieuNhapItems(items);
    } catch (error) {
      setNotification({
        message: "Lỗi khi tải chi tiết phiếu nhập: " + error.message,
        type: 'error'
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lsaquo;
        </button>
        {pages}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &rsaquo;
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
        <span className="pagination-info">
          Trang {currentPage} / {totalPages}
        </span>
      </div>
    );
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, {
      MaHangHoa: "",
      GiaNhap: "",
      GiaBan: "",
      SoLuong: 1
    }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setSelectedItems(newItems);
  };

  const handleSubmitAddForm = async (e) => {
    e.preventDefault();
    if (!selectedNCC || selectedItems.length === 0) {
      setNotification({
        message: "Vui lòng chọn nhà cung cấp và ít nhất một mặt hàng",
        type: 'error'
      });
      return;
    }

    // Check for duplicate items
    const hasDuplicates = selectedItems.some((item, index) => {
      return selectedItems.slice(index + 1).some(otherItem => {
        return (
          item.MaHangHoa === otherItem.MaHangHoa &&
          item.IDKhoiLuongTa === otherItem.IDKhoiLuongTa &&
          item.IDKichThuocGiay === otherItem.IDKichThuocGiay &&
          item.IDKichThuocQuanAo === otherItem.IDKichThuocQuanAo
        );
      });
    });

    if (hasDuplicates) {
      setNotification({
        message: "Không được thêm các mặt hàng trùng lặp (cùng mã hàng hóa, khối lượng, kích thước quần áo và kích thước giày)",
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      let IDTKAdmin = localStorage.getItem("IDTaiKhoanAdmin");
      console.log("IDTKAdmin:", IDTKAdmin);
      
      // Tạo phiếu nhập với trạng thái "Chưa duyệt"
      const phieuNhapResult = await addPhieuNhap({
        TrangThai: "Chưa duyệt",
        IDTaiKhoan: String(IDTKAdmin || ""),
        MaNhaCungCap: selectedNCC,
        NgayNhap: new Date().toISOString().split('T')[0]
      });

      if (!phieuNhapResult.success) {
        throw new Error(phieuNhapResult.message);
      }

      // Lấy mã phiếu nhập vừa tạo
      const phieunhap = await fetchPhieuNhap();
      const MaPhieuNhap1 = phieunhap[phieunhap.length - 1].MaPhieuNhap;
      console.log("Mã phiếu nhập mới:", MaPhieuNhap1);

      // Thêm từng mặt hàng vào chi tiết phiếu nhập
      for (const item of selectedItems) {
        const chiTietPhieuNhapResult = await addChiTietPhieuNhap({
          MaPhieuNhap: Number(MaPhieuNhap1),
          MaHangHoa: Number(item.MaHangHoa),
          IDKhoiLuongTa: Number(item.IDKhoiLuongTa) || 0,
          IDKichThuocQuanAo: Number(item.IDKichThuocQuanAo) || 0,
          IDKichThuocGiay: Number(item.IDKichThuocGiay) || 0,
          GiaNhap: Number(item.GiaNhap),
          GiaBan: Number(item.GiaBan),
          SoLuongNhap: Number(item.SoLuong),
          SoLuongTon: Number(item.SoLuong)
        });

        if (!chiTietPhieuNhapResult.success) {
          throw new Error(chiTietPhieuNhapResult.message);
        }
      }

      setNotification({
        message: "Thêm phiếu nhập thành công!",
        type: 'success'
      });

      // Reset form và load lại dữ liệu
      setShowAddForm(false);
      setSelectedNCC("");
      setSelectedItems([]);
      loadData();
    } catch (error) {
      setNotification({
        message: "Lỗi khi thêm phiếu nhập: " + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDuyetPhieuNhap = async (phieuNhap) => {
    setLoading(true);
    try {
      // Cập nhật trạng thái phiếu nhập thành "Đã duyệt"
      const updateResult = await updatePhieuNhap({
        MaPhieuNhap: phieuNhap.MaPhieuNhap,
        TrangThai: "Đã duyệt"
      });

      if (!updateResult.success) {
        throw new Error(updateResult.message);
      }

      // Lấy chi tiết phiếu nhập
      const chiTietPhieuNhapItems = await fetchChiTietPhieuNhap(phieuNhap.MaPhieuNhap);
      
      // Duyệt qua từng chi tiết phiếu nhập và tạo kho hàng
      for (const item of chiTietPhieuNhapItems) {
        // Tạo số lượng kho hàng tương ứng với số lượng nhập
        for (let i = 0; i < item.SoLuongNhap; i++) {
          const khoHangResult = await addKhoHang({
            IDChiTietPhieuNhap: item.IDChiTietPhieuNhap,
            TinhTrang: "Chưa bán"
          });

          if (!khoHangResult.success) {
            throw new Error(khoHangResult.message);
          }
        }
      }

      setNotification({
        message: "Duyệt phiếu nhập thành công!",
        type: 'success'
      });

      // Load lại dữ liệu
      loadData();
    } catch (error) {
      setNotification({
        message: "Lỗi khi duyệt phiếu nhập: " + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {notification && (
        <div className={`notification-container notification-${notification.type}`}>
          <span style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : '⚠'}
          </span>
          {notification.message}
        </div>
      )}
      <h2 className="admin-header">Quản lý phiếu nhập</h2>

      <div className="action-buttons">
        {Them === 1 && (
          <button 
            className="button-common button-add"
            onClick={() => setShowAddForm(true)}
        >
          Thêm phiếu nhập
        </button>
        )}
      </div>

      {showAddForm && (
        <div className="modal-container">
          <div className="modal-content" style={{ maxWidth: '1500px' }}>
            <h2 className="modal-title">Thêm phiếu nhập mới</h2>
            
            {notification && (
              <div className="form-notification-overlay">
                <div className={`form-notification notification-${notification.type}`}>
                  <span className="notification-icon" style={{ fontSize: '20px' }}>
                    {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : '⚠'}
                  </span>
                  <p className="notification-message">{notification.message}</p>
                  <button 
                    className="notification-close-button"
                    onClick={() => setNotification(null)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmitAddForm}>
              <div className="form-group">
                <label>Nhà cung cấp:</label>
                <select
                  value={selectedNCC}
                  onChange={(e) => setSelectedNCC(e.target.value)}
                  required
                  className="modal-input"
                >
                  <option value="">Chọn nhà cung cấp</option>
                  {nhaCungCaps.map(ncc => (
                    <option key={ncc.MaNhaCungCap} value={ncc.MaNhaCungCap}>
                      {ncc.TenNhaCungCap}
                    </option>
                  ))}
                </select>
              </div>

              <div className="items-container">
                <h3>Danh sách mặt hàng</h3>
                <button 
                  type="button" 
                  onClick={handleAddItem} 
                  className="button-common button-add"
                >
                  Thêm mặt hàng
                </button>

                {selectedItems.map((item, index) => {
                  // Tìm chủng loại và thể loại của hàng hóa đã chọn
                  const selectedHangHoa = hangHoas.find(hh => hh.MaHangHoa === item.MaHangHoa);
                  const maChungLoai = selectedHangHoa?.MaChungLoai;
                  const selectedChungLoai = chungLoais.find(cl => cl.MaChungLoai === maChungLoai);
                  const maTheLoai = selectedChungLoai?.MaTheLoai;
                  const selectedTheLoai = theLoais.find(tl => tl.MaTheLoai === maTheLoai);
                  const tenTheLoai = selectedTheLoai?.TenTheLoai;

                  return (
                    <div key={index} className="item-row">
                      <div className="form-group">
                        <label>Mặt hàng:</label>
                        <select
                          value={item.MaHangHoa}
                          onChange={(e) => handleItemChange(index, 'MaHangHoa', e.target.value)}
                          required
                          className="modal-input"
                        >
                          <option value="">Chọn mặt hàng</option>
                          {hangHoas.map(hh => (
                            <option key={hh.MaHangHoa} value={hh.MaHangHoa}>
                              {hh.TenHangHoa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {tenTheLoai === "Các thiết bị tạ" && (
                        <div className="form-group">
                          <label>Khối lượng:</label>
                          <select
                            value={item.IDKhoiLuongTa || ""}
                            onChange={(e) => handleItemChange(index, 'IDKhoiLuongTa', e.target.value)}
                            className="modal-input"
                          >
                            <option value="">Chọn khối lượng</option>
                            {khoiLuongTas.filter(klt => klt.IDKhoiLuongTa !== "0").map(klt => (
                              <option key={klt.IDKhoiLuongTa} value={klt.IDKhoiLuongTa}>
                                {klt.KhoiLuong}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {tenTheLoai === "Thời trang thể thao" && (
                        <div className="form-group">
                          <label>Kích thước quần áo:</label>
                          <select
                            value={item.IDKichThuocQuanAo || ""}
                            onChange={(e) => handleItemChange(index, 'IDKichThuocQuanAo', e.target.value)}
                            className="modal-input"
                          >
                            <option value="">Chọn kích thước</option>
                            {kichThuocQuanAos.filter(ktqa => ktqa.IDKichThuocQuanAo !== "0").map(ktqa => (
                              <option key={ktqa.IDKichThuocQuanAo} value={ktqa.IDKichThuocQuanAo}>
                                {ktqa.KichThuocQuanAo}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {tenTheLoai === "Giày thể thao" && (
                        <div className="form-group">
                          <label>Kích thước giày:</label>
                          <select
                            value={item.IDKichThuocGiay || ""}
                            onChange={(e) => handleItemChange(index, 'IDKichThuocGiay', e.target.value)}
                            className="modal-input"
                          >
                            <option value="">Chọn kích thước</option>
                            {kichThuocGiays.filter(ktg => ktg.IDKichThuocGiay !== "0").map(ktg => (
                              <option key={ktg.IDKichThuocGiay} value={ktg.IDKichThuocGiay}>
                                {ktg.KichThuocGiay}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="form-group">
                        <label>Giá nhập:</label>
                        <input
                          type="number"
                          value={item.GiaNhap}
                          onChange={(e) => handleItemChange(index, 'GiaNhap', e.target.value)}
                          required
                          min="0"
                          className="modal-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Giá bán:</label>
                        <input
                          type="number"
                          value={item.GiaBan}
                          onChange={(e) => handleItemChange(index, 'GiaBan', e.target.value)}
                          required
                          min="0"
                          className="modal-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Số lượng:</label>
                        <input
                          type="number"
                          value={item.SoLuong}
                          onChange={(e) => handleItemChange(index, 'SoLuong', e.target.value)}
                          required
                          min="1"
                          className="modal-input"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="button-common button-delete"
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="modal-buttons">
                <button 
                  type="submit" 
                  className="modal-button modal-button-submit"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Thêm phiếu nhập'}
                </button>
                <button 
                  type="button"
                  className="modal-button modal-button-cancel"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedNCC("");
                    setSelectedItems([]);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="search-container" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
          className="modal-input"
          style={{ flex: 1 }}
        />
        <select
          value={searchCriteria}
          onChange={(e) => {
            setSearchCriteria(e.target.value);
            setCurrentPage(1); // Reset to first page when changing criteria
          }}
          className="modal-input"
          style={{ width: 'auto' }}
        >
          <option value="all">Tất cả</option>
          <option value="maPhieuNhap">Mã phiếu nhập</option>
          <option value="ngayNhap">Ngày nhập</option>
          <option value="nhaCungCap">Nhà cung cấp</option>
          {/* <option value="trangThai">Trạng thái</option> */}
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {filteredPhieuNhaps.length === 0 ? (
            <div className="no-results-message">
              Không tìm thấy kết quả phù hợp
            </div>
          ) : (
            <>
              <table className="table-container">
                <thead>
                  <tr>
                    <th className="table-header">Mã phiếu nhập</th>
                    <th className="table-header">Ngày nhập</th>
                    <th className="table-header">Nhà cung cấp</th>
                    <th className="table-header">Trạng thái</th>
                    <th className="table-header">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPhieuNhaps.map((phieuNhap, index) => {
                    const nhaCungCap = nhaCungCaps.find(ncc => ncc.MaNhaCungCap === phieuNhap.MaNhaCungCap);
                    
                    return (
                      <tr key={`phieunhap-${phieuNhap.MaPhieuNhap}`} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                        <td>{phieuNhap.MaPhieuNhap}</td>
                        <td>{formatDate(phieuNhap.NgayNhap)}</td>
                        <td>{nhaCungCap ? nhaCungCap.TenNhaCungCap : phieuNhap.MaNhaCungCap}</td>
                        <td>
                          <span className={`status-badge ${phieuNhap.TrangThai === "Đã duyệt" ? 'status-active' : 'status-inactive'}`}>
                            {phieuNhap.TrangThai}
                          </span>
                        </td>
                        <td>
                          <button
                            className="button-common button-view"
                            onClick={() => handleViewDetails(phieuNhap)}
                          >
                            Xem chi tiết
                          </button>
                          {phieuNhap.TrangThai === "Chưa duyệt" && Sua === 1 && (
                            <button
                              className="button-common button-approve"
                              onClick={() => handleDuyetPhieuNhap(phieuNhap)}
                              disabled={loading}
                            >
                              Duyệt
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {renderPagination()}
            </>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-container">
          <div className="modal-content" style={{ maxWidth: '1500px' }}>
            <h2 className="modal-title">Chi tiết phiếu nhập</h2>
            <div className="modal-header-info">
              <p><strong>Mã phiếu nhập:</strong> {selectedPhieuNhap?.MaPhieuNhap}</p>
              <p><strong>Ngày nhập:</strong> {formatDate(selectedPhieuNhap?.NgayNhap)}</p>
              <p><strong>Nhà cung cấp:</strong> {
                nhaCungCaps.find(ncc => ncc.MaNhaCungCap === selectedPhieuNhap?.MaNhaCungCap)?.TenNhaCungCap
              }</p>
            </div>

            {loadingDetails ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <table className="table-container">
                <thead>
                  <tr>
                    <th className="table-header">Tên hàng hóa</th>
                    <th className="table-header">Hãng</th>
                    <th className="table-header">Khối lượng</th>
                    <th className="table-header">Kích thước quần áo</th>
                    <th className="table-header">Kích thước giày</th>
                    <th className="table-header">Giá nhập</th>
                    <th className="table-header">Giá bán</th>
                    <th className="table-header">Số lượng nhập</th>
                    <th className="table-header">Số lượng tồn</th>
                  </tr>
                </thead>
                <tbody>
                  {chiTietPhieuNhapItems.map((item, index) => (
                    <tr key={`ctpn-${item.IDChiTietPhieuNhap}`} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                      <td>{item.TenHangHoa}</td>
                      <td>{item.TenHang}</td>
                      <td>{item.KhoiLuong + "kg" && item.KhoiLuong !== null && item.KhoiLuong !== 0 && item.KhoiLuong !== "0" ? item.KhoiLuong + "kg" : '-'}</td>
                      <td>{item.KichThuocQuanAo && item.KichThuocQuanAo !== null && item.KichThuocQuanAo !== 0 && item.KichThuocQuanAo !== "0" ? item.KichThuocQuanAo : '-'}</td>
                      <td>{item.KichThuocGiay && item.KichThuocGiay !== null && item.KichThuocGiay !== 0 && item.KichThuocGiay !== "0" ? item.KichThuocGiay : '-'}</td>
                      <td>{formatCurrency(item.GiaNhap)}</td>
                      <td>{formatCurrency(item.GiaBan)}</td>
                      <td>{item.SoLuongNhap}</td>
                      <td>{item.SoLuongTon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-buttons">
              <button 
                className="modal-button modal-button-cancel" 
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyPhieuNhap;
