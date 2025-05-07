import React, { useState, useEffect } from "react";
import { fetchHangHoa, addHangHoa, updateHangHoa, fetchChungLoai, fetchHang, fetchKhuyenMai } from "../../../DAL/api";
import "../../../GUI/Components/css/QuanLyHangHoa.css";

const ITEMS_PER_PAGE = 10;

const QuanLyHangHoa = () => {
  const [hangHoas, setHangHoas] = useState([]);
  const [chungLoais, setChungLoais] = useState([]);
  const [hangs, setHangs] = useState([]);
  const [khuyenMais, setKhuyenMais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("all");
  const [editingHangHoa, setEditingHangHoa] = useState({ 
    MaHangHoa: "", 
    MaChungLoai: "", 
    TenHangHoa: "", 
    MaHang: "", 
    MaKhuyenMai: "", 
    MoTa: "", 
    ThoiGianBaoHanh: "", 
    Anh: "",
    TrangThai: "1"
  }); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      const [hangHoaData, chungLoaiData, hangData, khuyenMaiData] = await Promise.all([
        fetchHangHoa(),
        fetchChungLoai(),
        fetchHang(),
        fetchKhuyenMai()
      ]);
      
      setHangHoas(hangHoaData);
      setChungLoais(chungLoaiData);
      setHangs(hangData);
      setKhuyenMais(khuyenMaiData);

      // Tự động tạo Mã hàng hóa mới khi thêm
      const maxMaHangHoa = Math.max(...hangHoaData.map(hh => parseInt(hh.MaHangHoa, 10)), 0);
      setEditingHangHoa(prevState => ({
        ...prevState,
        MaHangHoa: (maxMaHangHoa + 1).toString()
      }));
    } catch (error) {
      setNotification({
        message: "Lỗi khi tải dữ liệu: " + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTrangThai = async (hangHoa) => {
    try {
      const updatedTrangThai = hangHoa.TrangThai === "1" ? "0" : "1";
      const updatedHangHoa = {
        ...hangHoa,
        TrangThai: updatedTrangThai
      };
  
      const response = await updateHangHoa(updatedHangHoa);
  
      if (response.success) {
        setNotification({
          message: "Cập nhật trạng thái thành công",
          type: "success"
        });
        loadData();
      } else {
        setNotification({
          message: response.message || "Cập nhật trạng thái thất bại",
          type: "error"
        });
      }
    } catch (error) {
      setNotification({
        message: "Lỗi khi cập nhật trạng thái: " + error.message,
        type: "error"
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setEditingHangHoa(prev => ({ ...prev, Anh: URL.createObjectURL(file) }));
    }
  };

  const handleAdd = () => {
    setModalType("add");
    setSelectedImage(null);
    const maxMaHangHoa = Math.max(...hangHoas.map(hh => parseInt(hh.MaHangHoa, 10)), 0);
    const newMaHangHoa = (maxMaHangHoa + 1).toString();
    
    setEditingHangHoa({
      MaHangHoa: newMaHangHoa,
      MaChungLoai: "",
      TenHangHoa: "",
      MaHang: "",
      MaKhuyenMai: "",
      MoTa: "",
      ThoiGianBaoHanh: "",
      Anh: "",
      TrangThai: "1"
    });
    setShowModal(true);
  };

  const handleEdit = (hangHoa) => {
    setModalType("edit");
    setSelectedImage(null);
    setEditingHangHoa({
      ...hangHoa
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!editingHangHoa.TenHangHoa || editingHangHoa.TenHangHoa.trim() === '') {
      setNotification({
        message: 'Vui lòng nhập tên hàng hóa',
        type: 'error'
      });
      return;
    }

    if (!editingHangHoa.MaChungLoai || editingHangHoa.MaChungLoai.trim() === '') {
      setNotification({
        message: 'Vui lòng chọn chủng loại',
        type: 'error'
      });
      return;
    }

    if (!editingHangHoa.MaHang || editingHangHoa.MaHang.trim() === '') {
      setNotification({
        message: 'Vui lòng chọn hãng',
        type: 'error'
      });
      return;
    }

    try {
      const formData = new FormData();
      
      // Thêm các trường dữ liệu vào FormData
      Object.keys(editingHangHoa).forEach(key => {
        // Chỉ thêm các trường có giá trị
        if (editingHangHoa[key] !== null && editingHangHoa[key] !== undefined) {
          formData.append(key, editingHangHoa[key].toString().trim());
        }
      });

      // Thêm file ảnh nếu có
      if (selectedImage) {
        formData.append('Anh', selectedImage);
      }

      // Log FormData để debug
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      let response;
      if (modalType === "edit") {
        response = await fetch('http://localhost/web2/server/api/updateHangHoa.php', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch('http://localhost/web2/server/api/addHangHoa.php', {
          method: 'POST',
          body: formData
        });
      }

      const data = await response.json();
      console.log("Server response:", data); // Log phản hồi từ server

      if (data.success) {
        setNotification({
          message: modalType === "edit" ? "Cập nhật hàng hóa thành công" : "Thêm hàng hóa thành công",
          type: 'success'
        });
        setShowModal(false);
        await loadData();
      } else {
        setNotification({
          message: data.message || "Có lỗi xảy ra",
          type: 'error'
        });
      }
    } catch (error) {
      console.error("Error:", error); // Log lỗi nếu có
      setNotification({
        message: "Có lỗi xảy ra: " + (error.message || "Không xác định"),
        type: 'error'
      });
    }
  };

  const filterHangHoas = () => {
    if (!searchTerm.trim()) return hangHoas;

    return hangHoas.filter(hangHoa => {
      const searchLower = searchTerm.toLowerCase();
      
      switch (searchCriteria) {
        case "MaHangHoa":
          return hangHoa.MaHangHoa.toLowerCase().includes(searchLower);
        case "TenHangHoa":
          return hangHoa.TenHangHoa.toLowerCase().includes(searchLower);
        case "MaChungLoai":
          const chungLoai = chungLoais.find(cl => cl.MaChungLoai === hangHoa.MaChungLoai);
          return chungLoai?.TenChungLoai.toLowerCase().includes(searchLower);
        case "MaHang":
          const hang = hangs.find(h => h.MaHang === hangHoa.MaHang);
          return hang?.TenHang.toLowerCase().includes(searchLower);
        case "all":
          return (
            hangHoa.MaHangHoa.toLowerCase().includes(searchLower) ||
            hangHoa.TenHangHoa.toLowerCase().includes(searchLower) ||
            (chungLoais.find(cl => cl.MaChungLoai === hangHoa.MaChungLoai)?.TenChungLoai.toLowerCase().includes(searchLower)) ||
            (hangs.find(h => h.MaHang === hangHoa.MaHang)?.TenHang.toLowerCase().includes(searchLower)) ||
            (hangHoa.MoTa && hangHoa.MoTa.toLowerCase().includes(searchLower)) ||
            (hangHoa.ThoiGianBaoHanh && hangHoa.ThoiGianBaoHanh.toString().includes(searchLower))
          );
        default:
          return true;
      }
    });
  };

  const filteredHangHoas = filterHangHoas();
  const totalPages = Math.ceil(filteredHangHoas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHangHoas = filteredHangHoas.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <h2 className="admin-header">Quản lý hàng hóa</h2>
      
      <div className="search-container" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="modal-input"
          style={{ flex: 1 }}
        />
        <select
          value={searchCriteria}
          onChange={(e) => {
            setSearchCriteria(e.target.value);
            setCurrentPage(1);
          }}
          className="modal-input"
          style={{ width: 'auto' }}
        >
          <option value="all">Tất cả</option>
          <option value="MaHangHoa">Mã hàng hóa</option>
          <option value="TenHangHoa">Tên hàng hóa</option>
          <option value="MaChungLoai">Chủng loại</option>
          <option value="MaHang">Hãng</option>
        </select>
      </div>

      <button 
        onClick={handleAdd}
        className="button-common button-add"
      >
        Thêm hàng hóa
      </button>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {filteredHangHoas.length === 0 ? (
            <div className="no-results-message">
              Không tìm thấy kết quả phù hợp
            </div>
          ) : (
            <>
              <table className="table-container">
                <thead>
                  <tr>
                    <th className="table-header">Mã hàng hóa</th>
                    <th className="table-header">Chủng loại</th>
                    <th className="table-header">Tên hàng hóa</th>
                    <th className="table-header">Hãng</th>
                    <th className="table-header">Khuyến mãi</th>
                    <th className="table-header">Mô tả</th>
                    <th className="table-header">Thời gian bảo hành (Tháng)</th>
                    <th className="table-header">Ảnh</th>
                    <th className="table-header">Trạng thái</th>
                    <th className="table-header">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHangHoas.map((hangHoa, index) => {
                    const chungLoai = chungLoais.find(cl => cl.MaChungLoai === hangHoa.MaChungLoai);
                    const hang = hangs.find(h => h.MaHang === hangHoa.MaHang);
                    const khuyenMai = khuyenMais.find(km => km.MaKhuyenMai === hangHoa.MaKhuyenMai);
                    
                    return (
                      <tr key={`hanghoa-${hangHoa.MaHangHoa}`} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                        <td>{hangHoa.MaHangHoa}</td>
                        <td>{chungLoai ? chungLoai.TenChungLoai : hangHoa.MaChungLoai}</td>
                        <td>{hangHoa.TenHangHoa}</td>
                        <td>{hang ? hang.TenHang : hangHoa.MaHang}</td>
                        <td>{khuyenMai ? `${khuyenMai.TenKhuyenMai} (${khuyenMai.PhanTram}%)` : "(Trống)"}</td>
                        <td>{hangHoa.MoTa}</td>
                        <td>{hangHoa.ThoiGianBaoHanh}</td>
                        <td className="product-image-cell">
                          {hangHoa.Anh ? (
                            <img 
                              src={hangHoa.Anh} 
                              alt={hangHoa.TenHangHoa} 
                              className="product-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.textContent = '(trống)';
                              }}
                            />
                          ) : (
                            <span>(trống)</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${hangHoa.TrangThai === "1" ? 'status-active' : 'status-inactive'}`}>
                            {hangHoa.TrangThai === "1" ? "Hoạt động" : "Ngừng hoạt động"}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleEdit(hangHoa)}
                            className="button-common button-edit"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleToggleTrangThai(hangHoa)}
                            className={`button-common ${hangHoa.TrangThai === "1" ? 'button-delete' : 'button-add'}`}
                          >
                            {hangHoa.TrangThai === "1" ? "Ngừng hoạt động" : "Kích hoạt"}
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
          <div className="modal-content">
            <h2 className="modal-title">
              {modalType === "add" ? "Thêm hàng hóa" : "Sửa hàng hóa"}
            </h2>
            
            <div className="form-group">
              <label className="form-label">Mã hàng hóa:</label>
              <input
                type="text"
                className="modal-input"
                value={editingHangHoa.MaHangHoa || ''}
                readOnly
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chủng loại:</label>
              <select
                className="modal-input"
                value={editingHangHoa.MaChungLoai || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, MaChungLoai: e.target.value})}
              >
                <option value="">Chọn chủng loại</option>
                {chungLoais.map(cl => (
                  <option key={cl.MaChungLoai} value={cl.MaChungLoai}>
                    {cl.TenChungLoai}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tên hàng hóa:</label>
              <input
                type="text"
                className="modal-input"
                value={editingHangHoa.TenHangHoa || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, TenHangHoa: e.target.value})}
                placeholder="Nhập tên hàng hóa"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hãng:</label>
              <select
                className="modal-input"
                value={editingHangHoa.MaHang || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, MaHang: e.target.value})}
              >
                <option value="">Chọn hãng</option>
                {hangs.map(hang => (
                  <option key={hang.MaHang} value={hang.MaHang}>
                    {hang.TenHang}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Khuyến mãi:</label>
              <select
                className="modal-input"
                value={editingHangHoa.MaKhuyenMai || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, MaKhuyenMai: e.target.value})}
              >
                <option value="">Chọn khuyến mãi</option>
                {khuyenMais.map(km => (
                  <option key={km.MaKhuyenMai} value={km.MaKhuyenMai}>
                    {km.TenKhuyenMai} ({km.PhanTram}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả:</label>
              <textarea
                className="modal-input"
                value={editingHangHoa.MoTa || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, MoTa: e.target.value})}
                placeholder="Nhập mô tả"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời gian bảo hành:</label>
              <input
                type="text"
                className="modal-input"
                value={editingHangHoa.ThoiGianBaoHanh || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, ThoiGianBaoHanh: e.target.value})}
                placeholder="Nhập thời gian bảo hành"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái:</label>
              <select
                className="modal-input"
                value={editingHangHoa.TrangThai || '1'}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, TrangThai: e.target.value})}
              >
                <option value="1">Hoạt động</option>
                <option value="0">Ngừng hoạt động</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ảnh:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="modal-input"
              />
              {editingHangHoa.Anh && (
                <div className="image-preview">
                  <img 
                    src={editingHangHoa.Anh} 
                    alt="Preview" 
                    className="preview-image"
                  />
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button className="modal-button modal-button-submit" onClick={handleSave}>
                {modalType === "add" ? "Thêm" : "Lưu"}
              </button>
              <button className="modal-button modal-button-cancel" onClick={() => setShowModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyHangHoa;
