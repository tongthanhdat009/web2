import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
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

const ThongKeHangDaNhap = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayMode, setDisplayMode] = useState('quantity'); // 'quantity' hoặc 'value'
  const [displayLimit, setDisplayLimit] = useState(5); // Số lượng hiển thị
  const [groupBy, setGroupBy] = useState('product'); // 'product' hoặc 'brand'

  useEffect(() => {
    fetchData();
  }, [displayMode, displayLimit, groupBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost/Web2/server/api/getSanPhamNhap.php?mode=${displayMode}&limit=${displayLimit}`);
      
      if (response.data.success) {
        const data = response.data.data;
        processChartData(data);
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
    if (!data || data.length === 0) {
      setError("Không có dữ liệu");
      return;
    }

    let processedData = [...data];
    
    // Xử lý dữ liệu theo groupBy
    if (groupBy === 'brand') {
      // Nhóm theo thương hiệu
      const brandGroups = {};
      
      data.forEach(item => {
        const brand = item.TenHang || 'Không xác định';
        
        if (!brandGroups[brand]) {
          brandGroups[brand] = {
            TenSanPham: brand,
            SoLuong: 0,
            TongGiaTri: 0
          };
        }
        
        brandGroups[brand].SoLuong += parseInt(item.SoLuong || 0);
        brandGroups[brand].TongGiaTri += parseInt(item.TongGiaTri || 0);
      });
      
      // Chuyển đổi object thành mảng
      processedData = Object.values(brandGroups);
      
      // Sắp xếp theo mode hiển thị
      processedData.sort((a, b) => {
        const field = displayMode === 'quantity' ? 'SoLuong' : 'TongGiaTri';
        return b[field] - a[field];
      });
    }

    // Nếu có nhiều hơn giới hạn hiển thị, gộp các mục còn lại vào "Khác"
    if (displayLimit > 0 && processedData.length > displayLimit) {
      const topItems = processedData.slice(0, displayLimit);
      const otherItems = processedData.slice(displayLimit);
      
      const fieldName = displayMode === 'quantity' ? 'SoLuong' : 'TongGiaTri';
      const otherSum = otherItems.reduce((sum, item) => sum + parseInt(item[fieldName] || 0), 0);
      
      topItems.push({
        TenSanPham: 'Khác',
        [fieldName]: otherSum,
        TenHang: ''
      });
      
      processedData = topItems;
    }
    
    // Tạo labels phù hợp với mode hiển thị
    const labels = processedData.map(item => {
      if (item.TenSanPham === 'Khác') return 'Khác';
      
      return groupBy === 'product' 
        ? `${item.TenSanPham} (${item.TenHang || 'N/A'})` 
        : item.TenSanPham;
    });
    
    const values = processedData.map(item => 
      displayMode === 'quantity' ? parseInt(item.SoLuong || 0) : parseInt(item.TongGiaTri || 0)
    );
    
    // Tạo mảng màu sắc đẹp mắt
    const backgroundColors = generateColors(processedData.length, 0.7);
    const borderColors = generateColors(processedData.length, 1);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: displayMode === 'quantity' ? 'Số lượng sản phẩm' : 'Giá trị sản phẩm',
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        }
      ]
    });
  };

  // Hàm tạo màu ngẫu nhiên nhưng thống nhất
  const generateColors = (count, opacity) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.5) % 360; // Đảm bảo màu đa dạng
      colors.push(`hsla(${hue}, 70%, 60%, ${opacity})`);
    }
    return colors;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: displayMode === 'quantity' 
          ? `Tỷ lệ số lượng ${groupBy === 'brand' ? 'thương hiệu' : 'sản phẩm'} đã nhập`
          : `Tỷ lệ giá trị ${groupBy === 'brand' ? 'thương hiệu' : 'sản phẩm'} đã nhập`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            
            if (displayMode === 'quantity') {
              return `${label}: ${value} sản phẩm (${percentage}%)`;
            } else {
              return `${label}: ${value.toLocaleString('vi-VN')} đ (${percentage}%)`;
            }
          }
        }
      }
    }
  };

  return (
    <div className="card shadow-sm h-100 w-50 m-2">
      <div className="card-body">
        <h5 className="card-title text-center mb-3">Thống kê hãng đã nhập</h5>
        
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="btn-group mb-2 me-2" role="group">
            <button 
              type="button" 
              className={`btn btn-sm ${groupBy === 'product' ? 'btn-success' : 'btn-outline-success'}`}
              style={{fontSize: "16px"}}
              onClick={() => setGroupBy('product')}
            >
              Theo sản phẩm
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${groupBy === 'brand' ? 'btn-success' : 'btn-outline-success'}`}
              style={{fontSize: "16px"}}
              onClick={() => setGroupBy('brand')}
            >
              Theo thương hiệu
            </button>
          </div>
          
          <select 
            className="form-select form-select-sm mb-2" 
            style={{width: "auto"}}
            value={displayLimit}
            onChange={(e) => setDisplayLimit(Number(e.target.value))}
          >
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
            <option value="15">Top 15</option>
            <option value="0">Tất cả</option>
          </select>
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
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <Pie data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongKeHangDaNhap;