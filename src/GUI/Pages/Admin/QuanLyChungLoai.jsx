import React, { useState, useEffect } from "react";
import { fetchChungLoai, addChungLoai, updateChungLoai, fetchTheLoai } from "../../../DAL/api";
import "../../../GUI/Components/css/QuanLyChungLoai.css";

const ITEMS_PER_PAGE = 10;

const QuanLyChungLoai = () => {
  const [chungLoais, setChungLoais] = useState([]);
  const [theLoais, setTheLoais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [editingChungLoai, setEditingChungLoai] = useState({ 
    MaChungLoai: "", 
    TenChungLoai: "", 
    MaTheLoai: "" 
  });
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
      const [chungLoaiData, theLoaiData] = await Promise.all([
        fetchChungLoai(),
        fetchTheLoai()
      ]);
      
      setChungLoais(chungLoaiData);
      setTheLoais(theLoaiData);

      // Tự động tạo Mã chủng loại mới khi thêm
      const maxMaChungLoai = Math.max(...chungLoaiData.map(cl => parseInt(cl.MaChungLoai, 10)), 0);
      setEditingChungLoai(prevState => ({
        ...prevState,
        MaChungLoai: (maxMaChungLoai + 1).toString()
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

  const handleAdd = () => {
    setModalType("add");
    // Tính toán mã chủng loại mới
    const maxMaChungLoai = Math.max(...chungLoais.map(cl => parseInt(cl.MaChungLoai, 10)), 0);
    const newMaChungLoai = (maxMaChungLoai + 1).toString();
    
    setEditingChungLoai({
      MaChungLoai: newMaChungLoai,
      TenChungLoai: "",
      MaTheLoai: ""
    });
    setShowModal(true);
  };

  const handleEdit = (chungLoai) => {
    setModalType("edit");
    setEditingChungLoai({ ...chungLoai });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!editingChungLoai.TenChungLoai || editingChungLoai.TenChungLoai.trim() === '') {
      setNotification({
        message: 'Vui lòng nhập tên chủng loại',
        type: 'error'
      });
      return;
    }

    if (!editingChungLoai.MaTheLoai) {
      setNotification({
        message: 'Vui lòng chọn thể loại',
        type: 'error'
      });
      return;
    }

    try {
      const chungLoaiDTO = {
        MaChungLoai: editingChungLoai.MaChungLoai,
        TenChungLoai: editingChungLoai.TenChungLoai.trim(),
        MaTheLoai: editingChungLoai.MaTheLoai
      };
      
      let response;
      if (modalType === "edit") {
        response = await updateChungLoai(chungLoaiDTO);
      } else {
        response = await addChungLoai(chungLoaiDTO);
      }

      if (response.success) {
        setNotification({
          message: modalType === "edit" ? "Cập nhật chủng loại thành công" : "Thêm chủng loại thành công",
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

  const totalPages = Math.ceil(chungLoais.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentChungLoais = chungLoais.slice(startIndex, endIndex);

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
      <h2 className="admin-header">Quản lý chủng loại</h2>
      <button 
        onClick={handleAdd}
        className="button-common button-add"
      >
        Thêm chủng loại
      </button>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <tr>
                <th className="table-header">Mã chủng loại</th>
                <th className="table-header">Tên chủng loại</th>
                <th className="table-header">Tên thể loại</th>
                <th className="table-header">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentChungLoais.map((chungLoai, index) => (
                <tr key={chungLoai.MaChungLoai} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td>{chungLoai.MaChungLoai}</td>
                  <td>{chungLoai.TenChungLoai}</td>
                  <td>{chungLoai.TenTheLoai || "(trống)"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(chungLoai)}
                      className="button-common button-edit"
                    >
                      Sửa
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
              {modalType === "add" ? "Thêm chủng loại" : "Sửa chủng loại"}
            </h2>
            
            <div className="form-group">
              <label className="form-label">Mã chủng loại:</label>
              <input
                type="text"
                className="modal-input"
                value={editingChungLoai.MaChungLoai || ''}
                readOnly
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tên chủng loại:</label>
              <input
                type="text"
                className="modal-input"
                value={editingChungLoai.TenChungLoai || ''}
                onChange={(e) => setEditingChungLoai({...editingChungLoai, TenChungLoai: e.target.value})}
                placeholder="Nhập tên chủng loại"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thể loại:</label>
              <select
                className="modal-input"
                value={editingChungLoai.MaTheLoai || ''}
                onChange={(e) => setEditingChungLoai({...editingChungLoai, MaTheLoai: e.target.value})}
              >
                <option value="">Chọn thể loại</option>
                {theLoais.map(theLoai => (
                  <option key={theLoai.MaTheLoai} value={theLoai.MaTheLoai}>
                    {theLoai.TenTheLoai}
                  </option>
                ))}
              </select>
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

export default QuanLyChungLoai;
