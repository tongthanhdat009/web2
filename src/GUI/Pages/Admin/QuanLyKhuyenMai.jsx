import React, { useState, useEffect } from "react";
import { fetchKhuyenMai, addKhuyenMai, updateKhuyenMai, deleteKhuyenMai } from "../../../DAL/api.jsx";
import KhuyenMaiDTO from "../../../DTO/KhuyenMaiDTO";
import "../../../GUI/Components/css/QuanLyKhuyenMai.css";

const QuanLyKhuyenMai = () => {
  const [khuyenMais, setKhuyenMais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [editingKhuyenMai, setEditingKhuyenMai] = useState({ 
    MaKhuyenMai: "", 
    TenKhuyenMai: "", 
    MoTaKhuyenMai: "", 
    PhanTram: "" 
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadKhuyenMais();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadKhuyenMais = async () => {
    setLoading(true);
    try {
      const data = await fetchKhuyenMai();
      setKhuyenMais(data);

      // Tự động tạo Mã khuyến mãi mới khi thêm
      const maxMaKhuyenMai = Math.max(...data.map(km => parseInt(km.MaKhuyenMai, 10)), 0);
      setEditingKhuyenMai(prevState => ({
        ...prevState,
        MaKhuyenMai: (maxMaKhuyenMai + 1).toString()
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
    // Tính toán mã khuyến mãi mới
    const maxMaKhuyenMai = Math.max(...khuyenMais.map(km => parseInt(km.MaKhuyenMai, 10)), 0);
    const newMaKhuyenMai = (maxMaKhuyenMai + 1).toString();
    
    setEditingKhuyenMai({
      MaKhuyenMai: newMaKhuyenMai,
      TenKhuyenMai: "",
      MoTaKhuyenMai: "",
      PhanTram: ""
    });
    setShowModal(true);
  };

  const handleEdit = (khuyenMai) => {
    setModalType("edit");
    setEditingKhuyenMai({ ...khuyenMai });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!editingKhuyenMai.TenKhuyenMai || editingKhuyenMai.TenKhuyenMai.trim() === '') {
      setNotification({
        message: 'Vui lòng nhập tên khuyến mãi',
        type: 'error'
      });
      return;
    }

    if (!editingKhuyenMai.MoTaKhuyenMai || editingKhuyenMai.MoTaKhuyenMai.trim() === '') {
      setNotification({
        message: 'Vui lòng nhập mô tả khuyến mãi',
        type: 'error'
      });
      return;
    }

    const phanTram = parseInt(editingKhuyenMai.PhanTram);
    if (isNaN(phanTram) || phanTram < 0 || phanTram > 100) {
      setNotification({
        message: 'Vui lòng nhập phần trăm hợp lệ (0-100)',
        type: 'error'
      });
      return;
    }

    try {
      const khuyenMaiDTO = new KhuyenMaiDTO({
        MaKhuyenMai: editingKhuyenMai.MaKhuyenMai,
        TenKhuyenMai: editingKhuyenMai.TenKhuyenMai.trim(),
        MoTaKhuyenMai: editingKhuyenMai.MoTaKhuyenMai.trim(),
        PhanTram: phanTram
      });
      
      let response;
      if (modalType === "edit") {
        response = await updateKhuyenMai(khuyenMaiDTO);
      } else {
        response = await addKhuyenMai(khuyenMaiDTO);
      }

      if (response && response.success) {
        setNotification({
          message: modalType === "edit" ? "Cập nhật khuyến mãi thành công" : "Thêm khuyến mãi thành công",
          type: 'success'
        });
        setShowModal(false);
        await loadKhuyenMais();
      } else {
        const errorMessage = response?.message || (modalType === "edit" ? "Cập nhật thất bại" : "Thêm thất bại");
        // Kiểm tra nếu là lỗi trùng tên
        if (response?.message && response.message.toLowerCase().includes('đã tồn tại')) {
          setNotification({
            message: errorMessage,
            type: 'warning'
          });
        } else {
          setNotification({
            message: errorMessage,
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      setNotification({
        message: "Có lỗi xảy ra: " + (error.message || "Không xác định"),
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteKhuyenMai(deleteId);
      if (response.success) {
        setNotification({
          message: "Xóa khuyến mãi thành công",
          type: 'success'
        });
        loadKhuyenMais();
      } else {
        setNotification({
          message: response.message || "Xóa thất bại",
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        message: "Có lỗi xảy ra khi xóa: " + error.message,
        type: 'error'
      });
    }
    setShowConfirm(false);
  };

  const handleConfirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", backgroundColor: "#ffffff", borderRadius: "10px", minHeight: "500px" }}>
      {notification && (
        <div className={`notification-container notification-${notification.type}`}>
          <span style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : '⚠'}
          </span>
          {notification.message}
        </div>
      )}
      <h2 style={{ textAlign: "center", color: "brown", marginBottom: "20px" }}>Quản lý khuyến mãi</h2>
      <button 
        onClick={handleAdd}
        className="button-common button-add"
        style={{ marginBottom: "20px" }}
      >
        Thêm khuyến mãi
      </button>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải dữ liệu...</div>
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th className="table-header">Mã khuyến mãi</th>
              <th className="table-header">Tên khuyến mãi</th>
              <th className="table-header">Mô tả</th>
              <th className="table-header">Phần trăm</th>
              <th className="table-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {khuyenMais.map((khuyenMai, index) => (
              <tr key={khuyenMai.MaKhuyenMai} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                <td>{khuyenMai.MaKhuyenMai}</td>
                <td>{khuyenMai.TenKhuyenMai}</td>
                <td>{khuyenMai.MoTaKhuyenMai}</td>
                <td>{khuyenMai.PhanTram}%</td>
                <td>
                  <button
                    onClick={() => handleEdit(khuyenMai)}
                    className="button-common button-edit"
                    style={{ marginRight: "8px" }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(khuyenMai.MaKhuyenMai)}
                    className="button-common button-delete"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">
              {modalType === "add" ? "Thêm khuyến mãi" : "Sửa khuyến mãi"}
            </h2>
            
            <div className="form-group">
              <label className="form-label">Mã khuyến mãi:</label>
              <input
                type="text"
                className="modal-input"
                value={editingKhuyenMai.MaKhuyenMai || ''}
                onChange={(e) => setEditingKhuyenMai({...editingKhuyenMai, MaKhuyenMai: e.target.value})}
                disabled={modalType === "edit"}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tên khuyến mãi:</label>
              <input
                type="text"
                className="modal-input"
                value={editingKhuyenMai.TenKhuyenMai || ''}
                onChange={(e) => setEditingKhuyenMai({...editingKhuyenMai, TenKhuyenMai: e.target.value})}
                placeholder="Nhập tên khuyến mãi"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả:</label>
              <input
                type="text"
                className="modal-input"
                value={editingKhuyenMai.MoTaKhuyenMai || ''}
                onChange={(e) => setEditingKhuyenMai({...editingKhuyenMai, MoTaKhuyenMai: e.target.value})}
                placeholder="Nhập mô tả khuyến mãi"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phần trăm:</label>
              <input
                type="number"
                className="modal-input"
                value={editingKhuyenMai.PhanTram || ''}
                onChange={(e) => setEditingKhuyenMai({...editingKhuyenMai, PhanTram: e.target.value})}
                placeholder="Nhập phần trăm khuyến mãi"
                min="0"
                max="100"
              />
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
            <p style={{ marginBottom: "20px" }}>Bạn có chắc chắn muốn xóa khuyến mãi này?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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

export default QuanLyKhuyenMai;