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
  const [editingHangHoa, setEditingHangHoa] = useState({ 
    MaHangHoa: "", 
    MaChungLoai: "", 
    TenHangHoa: "", 
    MaHang: "", 
    MaKhuyenMai: "", 
    MoTa: "", 
    ThoiGianBaoHanh: "", 
    Anh: "" 
  }); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
      const maxMaHangHoa = Math.max(...hangHoaData.map(hh => parseInt(hh.maHangHoa, 10)), 0);
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
      // Đảo trạng thái: nếu đang là 1 thì đổi thành 0, ngược lại
      const updatedTrangThai = hangHoa.trangThai === "1" ? "0" : "1";
  
      // Tạo bản sao với các thuộc tính viết hoa đầu và trạng thái mới
      const updatedHangHoa = {
        MaHangHoa: hangHoa.maHangHoa,
        TenHangHoa: hangHoa.tenHangHoa,
        MaChungLoai: hangHoa.maChungLoai,
        MaHang: hangHoa.maHang,
        MaKhuyenMai: hangHoa.maKhuyenMai || null,
        MoTa: hangHoa.moTa || null,
        ThoiGianBaoHanh: hangHoa.thoiGianBaoHanh || null,
        Anh: hangHoa.anh || null,
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
          message: "Cập nhật trạng thái thất bại",
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
      // Tạo URL tạm thời cho ảnh
      const imageUrl = URL.createObjectURL(file);
      setEditingHangHoa(prev => ({ ...prev, Anh: imageUrl }));
    }
  };

  const handleAdd = () => {
    setModalType("add");
    setSelectedImage(null);
    // Tính toán mã hàng hóa mới
    const maxMaHangHoa = Math.max(...hangHoas.map(hh => parseInt(hh.maHangHoa, 10)), 0);
    const newMaHangHoa = (maxMaHangHoa + 1).toString();
    
    setEditingHangHoa({
      MaHangHoa: newMaHangHoa,
      MaChungLoai: "",
      TenHangHoa: "",
      MaHang: "",
      MaKhuyenMai: "",
      MoTa: "",
      ThoiGianBaoHanh: "",
      Anh: ""
    });
    setShowModal(true);
  };

  const handleEdit = (hangHoa) => {
    setModalType("edit");
    setSelectedImage(null);
    
    // Mapping chính xác giữa DTO và state
    setEditingHangHoa({
      MaHangHoa: hangHoa.maHangHoa,
      MaChungLoai: hangHoa.maChungLoai,
      TenHangHoa: hangHoa.tenHangHoa,
      MaHang: hangHoa.maHang,
      MaKhuyenMai: hangHoa.maKhuyenMai || "",
      MoTa: hangHoa.moTa || "",
      ThoiGianBaoHanh: hangHoa.thoiGianBaoHanh || "",
      Anh: hangHoa.anh || ""
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
      const hangHoaDTO = {
        MaHangHoa: editingHangHoa.MaHangHoa,
        MaChungLoai: editingHangHoa.MaChungLoai.trim(),
        TenHangHoa: editingHangHoa.TenHangHoa.trim(),
        MaHang: editingHangHoa.MaHang.trim(),
        MaKhuyenMai: editingHangHoa.MaKhuyenMai.trim() || null,
        MoTa: editingHangHoa.MoTa.trim() || null,
        ThoiGianBaoHanh: editingHangHoa.ThoiGianBaoHanh.trim() || null,
        Anh: editingHangHoa.Anh.trim() || null
      };
      
      let response;
      if (modalType === "edit") {
        response = await updateHangHoa(hangHoaDTO);
      } else {
        response = await addHangHoa(hangHoaDTO);
      }

      if (response.success) {
        setNotification({
          message: modalType === "edit" ? "Cập nhật hàng hóa thành công" : "Thêm hàng hóa thành công",
          type: 'success'
        });
        setShowModal(false);
        await loadData();
      } else {
        setNotification({
          message: response.message || "Có lỗi xảy ra",
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      setNotification({
        message: "Có lỗi xảy ra: " + (error.message || "Không xác định"),
        type: 'error'
      });
    }
  };


  const totalPages = Math.ceil(hangHoas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHangHoas = hangHoas.slice(startIndex, endIndex);

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
          <table className="table-container">
            <thead>
              <tr>
                <th className="table-header">Mã hàng hóa</th>
                <th className="table-header">Mã chủng loại</th>
                <th className="table-header">Tên hàng hóa</th>
                <th className="table-header">Mã hãng</th>
                <th className="table-header">Mã khuyến mãi</th>
                <th className="table-header">Mô tả</th>
                <th className="table-header">Thời gian bảo hành</th>
                <th className="table-header">Ảnh</th>
                <th className="table-header">Trạng thái</th>
                <th className="table-header">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentHangHoas.map((hangHoa, index) => (
                <tr key={`hanghoa-${hangHoa.maHangHoa}`} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td>{hangHoa.maHangHoa}</td>
                  <td>{hangHoa.maChungLoai}</td>
                  <td>{hangHoa.tenHangHoa}</td>
                  <td>{hangHoa.maHang}</td>
                  <td>{hangHoa.maKhuyenMai || "(trống)"}</td>
                  <td>{hangHoa.moTa}</td>
                  <td>{hangHoa.thoiGianBaoHanh}</td>
                  <td className="product-image-cell">
                    {hangHoa.anh ? (
                      <img 
                        key={`image-${hangHoa.maHangHoa}`}
                        src={hangHoa.anh} 
                        alt={hangHoa.tenHangHoa} 
                        className="product-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = '(trống)';
                        }}
                        
                      />
                      
                    ) : (
                      <span key={`no-image-${hangHoa.maHangHoa}`}>(trống)</span>
                    )}
                  </td>
                  <td>{hangHoa.trangThai === "1" ? "Hoạt động" : "Ngừng hoạt động"}</td>

                  <td>
                    <button
                      key={`edit-${hangHoa.maHangHoa}`}
                      onClick={() => handleEdit(hangHoa)}
                      className="button-common button-edit"
                    >
                      Sửa
                    </button>
                    <button
                          onClick={() => handleToggleTrangThai(hangHoa)}
                          className="button-common button-delete"
                        >
                          {hangHoa.trangThai === "1" ? "Ngừng hoạt động" : "Kích hoạt"}
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
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
                onChange={(e) => setEditingHangHoa({...editingHangHoa, MaHangHoa: e.target.value})}
                disabled={modalType === "edit"}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chủng loại:</label>
              <select
                className="modal-input"
                value={editingHangHoa.MaChungLoai || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, MaChungLoai: e.target.value})}
              >
                <option key="cl-default" value="">Chọn chủng loại</option>
                {chungLoais.filter(cl => cl && cl.MaChungLoai).map(cl => (
                  <option key={`cl-${cl.MaChungLoai}`} value={cl.MaChungLoai}>
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
                disabled={modalType === 'edit'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hãng:</label>
              <select
                className="modal-input"
                value={editingHangHoa.MaHang || ''}
                onChange={(e) => setEditingHangHoa({...editingHangHoa, MaHang: e.target.value})}
              >
                <option key="hang-default" value="">Chọn hãng</option>
                {hangs.filter(hang => hang && hang.MaHang).map(hang => (
                  <option key={`hang-${hang.MaHang}`} value={hang.MaHang}>
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
                <option key="km-default" value="">Chọn khuyến mãi</option>
                {khuyenMais.filter(km => km && km.MaKhuyenMai).map(km => (
                  <option key={`km-${km.MaKhuyenMai}`} value={km.MaKhuyenMai}>
                    {km.TenKhuyenMai} ({km.MaKhuyenMai}%)
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

      {showConfirm && (
        <div className="modal-container">
          <div className="modal-content">
            <h3 style={{ marginBottom: "20px" }}>Xác nhận xóa</h3>
            <p style={{ marginBottom: "20px" }}>Bạn có chắc chắn muốn xóa hàng hóa này?</p>
            <div className="modal-buttons">
              <button
                onClick={() => setShowConfirm(false)}
                className="modal-button modal-button-cancel"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="modal-button modal-button-submit"
                style={{ backgroundColor: "#f44336" }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyHangHoa;
