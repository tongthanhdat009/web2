import { getQuyen, addQuyen, deleteQuyen} from "../../../DAL/apiQuanLyQuyen.jsx"; 
import React, { useState, useEffect } from 'react';
import './css/QuanLyQuyen.css'; // Đảm bảo đường dẫn đúng

const QuanLyQuyen = ({Them, Xoa, Sua}) => { // Giả sử có props quyền, nếu không dùng có thể bỏ
    const [quyens, setQuyens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newQuyenName, setNewQuyenName] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchQuyens = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getQuyen();
            if (response.success && Array.isArray(response.data)) {
                setQuyens(response.data);
            } else {
                setError(response.error || response.message || "Không thể tải danh sách quyền.");
                setQuyens([]);
            }
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu quyền.");
            setQuyens([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuyens();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    const handleAddQuyen = async (e) => {
        e.preventDefault();
        if (!newQuyenName.trim()) {
            showNotification("Tên quyền không được để trống.", "error");
            return;
        }
        setIsLoading(true); // Có thể thêm loading cho nút thêm
        try {
            const response = await addQuyen(newQuyenName.trim());
            if (response.success) {
                showNotification(response.message || "Thêm quyền thành công!");
                setNewQuyenName(''); // Xóa input
                // Thêm quyền mới vào danh sách hiện tại hoặc fetch lại
                // Cách 1: Thêm vào state (optimistic hoặc dựa trên response)
                if (response.quyen) {
                     setQuyens(prevQuyens => [...prevQuyens, response.quyen]);
                } else {
                    fetchQuyens(); // Fallback nếu không có data quyền mới
                }
            } else {
                showNotification(response.error || "Lỗi khi thêm quyền.", "error");
            }
        } catch (err) {
            showNotification(err.message || "Lỗi kết nối khi thêm quyền.", "error");
        } finally {
            setIsLoading(false); // Kết thúc loading cho nút thêm
        }
    };

    const handleDeleteQuyen = async (idQuyen, tenQuyen) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa quyền "${tenQuyen}" (ID: ${idQuyen})?`)) {
            return;
        }
        try {
            const response = await deleteQuyen(idQuyen);
            if (response.success) {
                showNotification(response.message || `Quyền ID ${idQuyen} đã được xóa.`);
                setQuyens(prevQuyens => prevQuyens.filter(q => q.IDQuyen !== idQuyen));
            } else {
                showNotification(response.error || `Lỗi khi xóa quyền ID ${idQuyen}.`, "error");
            }
        } catch (err) {
            showNotification(err.message || "Lỗi kết nối khi xóa quyền.", "error");
        }
    };

    return (
        <div className="qlq-container">
            {notification.message && (
                <div className={`qlq-notification qlq-notification-${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {/* Giả sử prop Them = 1 thì cho phép thêm */}
            {(Them === 1 || Them === undefined) && (
                <form onSubmit={handleAddQuyen} className="qlq-add-form">
                    <input
                        type="text"
                        className="qlq-input"
                        value={newQuyenName}
                        onChange={(e) => setNewQuyenName(e.target.value)}
                        placeholder="Nhập tên quyền mới"
                    />
                    <button type="submit" className="qlq-button">
                        Thêm Quyền
                    </button>
                </form>
            )}


            {isLoading && !quyens.length && <p className="qlq-loading-message">Đang tải danh sách quyền...</p>}
            {error && <p className="qlq-error-message">Lỗi: {error}</p>}
            
            {!isLoading && !error && quyens.length === 0 && (
                <p className="qlq-no-data-message">Không có quyền nào trong hệ thống.</p>
            )}

            {quyens.length > 0 && (
                <div className="qlq-table-wrapper">
                    <table className="qlq-table">
                        <thead>
                            <tr>
                                <th>ID Quyền</th>
                                <th>Tên Quyền</th>
                                {/* Giả sử prop Xoa = 1 thì cho phép xóa */}
                                {(Xoa === 1 || Xoa === undefined) && <th className="qlq-actions">Hành Động</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {quyens.map((quyen) => (
                                <tr key={quyen.IDQuyen}>
                                    <td>{quyen.IDQuyen}</td>
                                    <td>{quyen.TenQuyen}</td>
                                    {(Xoa === 1 || Xoa === undefined) && (
                                        <td className="qlq-actions">
                                            <button
                                                onClick={() => handleDeleteQuyen(quyen.IDQuyen, quyen.TenQuyen)}
                                                className="qlq-button-delete"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QuanLyQuyen;