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

const ThongKeNguoiDung = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewType, setViewType] = useState('count'); // 'count' hoặc 'value'
    const [timeRange, setTimeRange] = useState('all'); // 'month', 'quarter', 'year', 'all'
    const [topCount, setTopCount] = useState(5); // Số lượng người dùng hiển thị

    // Load dữ liệu khi component được render và khi các filter thay đổi
    useEffect(() => {
        fetchData();
    }, [viewType, timeRange, topCount]);

    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost/Web2/server/api/getThongKeNguoiDung.php?timeRange=${timeRange}&limit=${topCount}&viewType=${viewType}`
            );
            
            console.log("API response:", response.data); // Debug
            
            if (response.data.success && Array.isArray(response.data.data)) {
                const data = response.data.data;
                if (data.length > 0) {
                    processChartData(data);
                } else {
                    setError("Không có dữ liệu người dùng trong khoảng thời gian này");
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
            // Cắt dữ liệu theo số lượng yêu cầu
            const limitedData = data.slice(0, topCount);
            
            // Tạo labels và data cho biểu đồ
            const labels = limitedData.map(item => 
                `${item.HoTen || 'Không rõ'} (${item.Email || 'N/A'})`
            );
            
            const values = limitedData.map(item => 
                viewType === 'count' ? 
                    parseInt(item.SoLuongDonHang || 0) : 
                    parseFloat(item.TongTien || 0)
            );
            
            // Màu cho biểu đồ
            const backgroundColors = generateGradientColors(topCount, viewType === 'count' ? 
                { r: 75, g: 192, b: 192 } : 
                { r: 153, g: 102, b: 255 }
            );
            
            // Thiết lập dữ liệu biểu đồ
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: viewType === 'count' ? 'Số đơn hàng' : 'Tổng giá trị (đồng)',
                        data: values,
                        backgroundColor: backgroundColors,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                    }
                ]
            });
        } catch (e) {
            console.error("Error processing chart data:", e);
            setError("Lỗi xử lý dữ liệu biểu đồ");
        }
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

    // Lấy text hiển thị cho khoảng thời gian
    const getTimeRangeText = () => {
        switch(timeRange) {
            case 'month': return 'trong tháng qua';
            case 'quarter': return 'trong quý này';
            case 'year': return 'trong năm qua';
            case 'all': return 'từ trước đến nay';
            default: return '';
        }
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
                text: `${topCount} khách hàng ${viewType === 'count' ? 'mua nhiều đơn' : 'chi tiêu nhiều'} nhất ${getTimeRangeText()}`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        if (viewType === 'count') {
                            return `Số đơn hàng: ${value}`;
                        } else {
                            return `Giá trị: ${value.toLocaleString('vi-VN')} đ`;
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
                        if (viewType === 'count') {
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
        <div className="card shadow-sm h-100 m-2">
            <div className="card-body">
                <h5 className="card-title text-center mb-3">Top khách hàng mua nhiều nhất</h5>
                
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <div className="btn-group mb-2 me-2" role="group">
                        <button 
                            type="button" 
                            className={`btn btn-sm ${viewType === 'count' ? 'btn-primary' : 'btn-outline-primary'}`}
                            style={{fontSize: "13px"}}
                            onClick={() => setViewType('count')}
                        >
                            Theo số đơn
                        </button>
                        <button 
                            type="button" 
                            className={`btn btn-sm ${viewType === 'value' ? 'btn-primary' : 'btn-outline-primary'}`}
                            style={{fontSize: "13px"}}
                            onClick={() => setViewType('value')}
                        >
                            Theo giá trị
                        </button>
                    </div>
                    
                    <div className="d-flex mb-2">
                        <select 
                            className="form-select form-select-sm me-2"
                            style={{width: "auto"}}
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="month">Tháng này</option>
                            <option value="quarter">Quý này</option>
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

export default ThongKeNguoiDung;