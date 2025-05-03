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
  Legend,
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

const ThongKePhieuNhap = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('monthly'); // 'monthly', 'quarterly', 'yearly'

  useEffect(() => {
    fetchData();
  }, [timeFrame]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost/Web2/server/api/TrangChuAdmin/getPhieuNhap.php?timeFrame=${timeFrame}`);
      
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
    let labels = [];
    let values = [];

    // Xử lý dữ liệu dựa trên timeFrame
    if (timeFrame === 'monthly') {
      // Theo tháng: 12 tháng gần đây
      data.forEach(item => {
        labels.push(`Tháng ${item.month}/${item.year}`);
        values.push(item.totalValue);
      });
    } else if (timeFrame === 'quarterly') {
      // Theo quý: 4 quý gần đây
      data.forEach(item => {
        labels.push(`Q${item.quarter} ${item.year}`);
        values.push(item.totalValue);
      });
    } else {
      // Theo năm: 5 năm gần đây
      data.forEach(item => {
        labels.push(`Năm ${item.year}`);
        values.push(item.totalValue);
      });
    }

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Tổng giá trị phiếu nhập',
          data: values,
          backgroundColor: 'rgba(210, 166, 121, 0.7)',
          borderColor: '#d2a679',
          borderWidth: 1,
        }
      ]
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê giá trị phiếu nhập',
        font: {
          size: 18,
          weight: 'bold'
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Tổng giá trị: ${context.parsed.y.toLocaleString('vi-VN')} đ`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' đ';
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        console.log("Clicked on:", chartData.labels[index], "Value:", chartData.datasets[0].data[index]);
        // Có thể thêm hành động khi click vào cột biểu đồ
      }
    }
  };

  return (
    <div className="card shadow-sm m-2">
      <div className="card-body">
        <h5 className="card-title text-center mb-4">Thống kê giá trị phiếu nhập</h5>
        
        <div className="mb-4">
          <div className="btn-group" role="group" aria-label="Chọn khung thời gian">
            <button 
              type="button" 
              className={`btn ${timeFrame === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTimeFrame('monthly')}
            >
              Theo tháng
            </button>
            <button 
              type="button" 
              className={`btn ${timeFrame === 'quarterly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTimeFrame('quarterly')}
            >
              Theo quý
            </button>
            <button 
              type="button" 
              className={`btn ${timeFrame === 'yearly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTimeFrame('yearly')}
            >
              Theo năm
            </button>
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
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px', width: '100%' }}>
                <div style={{ width: '80%', maxWidth: '800px' }}>
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ThongKePhieuNhap;