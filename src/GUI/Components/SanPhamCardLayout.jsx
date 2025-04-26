import React from 'react';
import '../Components/css/SanPhamCardLayout.css'; // Import file CSS mới

function SanPhamCardLayout({ Anh, TenHangHoa, GiaBan, MoTa, DanhGia = "4.5/5" }) { // Thêm prop DanhGia với giá trị mặc định
    return (
        // Thêm class 'product-card' để áp dụng CSS và 'h-100' để các card trong cùng hàng cao bằng nhau
        <div className="card product-card h-100 shadow-sm border-0 m-2">
            {/* Đặt ảnh trực tiếp trong card với class card-img-top */}
            <img
                src={Anh || '/path/to/placeholder-image.png'} // Thêm ảnh placeholder nếu props.Anh không có
                className="card-img-top product-card-img" // Class riêng cho ảnh để style trong CSS
                alt={TenHangHoa || "Sản phẩm"}
            />
            <div className="card-body d-flex flex-column"> {/* flex-column để đẩy footer xuống dưới */}
                <h5 className="card-title fs-6 fw-bold mb-1">{TenHangHoa}</h5>
                <p className="card-text text-muted small mb-2 flex-grow-1">{MoTa}</p> {/* flex-grow-1 để mô tả chiếm không gian */}

                {/* Phần đánh giá và giá */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                     <small className="text-warning"> {/* Sử dụng màu vàng cho sao đánh giá */}
                        <i className="bi bi-star-fill me-1"></i>{DanhGia}
                    </small>
                    <p className="card-text fw-bold text-danger mb-0">{GiaBan}</p>
                </div>

                 {/* Thêm nút bấm ví dụ */}
                 <a href="#" className="btn btn-sm btn-outline-primary w-100 stretched-link">Xem chi tiết</a>
            </div>
            {/* Không cần card-footer riêng nếu đã dùng flex-column trong card-body */}
        </div>
    );
}

export default SanPhamCardLayout;