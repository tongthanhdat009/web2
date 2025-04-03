import React, { useState, useEffect } from "react";
import { fetchNCC, addNCC, updateNCC, deleteNCC } from "../../../DAL/api.jsx";
import NhaCungCapDTO from "../../../DTO/NhaCungCapDTO";
import "../../../GUI/Components/css/QuanLyNhaCungCap.css";

const QuanLyNhaCungCap = () => {
  const [nhaCungCaps, setNhaCungCaps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [editingNCC, setEditingNCC] = useState({ 
    MaNhaCungCap: "", 
    TenNhaCungCap: "" 
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadNCCs();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadNCCs = async () => {
    setLoading(true);
    try {
      const data = await fetchNCC();
      setNhaCungCaps(data);

      // Tự động tạo Mã nhà cung cấp mới khi thêm
      const maxMaNCC = Math.max(...data.map(ncc => parseInt(ncc.MaNhaCungCap, 10)), 0);
      setEditingNCC(prevState => ({
        ...prevState,
        MaNhaCungCap: (maxMaNCC + 1).toString()
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
    // Tính toán mã nhà cung cấp mới
    const maxMaNCC = Math.max(...nhaCungCaps.map(ncc => parseInt(ncc.MaNhaCungCap, 10)), 0);
    const newMaNCC = (maxMaNCC + 1).toString();
    
    setEditingNCC({
      MaNhaCungCap: newMaNCC,
      TenNhaCungCap: ""
    });
    setShowModal(true);
  };

  const handleEdit = (ncc) => {
    setModalType("edit");
    setEditingNCC({ ...ncc });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    if (!editingNCC.MaNhaCungCap || !editingNCC.TenNhaCungCap) {
      setNotification({
        message: 'Vui lòng nhập đầy đủ thông tin',
        type: 'error'
      });
      return;
    }

    try {
      const nccDTO = new NhaCungCapDTO(
        editingNCC.MaNhaCungCap,
        editingNCC.TenNhaCungCap
      );
      
      let response;
      if (modalType === "edit") {
        response = await updateNCC(nccDTO);
      } else {
        response = await addNCC(nccDTO);
      }

      if (response.success) {
        setNotification({
          message: modalType === "edit" ? "Cập nhật nhà cung cấp thành công" : "Thêm nhà cung cấp thành công",
          type: 'success'
        });
        setShowModal(false);
        loadNCCs();
      } else {
        if (response.message && response.message.includes("đã tồn tại")) {
          setNotification({
            message: "Tên nhà cung cấp đã tồn tại",
            type: 'warning'
          });
        } else {
          setNotification({
            message: response.message || (modalType === "edit" ? "Cập nhật thất bại" : "Thêm thất bại"),
            type: 'error'
          });
        }
      }
    } catch (error) {
      setNotification({
        message: "Có lỗi xảy ra: " + error.message,
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteNCC(deleteId);
      if (response.success) {
        setNotification({
          message: "Xóa nhà cung cấp thành công",
          type: 'success'
        });
        loadNCCs();
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
      <h2 style={{ textAlign: "center", color: "brown", marginBottom: "20px" }}>Quản lý nhà cung cấp</h2>
      <button 
        onClick={handleAdd}
        className="button-common button-add"
        style={{ marginBottom: "20px" }}
      >
        Thêm nhà cung cấp
      </button>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải dữ liệu...</div>
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th className="table-header">Mã nhà cung cấp</th>
              <th className="table-header">Tên nhà cung cấp</th>
              <th className="table-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {nhaCungCaps.map((ncc, index) => (
              <tr key={ncc.MaNhaCungCap} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                <td>{ncc.MaNhaCungCap}</td>
                <td>{ncc.TenNhaCungCap}</td>
                <td>
                  <button
                    onClick={() => handleEdit(ncc)}
                    className="button-common button-edit"
                    style={{ marginRight: "8px" }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(ncc.MaNhaCungCap)}
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
            <h3 style={{ marginBottom: "20px" }}>{modalType === "edit" ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Mã nhà cung cấp:</label>
                <input
                  type="text"
                  value={editingNCC.MaNhaCungCap}
                  className="modal-input modal-input-disabled"
                  disabled
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Tên nhà cung cấp:</label>
                <input
                  type="text"
                  value={editingNCC.TenNhaCungCap}
                  onChange={(e) => setEditingNCC({ ...editingNCC, TenNhaCungCap: e.target.value })}
                  className="modal-input"
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
            <p style={{ marginBottom: "20px" }}>Bạn có chắc chắn muốn xóa nhà cung cấp này?</p>
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

export default QuanLyNhaCungCap;
