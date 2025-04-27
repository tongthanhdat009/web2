import React from 'react';
import '../Components/css/SanPhamCardLayout.css'; // Import file CSS mới

// Thay đổi props: nhận GiaGoc và PhanTramKM (phần trăm khuyến mãi)
function SanPhamCardLayout({MaHangHoa, Anh, TenHangHoa, GiaGoc, PhanTramKM = 0, MoTa }) { // Đặt giá trị mặc định cho PhanTramKM là 0

    // Kiểm tra tính hợp lệ của props
    const isValidGiaGoc = typeof GiaGoc === 'number' && GiaGoc > 0;
    const isValidPhanTramKM = typeof PhanTramKM === 'number' && PhanTramKM >= 0 && PhanTramKM <= 100;

    // Tính toán Giá Bán dựa trên Giá Gốc và Phần Trăm Khuyến Mãi
    const GiaBan = isValidGiaGoc && isValidPhanTramKM
        ? Math.round(GiaGoc * (1 - PhanTramKM / 100))
        : GiaGoc; // Nếu thông tin không hợp lệ, GiaBan bằng GiaGoc hoặc có thể xử lý khác

    // Xác định có giảm giá hay không
    const coGiamGia = isValidGiaGoc && isValidPhanTramKM && PhanTramKM > 0;

    // Hàm định dạng tiền tệ
    const formatCurrency = (value) => {
        if (typeof value !== 'number') return 'Liên hệ';
        return value.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <div className="card product-card h-100 shadow-sm border-1 m-2" style={{ width: 'fit-content' }}>
            <a href={`/chi-tiet-san-pham/${MaHangHoa}`} className="text-decoration-none text-dark">
                <img
                    src={Anh || '/path/to/placeholder-image.png'}
                    className="card-img-top product-card-img p-0"
                    alt={TenHangHoa || "Sản phẩm"}
                    />
                {/* Badge giảm giá (nếu có) */}
                {coGiamGia && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                        -{PhanTramKM}% 
                    </span>
                )}
                <div className="card-body d-flex flex-column"> 
                    <h5 className="card-title fs-6 fw-bold mb-1">{TenHangHoa}</h5>
                    <p className="card-text text-muted small mb-2 flex-grow-1">{MoTa}</p> 

                    {/* Phần giá bán và giá gốc (nếu có giảm giá) */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div> {/* Bọc giá trong div để kiểm soát layout */}
                            {/* Hiển thị Giá Bán đã tính toán */}
                            <span className="card-text fw-bold text-danger me-2">{formatCurrency(GiaBan)}</span>
                            {/* Hiển thị Giá Gốc nếu có giảm giá */}
                            {coGiamGia && isValidGiaGoc && (
                                <span className="text-muted text-decoration-line-through small">
                                    {formatCurrency(GiaGoc)}
                                </span>
                            )}
                        </div>
                    </div>

                    <a href={`/chi-tiet-san-pham/${MaHangHoa}`} className="btn btn-sm btn-outline-primary w-100 stretched-link">Xem chi tiết</a>
                </div>
            </a>
        </div>
    );
}

export default SanPhamCardLayout;