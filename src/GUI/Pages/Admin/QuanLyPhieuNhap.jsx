import React, { useState, useEffect } from "react";
import { fetchPhieuNhap, fetchNCC, fetchKhoHang, fetchHangHoa, addPhieuNhap, addKhoHang } from "../../../DAL/api";
import "../../../GUI/Components/css/QuanLyPhieuNhap.css";

const ITEMS_PER_PAGE = 10;

const QuanLyPhieuNhap = () => {
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
      const [phieuNhapData, nccData, hangHoaData] = await Promise.all([
        fetchPhieuNhap(),
        fetchNCC(),
        fetchHangHoa()
      ]);
      
      setPhieuNhaps(phieuNhapData);
      setNhaCungCaps(nccData);
      setHangHoas(hangHoaData);
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
      const items = await fetchKhoHang(phieuNhap.MaPhieuNhap);
      setKhoHangItems(items);
    } catch (error) {
      setNotification({
        message: "Lỗi khi tải chi tiết kho hàng: " + error.message,
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

    setLoading(true);
    try {
      let IDTKAdmin = localStorage.getItem("IDTKAdmin");
      console.log("IDTKAdmin:", IDTKAdmin);
      // Tạo phiếu nhập
      const phieuNhapResult = await addPhieuNhap({
        TrangThai: "Đã nhập",
        IDTaiKhoan: IDTKAdmin.toString(),
        MaNhaCungCap: selectedNCC,
        NgayNhap: new Date().toISOString().split('T')[0]
      });
      console.log(phieuNhapResult);
      loadData();
      const phieunhap = await fetchPhieuNhap();
     
      let MaPhieuNhap1 = phieunhap[phieunhap.length - 1].MaPhieuNhap;
      console.log(MaPhieuNhap1);

      // Thêm từng mặt hàng vào kho
      for (const item of selectedItems) {
        for (let i = 0; i < item.SoLuong; i++) {
          const khoHangResult = await addKhoHang({
            MaPhieuNhap: parseFloat(MaPhieuNhap1),
            MaHangHoa: item.MaHangHoa,
            GiaNhap: item.GiaNhap,
            GiaBan: item.GiaBan,
            TinhTrang: "0"
          });

          if (!khoHangResult.success) {
            throw new Error(khoHangResult.message);
          }
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
        <button 
          className="button-common button-add"
          onClick={() => setShowAddForm(true)}
        >
          Thêm phiếu nhập
        </button>
      </div>

      {showAddForm && (
        <div className="modal-container">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <h2 className="modal-title">Thêm phiếu nhập mới</h2>
            
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

                {selectedItems.map((item, index) => (
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
                ))}
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
                          <span className={`status-badge status-active` }>
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
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <h2 className="modal-title">Chi tiết kho hàng</h2>
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
                    <th className="table-header">Seri</th>
                    <th className="table-header">Tên hàng hóa</th>
                    <th className="table-header">Hãng</th>
                    <th className="table-header">Giá nhập</th>
                    <th className="table-header">Giá bán</th>
                    <th className="table-header">Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {khoHangItems.map((item, index) => (
                    <tr key={`kho-${item.Seri}`} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                      <td>{item.Seri}</td>
                      <td>{item.TenHangHoa}</td>
                      <td>{item.TenHang}</td>
                      <td>{formatCurrency(item.GiaNhap)}</td>
                      <td>{formatCurrency(item.GiaBan)}</td>
                      <td>
                        <span className={`status-badge ${item.TinhTrang === 1 ? 'status-active' : 'status-inactive'}`}>
                          {item.TinhTrang === 1 ? 'Bán rồi' : 'Chưa bán'}
                        </span>
                      </td>
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
