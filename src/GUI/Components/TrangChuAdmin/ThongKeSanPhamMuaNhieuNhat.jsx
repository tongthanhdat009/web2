import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
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

const ThongKeSanPhamMuaNhieuNhat = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'
  const [topCount, setTopCount] = useState(5); // Số lượng sản phẩm hiển thị
  const [viewMode, setViewMode] = useState('quantity'); // 'quantity', 'revenue', hoặc 'brand'

  // Lấy text hiển thị cho khoảng thời gian
  const getTimeRangeText = () => {
    switch(timeRange) {
      case 'week': return 'trong tuần qua';
      case 'month': return 'trong tháng qua';
      case 'year': return 'trong năm qua';
      case 'all': return 'từ trước đến nay';
      default: return '';
    }
  };

  // Load dữ liệu khi component được render và khi các filter thay đổi
  useEffect(() => {
    fetchData();
  }, [timeRange, topCount, viewMode]);

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/Web2/server/api/getSPDaBan.php?timeRange=${timeRange}&limit=${topCount}&mode=${viewMode}`
      );
      
      console.log("API response:", response.data); // Debug
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const data = response.data.data;
        if (data.length > 0) {
          processChartData(data);
        } else {
          setError("Không có dữ liệu sản phẩm trong khoảng thời gian này");
          setChartData({
            labels: [],
            datasets: []
          });
        }
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

  // Xử lý dữ liệu cho biểu đồ
  const processChartData = (data) => {
    try {
      let processedData = [...data];
      let limitedData;
      let labels;
      let values;
      let backgroundColors;
      let title;

      if (viewMode === 'brand') {
        // Nhóm dữ liệu theo thương hiệu
        const brandGroups = {};
        
        processedData.forEach(item => {
          const brand = item.TenHang || 'Không xác định';
          
          if (!brandGroups[brand]) {
            brandGroups[brand] = {
              TenHang: brand,
              SoLuong: 0,
              TongDoanhThu: 0
            };
          }
          
          brandGroups[brand].SoLuong += parseInt(item.SoLuong || 0);
          brandGroups[brand].TongDoanhThu += parseFloat(item.TongDoanhThu || 0);
        });
        
        // Chuyển đổi từ object thành mảng
        const brandArray = Object.values(brandGroups);
        
        // Sắp xếp theo số lượng hoặc doanh thu
        brandArray.sort((a, b) => {
          const field = viewMode === 'quantity' || viewMode === 'brand' ? 'SoLuong' : 'TongDoanhThu';
          return b[field] - a[field];
        });
        
        // Giới hạn số lượng hiển thị
        limitedData = brandArray.slice(0, topCount);
        
        // Tạo labels và values
        labels = limitedData.map(item => item.TenHang);
        values = limitedData.map(item => parseInt(item.SoLuong || 0));

        title = `${topCount} thương hiệu bán chạy nhất ${getTimeRangeText()}`;
        
        // Màu cho biểu đồ
        backgroundColors = generateGradientColors(topCount, { r: 255, g: 159, b: 64 });
      } else {
        // Xử lý theo sản phẩm (như trước)
        limitedData = processedData.slice(0, topCount);
        
        labels = limitedData.map(item => truncateLabel(item.TenHangHoa));
        
        values = limitedData.map(item => 
          viewMode === 'quantity' ? 
            parseInt(item.SoLuong || 0) : 
            parseFloat(item.TongDoanhThu || 0)
        );
        
        title = `${topCount} sản phẩm ${viewMode === 'quantity' ? 'bán chạy' : 'doanh thu cao'} nhất ${getTimeRangeText()}`;
        
        // Màu cho biểu đồ
        backgroundColors = generateGradientColors(topCount, viewMode === 'quantity' ? 
          { r: 54, g: 162, b: 235 } : 
          { r: 75, g: 192, b: 192 }
        );
      }
      
      // Thiết lập dữ liệu biểu đồ
      setChartData({
        labels: labels,
        datasets: [
          {
            label: viewMode === 'brand' ? 'Số lượng bán ra theo hãng' : 
                   viewMode === 'quantity' ? 'Số lượng bán ra' : 'Doanh thu',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
          }
        ]
      });

      // Cập nhật title cho options
      options.plugins.title.text = title;

    } catch (e) {
      console.error("Error processing chart data:", e);
      setError("Lỗi xử lý dữ liệu biểu đồ");
    }
  };

  // Rút gọn tên sản phẩm nếu quá dài
  const truncateLabel = (label) => {
    if (!label) return 'Không rõ';
    return label.length > 20 ? `${label.substring(0, 20)}...` : label;
  };

  // Tạo màu gradient đẹp cho biểu đồ
  const generateGradientColors = (count, baseColor) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const opacity = 0.9 - (i * 0.5 / count); // Giảm độ mờ theo thứ tự
      colors.push(`rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity > 0.3 ? opacity : 0.3})`);
    }
    return colors;
  };

  // Tùy chọn cho biểu đồ
  const options = {
    indexAxis: 'y', // Biểu đồ ngang
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${topCount} ${viewMode === 'brand' ? 'thương hiệu' : 'sản phẩm'} ${
          viewMode === 'quantity' || viewMode === 'brand' ? 'bán chạy' : 'doanh thu cao'
        } nhất ${getTimeRangeText()}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            if (viewMode === 'quantity' || viewMode === 'brand') {
              return `Số lượng: ${value} sản phẩm`;
            } else {
              return `Doanh thu: ${value.toLocaleString('vi-VN')} đ`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (viewMode === 'quantity' || viewMode === 'brand') {
              return value;
            } else {
              return value >= 1000000 
                ? (value / 1000000).toFixed(1) + 'M' 
                : value >= 1000 
                  ? (value / 1000).toFixed(0) + 'K' 
                  : value;
            }
          }
        }
      }
    }
  };

  return (
    <div className="card shadow-sm h-100 w-50 m-2">
      <div className="card-body">
        <h5 className="card-title text-center mb-3">Sản phẩm bán chạy nhất</h5>
        
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="btn-group mb-2 me-2" role="group">
            <button 
              type="button" 
              className={`btn btn-sm ${viewMode === 'quantity' ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{fontSize: "13px"}}
              onClick={() => setViewMode('quantity')}
            >
              Theo số lượng
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${viewMode === 'revenue' ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{fontSize: "13px"}}
              onClick={() => setViewMode('revenue')}
            >
              Theo doanh thu
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${viewMode === 'brand' ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{fontSize: "13px"}}
              onClick={() => setViewMode('brand')}
            >
              Theo hãng
            </button>
          </div>
          
          <div className="d-flex mb-2">
            <select 
              className="form-select form-select-sm me-2"
              style={{width: "auto"}}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
              <option value="all">Tất cả thời gian</option>
            </select>
            
            <select 
              className="form-select form-select-sm"
              style={{width: "auto"}}
              value={topCount}
              onChange={(e) => setTopCount(Number(e.target.value))}
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="15">Top 15</option>
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
          <div style={{ height: '350px' }}>
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongKeSanPhamMuaNhieuNhat;