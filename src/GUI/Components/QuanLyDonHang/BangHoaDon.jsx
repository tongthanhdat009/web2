import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../GUI/Components/css/QuanLyHang.css"; // Import CSS cho notification
import XemChiTiet from "./XemChiTiet";

const BangHoaDon = () => {
  const [donHang, setDonHang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [notification, setNotification] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMaHoaDon, setSelectedMaHoaDon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Thêm các biến giới hạn ngày
  const today = new Date().toISOString().split('T')[0]; // Định dạng YYYY-MM-DD của ngày hiện tại
  const minDate = "2025-01-01"; // Giới hạn min date là ngày 01/01/2025  
  
  useEffect(() => {
    const fetchDonHang = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost/Web2/server/api/getHoaDon.php");
        
        if (response.data.success) {
          setDonHang(response.data.data);
        } else {
          setError("Failed to fetch data");
          setNotification({
            message: "Không thể tải dữ liệu đơn hàng",
            type: 'error'
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error connecting to the server");
        setNotification({
          message: "Lỗi kết nối đến máy chủ",
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDonHang();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredDonHang = donHang.filter(dh => {
    const matchesSearch = 
      searchTerm === "" || 
      dh.MaHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dh.IDTaiKhoan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const currentStatus = dh.TrangThai;
    const matchesStatus = statusFilter === "" || currentStatus === statusFilter;
    
    // Lọc theo ngày đặt (NgayXuatHoaDon)
    let matchesDateRange = true;
    if (startDate && endDate) {
      const orderDate = new Date(dh.NgayXuatHoaDon);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Đặt thời gian về 00:00:00 và 23:59:59 để bao gồm cả ngày bắt đầu và kết thúc
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      matchesDateRange = orderDate >= start && orderDate <= end;
    } else if (startDate) {
      const orderDate = new Date(dh.NgayXuatHoaDon);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      matchesDateRange = orderDate >= start;
    } else if (endDate) {
      const orderDate = new Date(dh.NgayXuatHoaDon);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDateRange = orderDate <= end;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleAprove = async (id) => {
    try {
      if(!window.confirm("Bạn có chắc muốn duyệt đơn hàng này?")) {
        return;
      }
      
      setLoading(true);
      const response = await axios.post("http://localhost/Web2/server/api/updateHoaDon.php", {
        maHoaDon: id,
        trangThai: "Đã Duyệt", 
        ngayDuyet: new Date().toISOString().split('T')[0] // Ngày hiện tại định dạng YYYY-MM-DD
      });
      
      if (response.data.success) {
        // Cập nhật state để hiển thị UI mà không cần tải lại
        setDonHang(donHang.map(dh => 
          dh.MaHoaDon === id ? {...dh, TrangThai: "Đã Duyệt", NgayDuyet: new Date().toISOString().split('T')[0]} : dh
        ));
        
        const responseUpdateKhoHang = await axios.post(`http://localhost/Web2/server/api/QuanLyHoaDon/updateKhoHang.php?maHoaDon=${id}`, {
          maHoaDon: id,
        });
        
        if (responseUpdateKhoHang.data.success) {
          setNotification({
            message: "Đã duyệt đơn hàng thành công!",
            type: 'success'
          });
        }
      } else {
        setNotification({
          message: "Duyệt đơn hàng thất bại: " + response.data.message,
          type: 'error'
        });
      }
    } catch (error) {
      console.error("Error approving order:", error);
      setNotification({
        message: "Đã xảy ra lỗi khi duyệt đơn hàng",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = async (id) => {
    try {
      if(!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
        return;
      }
      
      setLoading(true);
      const response = await axios.post("http://localhost/Web2/server/api/updateHoaDon.php", {
        maHoaDon: id,
        trangThai: "Đã Hủy",
        ngayDuyet: new Date().toISOString().split('T')[0] // Ngày hiện tại định dạng YYYY-MM-DD
      });
      
      if (response.data.success) {
        // Cập nhật state để hiển thị UI mà không cần tải lại
        setDonHang(donHang.map(dh => 
          dh.MaHoaDon === id ? {...dh, TrangThai: "Đã Hủy", NgayDuyet: new Date().toISOString().split('T')[0]} : dh
        ));
        
        // Thay thế alert bằng notification
        setNotification({
          message: "Đã hủy đơn hàng thành công!",
          type: 'success'
        });
      } else {
        setNotification({
          message: "Hủy đơn hàng thất bại: " + response.data.message,
          type: 'warning'
        });
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      setNotification({
        message: "Đã xảy ra lỗi khi hủy đơn hàng",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (maHoaDon) => {
    setSelectedMaHoaDon(maHoaDon);
    setShowModal(true);
  }
  
  return (
    <>
      {notification && (
        <div className={`notification-container notification-${notification.type}`}>
          <span style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : '⚠'}
          </span>
          {notification.message}
        </div>
      )}

      <div className="mt-3 mb-4">
        <div className="row mb-3">
          <div className="col-md-8">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm kiếm đơn hàng..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="btn btn-primary" type="button">Tìm kiếm</button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-end">
              <select 
                className="form-select" 
                style={{maxWidth: "200px"}}
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đã giao">Đã giao</option>
                <option value="Đang chờ duyệt">Đang chờ duyệt</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Thêm bộ lọc ngày */}
        <div className="row">
          <div className="col-md-10">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <label className="form-label mb-1">Từ ngày:</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={minDate}
                  max={endDate || today} // Ngày bắt đầu không thể sau ngày kết thúc đã chọn hoặc ngày hiện tại
                />
              </div>
              <div className="me-3">
                <label className="form-label mb-1">Đến ngày:</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate || minDate}// Ngày kết thúc không thể trước ngày bắt đầu đã chọn
                  max={today}// Ngày bắt đầu không thể sau ngày kết thúc đã chọn hoặc ngày hiện tại
                />
              </div>
            </div>
          </div>
          <div className="col-md-2 d-flex align-items-end justify-content-end">
            <button 
              className="btn btn-outline-secondary" 
              onClick={handleClearDateFilter}
              disabled={!startDate && !endDate}
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr className="text-center" >
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Mã đơn hàng</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Mã khách hàng</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Ngày đặt</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Ngày duyệt</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Tổng tiền</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Trạng thái</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Xem chi tiết</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                
                {filteredDonHang.length > 0 ? (
                  filteredDonHang.map((dh) => (
                    <tr key={dh.MaHoaDon}>
                      <td className="text-center">{dh.MaHoaDon}</td>
                      <td className="text-center">{dh.IDTaiKhoan}</td>
                      <td className="text-center">{formatDate(dh.NgayXuatHoaDon)}</td>
                      <td className="text-center">{formatDate(dh.NgayDuyet)}</td>
                      <td className="text-center">{parseInt(dh.TongTien).toLocaleString('vi-VN')} đ</td>
                      <td className="text-center">
                        <span className={`badge ${
                          dh.TrangThai === "Đã Duyệt" ? "bg-success" :
                          dh.TrangThai === "Chờ Duyệt" ? "bg-warning" :
                          dh.TrangThai === "Đã Hủy" ? "bg-danger" :
                          "bg-info"
                        }`}>
                          {dh.TrangThai}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <button className="btn btn-sm btn-info"
                          onClick={()=>handleViewDetails(dh.MaHoaDon)}>Xem</button>
                        </div>
                      </td>
                      <td className="text-center">
                        {dh.TrangThai === "Chờ Duyệt" && (
                          <>
                            <button className="btn btn-sm btn-success m-1"
                              onClick={() => handleAprove(dh.MaHoaDon)}>Duyệt</button>
                            <button className="btn btn-sm btn-danger m-1"
                              onClick={() => handleCancel(dh.MaHoaDon)}>Hủy</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">Không có đơn hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      <XemChiTiet 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        maHoaDon={selectedMaHoaDon}
      />
    </>
  );
};

export default BangHoaDon;