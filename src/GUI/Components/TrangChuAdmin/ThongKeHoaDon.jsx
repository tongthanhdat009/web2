import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ThongKeHoaDon = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('monthly'); // 'daily', 'monthly', 'quarterly', 'yearly'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'pending', 'cancelled'
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Hàm helper để hiển thị text cho timeFrame
  const getTimeFrameText = (frame) => {
    switch(frame) {
      case 'daily': return 'theo ngày';
      case 'monthly': return 'theo tháng';
      case 'quarterly': return 'theo quý';
      case 'yearly': return 'theo năm';
      default: return '';
    }
  };

  // Hàm helper để hiển thị text cho status
  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return '(đã hoàn thành)';
      case 'pending': return '(đang chờ duyệt)';
      case 'cancelled': return '(đã hủy)';
      default: return '';
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [timeFrame, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost/Web2/server/api/TrangChuAdmin/getThongKeHoaDon.php?timeFrame=${timeFrame}&status=${statusFilter}`);
      
      if (response.data.success) {
        const data = response.data.data;
        processChartData(data);
        
        // Tính toán tổng doanh thu và số lượng đơn hàng
        const total = data.reduce((acc, item) => {
          return {
            revenue: acc.revenue + parseFloat(item.TongTien || 0),
            orders: acc.orders + parseInt(item.SoLuongDonHang || 0)
          };
        }, { revenue: 0, orders: 0 });
        
        setTotalRevenue(total.revenue);
        setTotalOrders(total.orders);
      } else {
        setError("Không thể tải dữ liệu thống kê");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Lỗi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    let labels = [];
    let revenueData = [];
    let orderCountData = [];

    // Xử lý dữ liệu theo timeFrame
    switch (timeFrame) {
      case 'daily':
        labels = data.map(item => `${item.Day}/${item.Month}`);
        break;
      case 'monthly':
        labels = data.map(item => `Tháng ${item.Month}/${item.Year}`);
        break;
      case 'quarterly':
        labels = data.map(item => `Q${item.Quarter} ${item.Year}`);
        break;
      case 'yearly':
        labels = data.map(item => `Năm ${item.Year}`);
        break;
      default:
        labels = data.map(item => `Tháng ${item.Month}/${item.Year}`);
    }

    revenueData = data.map(item => parseFloat(item.TongTien || 0));
    orderCountData = data.map(item => parseInt(item.SoLuongDonHang || 0));

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Doanh thu (đơn vị: đồng)',
          data: revenueData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Số lượng đơn hàng',
          data: orderCountData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Thống kê hóa đơn ${getTimeFrameText(timeFrame)} ${getStatusText(statusFilter)}`,
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            if (label.includes('Doanh thu')) {
              return `${label}: ${value.toLocaleString('vi-VN')} đ`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)'
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' đ';
          }
        },
        beginAtZero: true
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Số lượng đơn hàng'
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, // chỉ vẽ lưới cho trục chính
        },
      }
    }
  };

  return (
    <div className="card shadow-sm m-2">
      <div className="card-body">
        <h5 className="card-title text-center mb-4">Thống kê hóa đơn</h5>
        
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card bg-primary text-white mb-3">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Tổng doanh thu</h6>
                    <h3 className="mt-2 mb-0">{totalRevenue.toLocaleString('vi-VN')} đ</h3>
                  </div>
                  <i className="bi bi-currency-dollar fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-success text-white mb-3">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Tổng đơn hàng</h6>
                    <h3 className="mt-2 mb-0">{totalOrders}</h3>
                  </div>
                  <i className="bi bi-receipt fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <label className="form-label">Khung thời gian</label>
            <select 
              className="form-select"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="daily">Theo ngày (30 ngày gần đây)</option>
              <option value="monthly">Theo tháng (12 tháng gần đây)</option>
              <option value="quarterly">Theo quý (4 quý gần đây)</option>
              <option value="yearly">Theo năm (5 năm gần đây)</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Trạng thái đơn hàng</label>
            <select 
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả đơn hàng</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="pending">Đang chờ duyệt</option>
              <option value="cancelled">Đã hủy</option>
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
          <div style={{ height: '400px' }}>
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongKeHoaDon;