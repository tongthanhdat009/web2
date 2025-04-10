import React, { useState, useEffect } from "react";
import { fetchHang, addHang, updateHang, deleteHang } from "../../../DAL/api.jsx";
import HangDTO from "../../../DTO/HangDTO";
import "../../../GUI/Components/css/QuanLyHang.css";

const QuanLyHang = () => {
  const [hangs, setHangs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [editingHang, setEditingHang] = useState({ 
    MaHang: "", 
    TenHang: "" 
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadHangs();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadHangs = async () => {
    setLoading(true);
    try {
      const data = await fetchHang();
      setHangs(data);

      // Tự động tạo Mã hãng mới khi thêm
      const maxMaHang = Math.max(...data.map(hang => parseInt(hang.MaHang, 10)), 0);
      setEditingHang(prevState => ({
        ...prevState,
        MaHang: (maxMaHang + 1).toString()
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
    // Tính toán mã hãng mới
    const maxMaHang = Math.max(...hangs.map(hang => parseInt(hang.MaHang, 10)), 0);
    const newMaHang = (maxMaHang + 1).toString();
    
    setEditingHang({
      MaHang: newMaHang,
      TenHang: ""
    });
    setShowModal(true);
  };

  const handleEdit = (hang) => {
    setModalType("edit");
    setEditingHang({ ...hang });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!editingHang.TenHang || editingHang.TenHang.trim() === '') {
      setNotification({
        message: 'Vui lòng nhập tên hãng',
        type: 'error'
      });
      return;
    }

    try {
      const hangDTO = new HangDTO({
        MaHang: editingHang.MaHang,
        TenHang: editingHang.TenHang.trim()
      });
      
      let response;
      if (modalType === "edit") {
        response = await updateHang(hangDTO);
      } else {
        response = await addHang(hangDTO);
      }

      if (response && response.success) {
        setNotification({
          message: modalType === "edit" ? "Cập nhật hãng thành công" : "Thêm hãng thành công",
          type: 'success'
        });
        setShowModal(false);
        await loadHangs();
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
      const response = await deleteHang(deleteId);
      if (response.success) {
        setNotification({
          message: "Xóa hãng thành công",
          type: 'success'
        });
        loadHangs();
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
      <h2 style={{ textAlign: "center", color: "brown", marginBottom: "20px" }}>Quản lý hãng</h2>
      <button 
        onClick={handleAdd}
        className="button-common button-add"
        style={{ marginBottom: "20px" }}
      >
        Thêm hãng
      </button>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải dữ liệu...</div>
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th className="table-header">Mã hãng</th>
              <th className="table-header">Tên hãng</th>
              <th className="table-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {hangs.map((hang, index) => (
              <tr key={hang.MaHang} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                <td>{hang.MaHang}</td>
                <td>{hang.TenHang}</td>
                <td>
                  <button
                    onClick={() => handleEdit(hang)}
                    className="button-common button-edit"
                    style={{ marginRight: "8px" }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(hang.MaHang)}
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
            <h3 style={{ marginBottom: "20px" }}>{modalType === "edit" ? "Sửa hãng" : "Thêm hãng"}</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Mã hãng:</label>
                <input
                  type="text"
                  value={editingHang.MaHang}
                  className="modal-input modal-input-disabled"
                  disabled
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Tên hãng:</label>
                <input
                  type="text"
                  value={editingHang.TenHang}
                  onChange={(e) => setEditingHang({ ...editingHang, TenHang: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="modal-button modal-button-cancel"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="modal-button modal-button-submit"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-container">
          <div className="modal-content">
            <h3 style={{ marginBottom: "20px" }}>Xác nhận xóa</h3>
            <p style={{ marginBottom: "20px" }}>Bạn có chắc chắn muốn xóa hãng này?</p>
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

export default QuanLyHang;