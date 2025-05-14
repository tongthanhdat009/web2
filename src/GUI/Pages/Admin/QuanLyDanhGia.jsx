import React, { useState, useEffect, useMemo } from 'react';
import { getAllDanhGia, xoaDanhGiaAPI, duyetDanhGiaAPI } from "../../../DAL/apiQuanLyDanhGia"; 
import './css/QuanLyDanhGia.css'; // Import file CSS

// Nhận props Xoa và Sua
const QuanLyDanhGia = ({ Xoa, Sua }) => { 
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('TaiKhoan'); 
    const [statusFilter, setStatusFilter] = useState('Tất cả'); 
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Hàm fetch dữ liệu ban đầu
    const fetchReviews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getAllDanhGia();
            if (response.success && Array.isArray(response.data)) {
                setReviews(response.data);
            } else {
                const errorMessage = response.error || response.message || "Không thể tải danh sách đánh giá.";
                setError(errorMessage);
                setReviews([]);
            }
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Hàm xử lý duyệt đánh giá
    const handleDuyet = async (idDanhGia) => {
        setNotification({ message: '', type: '' });
        const originalReviews = [...reviews];

        setReviews(prevReviews => 
            prevReviews.map(review => 
                review.IDDanhGia === idDanhGia ? { ...review, TrangThai: 'Đã duyệt' } : review
            )
        );

        try {
            const response = await duyetDanhGiaAPI(idDanhGia);
            if (response.success) {
                setNotification({ message: response.message || `Đánh giá ID ${idDanhGia} đã được duyệt.`, type: 'success' });
            } else {
                setReviews(originalReviews); 
                setNotification({ message: response.error || `Lỗi khi duyệt đánh giá ID ${idDanhGia}.`, type: 'error' });
            }
        } catch (err) {
            setReviews(originalReviews); 
            setNotification({ message: err.message || "Lỗi kết nối khi duyệt đánh giá.", type: 'error' });
        }
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    // Hàm xử lý xóa đánh giá
    const handleXoa = async (idDanhGia) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa đánh giá ID ${idDanhGia}?`)) {
            return;
        }
        setNotification({ message: '', type: '' });
        const originalReviews = [...reviews];

        setReviews(prevReviews => prevReviews.filter(review => review.IDDanhGia !== idDanhGia));

        try {
            const response = await xoaDanhGiaAPI(idDanhGia);
            if (response.success) {
                setNotification({ message: response.message || `Đánh giá ID ${idDanhGia} đã được xóa.`, type: 'success' });
            } else {
                setReviews(originalReviews); 
                setNotification({ message: response.error || `Lỗi khi xóa đánh giá ID ${idDanhGia}.`, type: 'error' });
            }
        } catch (err) {
            setReviews(originalReviews); 
            setNotification({ message: err.message || "Lỗi kết nối khi xóa đánh giá.", type: 'error' });
        }
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };


    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            if (statusFilter !== 'Tất cả' && review.TrangThai !== statusFilter) {
                return false;
            }
            if (searchTerm.trim() === '') {
                return true;
            }
            const term = searchTerm.toLowerCase();
            switch (searchField) {
                case 'TaiKhoan':
                    return review.TaiKhoan && review.TaiKhoan.toLowerCase().includes(term);
                case 'TenHangHoa':
                    return review.TenHangHoa && review.TenHangHoa.toLowerCase().includes(term);
                default:
                    return true;
            }
        });
    }, [reviews, searchTerm, searchField, statusFilter]);

    const getImagePath = (anh) => {
        if (!anh) return "/placeholder.png"; 
        if (anh.startsWith('../')) { 
            return anh.substring(2); 
        }
        return anh; 
    }

    if (isLoading) {
        return <p className="qldg-loading-message">Đang tải dữ liệu đánh giá...</p>;
    }

    if (error) {
        return <p className="qldg-error-message">Lỗi: {error}</p>;
    }

    return (
        <div className="qldg-container">
            <h1 className="qldg-header">Quản Lý Đánh Giá</h1>

            {notification.message && (
                <div className={`qldg-notification ${notification.type === 'success' ? 'qldg-notification-success' : 'qldg-notification-error'}`}>
                    {notification.message}
                </div>
            )}

            <div className="qldg-filters">
                <input 
                    type="text"
                    placeholder="Nhập từ khóa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="qldg-input"
                />
                <select 
                    value={searchField} 
                    onChange={(e) => setSearchField(e.target.value)}
                    className="qldg-select"
                >
                    <option value="TaiKhoan">Tên Tài Khoản</option>
                    <option value="TenHangHoa">Tên Sản Phẩm</option>
                </select>
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="qldg-select"
                >
                    <option value="Tất cả">Tất cả trạng thái</option>
                    <option value="Chưa duyệt">Chưa duyệt</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Từ chối">Từ chối</option> 
                </select>
            </div>
            <div className="qldg-table-wrapper">
                {filteredReviews.length === 0 ? (
                    <p className="qldg-no-data-message">Không tìm thấy đánh giá nào phù hợp.</p>
                ) : (
                    <table className="qldg-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Sản Phẩm</th>
                                <th>Ảnh</th>
                                <th>Tài Khoản</th>
                                <th>Số Sao</th>
                                <th className="qldg-comment-cell">Bình Luận</th>
                                <th>Thời Gian</th>
                                <th>Trạng Thái</th>
                                <th className="qldg-actions">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map((review) => (
                                <tr key={review.IDDanhGia}>
                                    <td>{review.IDDanhGia}</td>
                                    <td>{review.TenHangHoa || 'N/A'}</td>
                                    <td>
                                        {review.Anh ? (
                                            <img 
                                                src={getImagePath(review.Anh)} 
                                                alt={review.TenHangHoa || 'Ảnh sản phẩm'} 
                                                className="qldg-product-image"
                                            />
                                        ) : 'Không có ảnh'}
                                    </td>
                                    <td>{review.TaiKhoan || 'N/A'}</td>
                                    <td>{review.SoSao}</td>
                                    <td className="qldg-comment-cell">{review.BinhLuan}</td>
                                    <td>{review.ThoiGian}</td>
                                    <td>{review.TrangThai}</td>
                                    <td className="qldg-actions">
                                        {/* Hiển thị nút Duyệt nếu Sua=1 và trạng thái là 'Chưa duyệt' */}
                                        {Sua === 1 && review.TrangThai === 'Chưa duyệt' && (
                                            <button 
                                                onClick={() => handleDuyet(review.IDDanhGia)}
                                                className="qldg-button-duyet"
                                            >
                                                Duyệt
                                            </button>
                                        )}
                                        {/* Hiển thị nút Xóa nếu Xoa=1 */}
                                        {Xoa === 1 && (
                                            <button 
                                                onClick={() => handleXoa(review.IDDanhGia)}
                                                className="qldg-button-xoa"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default QuanLyDanhGia;