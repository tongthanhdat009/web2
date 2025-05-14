import React, { useState, useEffect } from "react";
import { fetchNCC, addNCC, updateNCC, deleteNCC, fetchQuyenByTaiKhoan } from "../../../DAL/api.jsx";
import NhaCungCapDTO from "../../../DTO/NhaCungCapDTO";
import "../../../GUI/Components/css/QuanLyNhaCungCap.css";

const ITEMS_PER_PAGE = 10;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [permissions, setPermissions] = useState({
    them: false,
    xoa: false,
    sua: false
  });

  useEffect(() => {
    loadNCCs();
    checkPermissions();
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

  const checkPermissions = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        setPermissions({ them: false, xoa: false, sua: false });
        return;
      }
      const data = await fetchQuyenByTaiKhoan(userInfo.IDTaiKhoan);
      if (data.success) {
        const permission = data.data.find(item => item.IDChucNang === 4);
        if (permission) {
          setPermissions({
            them: permission.Them === 1,
            xoa: permission.Xoa === 1,
            sua: permission.Sua === 1
          });
        } else {
          setPermissions({ them: false, xoa: false, sua: false });
        }
      } else {
        setPermissions({ them: false, xoa: false, sua: false });
      }
    } catch (error) {
      setPermissions({ them: false, xoa: false, sua: false });
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

  const filterNhaCungCaps = () => {
    if (!searchTerm.trim()) return nhaCungCaps;

    return nhaCungCaps.filter(ncc => {
      const searchLower = searchTerm.toLowerCase();
      
      switch (searchCriteria) {
        case "MaNhaCungCap":
          return ncc.MaNhaCungCap.toLowerCase().includes(searchLower);
        case "TenNhaCungCap":
          return ncc.TenNhaCungCap.toLowerCase().includes(searchLower);
        case "all":
          return (
            ncc.MaNhaCungCap.toLowerCase().includes(searchLower) ||
            ncc.TenNhaCungCap.toLowerCase().includes(searchLower)
          );
        default:
          return true;
      }
    });
  };

  const filteredNhaCungCaps = filterNhaCungCaps();
  const totalPages = Math.ceil(filteredNhaCungCaps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNhaCungCaps = filteredNhaCungCaps.slice(startIndex, endIndex);

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
          <option value="MaNhaCungCap">Mã nhà cung cấp</option>
          <option value="TenNhaCungCap">Tên nhà cung cấp</option>
        </select>
      </div>

      {permissions.them && (
        <button 
          onClick={handleAdd}
          className="button-common button-add"
          style={{ marginBottom: "20px" }}
        >
          Thêm nhà cung cấp
        </button>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          {filteredNhaCungCaps.length === 0 ? (
            <div className="no-results-message">
              Không tìm thấy kết quả phù hợp
            </div>
          ) : (
            <>
              <table className="table-container">
                <thead>
                  <tr>
                    <th className="table-header">Mã nhà cung cấp</th>
                    <th className="table-header">Tên nhà cung cấp</th>
                    {(permissions.sua || permissions.xoa) && (
                      <th className="table-header">Thao tác</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentNhaCungCaps.map((ncc, index) => (
                    <tr key={ncc.MaNhaCungCap} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                      <td>{ncc.MaNhaCungCap}</td>
                      <td>{ncc.TenNhaCungCap}</td>
                      {(permissions.sua || permissions.xoa) && (
                        <td>
                          {permissions.sua && (
                            <button
                              onClick={() => handleEdit(ncc)}
                              className="button-common button-edit"
                            >
                              Sửa
                            </button>
                          )}
                          {permissions.xoa && (
                            <button
                              onClick={() => handleConfirmDelete(ncc.MaNhaCungCap)}
                              className="button-common button-delete"
                            >
                              Xóa
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
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
