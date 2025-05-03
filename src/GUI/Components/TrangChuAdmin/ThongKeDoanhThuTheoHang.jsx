import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const ThongKeDoanhThuTheoHang = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Load dữ liệu khi component được render và khi timeRange thay đổi
  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // Hàm lấy text hiển thị cho timeRange
  const getTimeRangeText = () => {
    switch(timeRange) {
      case 'week': return 'trong tuần qua';
      case 'month': return 'trong tháng qua';
      case 'year': return 'trong năm qua';
      case 'all': return 'tất cả thời gian';
      default: return '';
    }
  };

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/Web2/server/api/TrangChuAdmin/getThongKeHang.php?timeRange=${timeRange}`
      );
      
      console.log("API response:", response.data); // Debug
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const data = response.data.data;
        if (data.length > 0) {
          processChartData(data);
        } else {
          setError("Không có dữ liệu doanh thu trong khoảng thời gian này");
          setChartData({
            labels: [],
            datasets: []
          });
          setTotalRevenue(0);
        }
      } else {
        setError("Không thể tải dữ liệu thống kê");
        setTotalRevenue(0);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Lỗi kết nối đến máy chủ");
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý dữ liệu cho biểu đồ
  const processChartData = (data) => {
    try {
      // Sắp xếp dữ liệu theo doanh thu từ cao đến thấp
      const sortedData = [...data].sort((a, b) => parseFloat(b.TongDoanhThu) - parseFloat(a.TongDoanhThu));
      
      // Lấy 6 hãng có doanh thu cao nhất
      const topBrands = sortedData.slice(0, 6);
      
      // Tính tổng doanh thu của các hãng còn lại
      const otherBrands = sortedData.slice(6);
      const otherBrandsRevenue = otherBrands.reduce((sum, item) => sum + parseFloat(item.TongDoanhThu || 0), 0);
      
      // Tạo dữ liệu cho biểu đồ
      const labels = topBrands.map(item => item.TenHang);
      const values = topBrands.map(item => parseFloat(item.TongDoanhThu || 0));
      
      // Thêm hạng mục "Khác" nếu có dữ liệu
      if (otherBrands.length > 0) {
        labels.push("Khác");
        values.push(otherBrandsRevenue);
      }
      
      // Tính tổng doanh thu
      const total = values.reduce((sum, value) => sum + value, 0);
      setTotalRevenue(total);
      
      // Tạo màu cho biểu đồ
      const backgroundColors = [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(201, 203, 207, 0.8)'  // Màu cho "Khác"
      ];
      
      // Thiết lập dữ liệu biểu đồ
      setChartData({
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
            borderWidth: 1,
          }
        ]
      });
    } catch (e) {
      console.error("Error processing chart data:", e);
      setError("Lỗi xử lý dữ liệu biểu đồ");
    }
  };

  // Tùy chọn cho biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: `Tỷ lệ doanh thu theo hãng ${getTimeRangeText()}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value.toLocaleString('vi-VN')} đ (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="card shadow-sm h-100 w-50 m-2">
      <div className="card-body">
        <h5 className="card-title text-center mb-3">Doanh thu theo hãng</h5>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="card bg-primary text-white mb-2" style={{ minWidth: '200px' }}>
            <div className="card-body p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Tổng doanh thu</h6>
                  <h5 className="mt-1 mb-0">{totalRevenue.toLocaleString('vi-VN')} đ</h5>
                </div>
                <i className="bi bi-cash-stack fs-3 opacity-50"></i>
              </div>
            </div>
          </div>
          
          <div>
            <select 
              className="form-select form-select-sm"
              style={{width: "auto"}}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
              <option value="all">Tất cả thời gian</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <div style={{ height: '300px' }}>
            <Doughnut data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongKeDoanhThuTheoHang;