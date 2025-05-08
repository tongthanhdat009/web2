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
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  // Thêm các biến giới hạn ngày
  const today = new Date().toISOString().split('T')[0]; // Định dạng YYYY-MM-DD của ngày hiện tại
  const minDate = "2025-01-01"; // Giới hạn min date là ngày 01/01/2025  
  
  useEffect(() => {
    const fetchDonHang = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost/Web2/server/api/QuanLyHoaDon/getHoaDon.php");
        
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

  // Populate location filter options
  useEffect(() => {
    if (donHang.length > 0) {
      const uniqueCities = new Set();
      const uniqueDistricts = new Set();
      const uniqueWards = new Set();

      donHang.forEach(dh => {
        const { ward, district, city } = extractLocationParts(dh.DiaChi);
        if (city && city.trim() !== "") uniqueCities.add(city.trim());
        if (district && district.trim() !== "") uniqueDistricts.add(district.trim());
        if (ward && ward.trim() !== "") uniqueWards.add(ward.trim());
      });

      setCityOptions(Array.from(uniqueCities).sort());
      setDistrictOptions(Array.from(uniqueDistricts).sort());
      setWardOptions(Array.from(uniqueWards).sort());
    }
  }, [donHang]);

  const extractLocationParts = (diaChi) => {
    const defaultParts = { ward: null, district: null, city: null };
    if (!diaChi || typeof diaChi !== 'string') return defaultParts;

    const components = diaChi.split('$$');
    let ward = null, district = null, city = null;

    if (components.length > 0) {
        const firstPart = components[1].trim();
        const lastCommaIdx = firstPart.lastIndexOf(',');
        if (lastCommaIdx !== -1) {
            ward = firstPart.substring(lastCommaIdx + 1).trim();
        } else {
            ward = firstPart; // Assumes if no comma, the first part is the ward or street part to filter on
        }
    }
    if (components.length > 1) {
        district = components[2].trim();
    }
    if (components.length > 2) {
        city = components[3].trim();
    }
    return { ward, district, city };
  };

  const filteredDonHang = donHang.filter(dh => {
    const matchesSearch = 
      searchTerm === "" || 
      dh.MaHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dh.IDTaiKhoan.toLowerCase().includes(searchTerm.toLowerCase())||
      dh.DiaChi.toLowerCase().includes(searchTerm.toLowerCase());
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

    // Filter by location
    const { ward: orderWard, district: orderDistrict, city: orderCity } = extractLocationParts(dh.DiaChi);
    const matchesCity = selectedCity === "" || (orderCity && orderCity === selectedCity);
    const matchesDistrict = selectedDistrict === "" || (orderDistrict && orderDistrict === selectedDistrict);
    const matchesWard = selectedWard === "" || (orderWard && orderWard === selectedWard);
    
    return matchesSearch && matchesStatus && matchesDateRange && matchesCity && matchesDistrict && matchesWard;
  });

  

  const handleAddress = (dh) => {
    return dh.DiaChi.replace(/\$\$/g, ", ");
  }

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
        
        const responseUpdateKhoHang = await axios.get(`http://localhost/Web2/server/api/QuanLyHoaDon/updateKhoHang.php?maHoaDon=${id}&trangThai=Duyet`, {
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
        const responseUpdateKhoHang = await axios.get(`http://localhost/Web2/server/api/QuanLyHoaDon/updateKhoHang.php?maHoaDon=${id}&trangThai=Huy`, {
          maHoaDon: id,
        });
        
        if (responseUpdateKhoHang.data.success) {
          // Thay thế alert bằng notification
          setNotification({
            message: "Đã hủy đơn hàng thành công!",
            type: 'success'
          });
        }
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
                <option value="Đã Duyệt">Đã duyệt</option>
                <option value="Chờ Duyệt">Chờ duyệt</option>
                <option value="Đã Hủy">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
          {/* Location Filters */}
        <div className="row mb-3 mt-3">
          <div className="col-md-4">
            <label className="form-label mb-1">Thành phố/Tỉnh:</label>
            <select 
              className="form-select" 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Tất cả Thành phố/Tỉnh</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label mb-1">Quận/Huyện:</label>
            <select 
              className="form-select" 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">Tất cả Quận/Huyện</option>
              {districtOptions.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label mb-1">Phường/Xã:</label>
            <select 
              className="form-select" 
              value={selectedWard} 
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              <option value="">Tất cả Phường/Xã</option>
              {wardOptions.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
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
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Địa chỉ</th>
                  <th scope="col" style={{ fontSize: "16px", backgroundColor: "#d2a679", color: "black" }}>Hình thức thanh toán</th>
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
                      <td className="text-center">{handleAddress(dh)}</td>
                      <td className="text-center">{dh.HinhThucThanhToan}</td>
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