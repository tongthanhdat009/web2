import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "../../Components/TrangChuNguoiDung/Slider.jsx";
import TieuDeDanhSach from "../../Components/TrangChuNguoiDung/TieuDeDanhSach.jsx";
import ChinhSachComponent from "../../Components/TrangChuNguoiDung/ChinhSachComponent.jsx";
import SanPhamCardLayout from '../../Components/SanPhamCardLayout.jsx';
import { getHangHoaTheoTheLoai } from '../../../DAL/apiTrangChuUser.jsx';
import DanhMuc from '../../Components/TrangChuNguoiDung/DanhMuc.jsx';
import DanhMucNoiBat from '../../Components/TrangChuNguoiDung/DanhMucNoiBat.jsx';
const MA_THE_LOAI = {
    TA: 1,
    CARDIO: 2,
    THOI_TRANG: 3,
    THUCPHAM: 4,
    KHAC: 5
};

function TrangChuUser() {
    // State cho từng danh sách sản phẩm
    const [thietBiTa, setThietBiTa] = useState([]);
    const [thietBiCardio, setThietBiCardio] = useState([]);
    const [thoiTrang, setThoiTrang] = useState([]);
    const [thucPham, setThucPham] = useState([]);
    const [thietBiKhac, setThietBiKhac] = useState([]);

    // State cho trạng thái loading và lỗi
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm fetch dữ liệu chung theo thể loại
    const fetchDataForCategory = async (maTheLoai, setDataFunction) => {
        const data = await getHangHoaTheoTheLoai(maTheLoai);
        if (data) {
            setDataFunction(data);
        } else {
            setError(prevError => ({ ...prevError, [maTheLoai]: `Không tải được dữ liệu cho thể loại ${maTheLoai}` }));
            setDataFunction([]);
        }
    };

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                await Promise.all([
                    fetchDataForCategory(MA_THE_LOAI.TA, setThietBiTa),
                    fetchDataForCategory(MA_THE_LOAI.CARDIO, setThietBiCardio),
                    fetchDataForCategory(MA_THE_LOAI.THOI_TRANG, setThoiTrang),
                    fetchDataForCategory(MA_THE_LOAI.THUCPHAM, setThucPham),
                    fetchDataForCategory(MA_THE_LOAI.KHAC, setThietBiKhac)
                ]);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu trang chủ:", err);
                setError({ general: "Đã xảy ra lỗi khi tải dữ liệu." });
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    // Hàm render danh sách sản phẩm cho một section
    const renderSanPhamList = (sanPhamList, maTheLoai) => {
        if (loading) {
            return null;
        }
        
        if (error && error[maTheLoai]) {
            return <div className="col-12"><div className="alert alert-warning mx-auto" style={{maxWidth: '500px'}}>{error[maTheLoai]}</div></div>;
        }

        // Hiển thị lỗi chung nếu có và không có lỗi cụ thể cho section này
        if (error && error.general && !error[maTheLoai]) {
            return <div className="col-12"><div className="alert alert-danger mx-auto" style={{maxWidth: '500px'}}>{error.general}</div></div>;
        }

        // Lấy tối đa 5 sản phẩm để hiển thị trên trang chủ
        const limitedList = sanPhamList.slice(0, 5);

        // Hiển thị thông báo nếu không có sản phẩm nào (sau khi fetch hoặc slice)
        if (limitedList.length === 0) {
            return <div className="col-12"><p className="text-center text-muted">Không có sản phẩm nào trong mục này.</p></div>;
        }

        console.log("Danh sách sản phẩm:", limitedList); // Kiểm tra danh sách sản phẩm
        // Render danh sách sản phẩm giới hạn
        return limitedList.map((sp) => (
            <div className="col p-2" key={`${maTheLoai}-${sp.MaHangHoa}`}>
                <SanPhamCardLayout
                    MaHangHoa={sp.MaHangHoa}
                    Anh={sp.Anh || '/assets/AnhHangHoa/placeholder.png'} // Cập nhật placeholder nếu cần
                    MoTa={sp.MoTa || ''}
                    TenHangHoa={sp.TenHangHoa}
                    GiaGoc={sp.GiaBan} // Đảm bảo API trả về GiaGoc dạng number
                    PhanTramKM={sp.PhanTram || 0} // Đảm bảo API trả về PhanTramKM dạng number
                />
            </div>
        ));
    };

    // Hàm render nút "Xem tất cả"
    const renderXemTatCaButton = (maTheLoai, sanPhamList) => {
        // Chỉ hiển thị nút nếu không loading, không có lỗi chung và danh sách gốc có nhiều hơn 5 sản phẩm
        if (!loading && (!error || !error.general) && sanPhamList && sanPhamList.length > 5) {
            return (
                <div className="text-center mt-3 mb-4">
                    {/* Cập nhật đường dẫn '/the-loai/' nếu cần */}
                    <Link to={`/the-loai/${maTheLoai}`} className="btn btn-outline-primary">
                        Xem tất cả ({sanPhamList.length})
                    </Link>
                </div>
            );
        }
        // Cũng hiển thị nút nếu có từ 1-5 sản phẩm, nhưng không cần text "(số lượng)"
        else if (!loading && (!error || !error.general) && sanPhamList && sanPhamList.length > 0 && sanPhamList.length <= 5) {
             return (
                <div className="text-center mt-3 mb-4">
                    <Link to={`/the-loai/${maTheLoai}`} className="btn btn-outline-primary">
                        Xem thêm
                    </Link>
                </div>
            );
        }
        return null;
    };


    return (
        <>
            <DanhMuc />
            <Slider />
            <ChinhSachComponent />

            {/* Spinner*/}
            {loading && (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}


            {/* Danh mục nổi bật*/}
            <TieuDeDanhSach TieuDeDanhSach="Các danh mục nổi bật" MoTa="Danh mục bán được nhiều sản phẩm" />
            <div style={{ marginLeft: "10%", marginRight: "10%" }} className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mb-3" id="DanhMucNoiBat">
                <DanhMucNoiBat />
            </div>


            {/* Các thiết bị tạ */}
            <TieuDeDanhSach TieuDeDanhSach="Các thiết bị tạ" MoTa="Các loại tạ theo khối lượng" />
            <div style={{ marginLeft: "10%", marginRight: "10%" }} className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mb-3" id="CacThietBiTa">
                {renderSanPhamList(thietBiTa, MA_THE_LOAI.TA)}
            </div>
            {renderXemTatCaButton(MA_THE_LOAI.TA, thietBiTa)}


            {/* Thiết bị cardio */}
            <TieuDeDanhSach TieuDeDanhSach="Thiết bị cardio" MoTa="Các thiết bị đốt năng lượng nhanh" />
            <div style={{ marginLeft: "10%", marginRight: "10%" }} className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mb-3" id="ThietBiCardio">
                {renderSanPhamList(thietBiCardio, MA_THE_LOAI.CARDIO)}
            </div>
            {renderXemTatCaButton(MA_THE_LOAI.CARDIO, thietBiCardio)}


            {/* Thời trang thể thao */}
            <TieuDeDanhSach TieuDeDanhSach="Thời trang thể thao" MoTa="Quần áo chuyên dụng cho thể thao" />
            <div style={{ marginLeft: "10%", marginRight: "10%" }} className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mb-3" id="ThoiTrangTheThao">
                {renderSanPhamList(thoiTrang, MA_THE_LOAI.THOI_TRANG)}
            </div>
            {renderXemTatCaButton(MA_THE_LOAI.THOI_TRANG, thoiTrang)}


             {/* Thực phẩm chức năng */}
             <TieuDeDanhSach TieuDeDanhSach="Thực phẩm chức năng" MoTa="Hỗ trợ tập luyện và sức khỏe" />
            <div style={{ marginLeft: "10%", marginRight: "10%" }} className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mb-3" id="ThucPhamChucNang">
                {renderSanPhamList(thucPham, MA_THE_LOAI.THUCPHAM)}
            </div>
            {renderXemTatCaButton(MA_THE_LOAI.THUCPHAM, thucPham)}


            {/* Các thiết bị khác */}
            <TieuDeDanhSach TieuDeDanhSach="Các thiết bị khác" MoTa="Ghế tập, xà đơn, xà kép,..." />
            <div style={{ marginLeft: "10%", marginRight: "10%" }} className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mb-3" id="CacThietBiKhac">
                {renderSanPhamList(thietBiKhac, MA_THE_LOAI.KHAC)}
            </div>
             {renderXemTatCaButton(MA_THE_LOAI.KHAC, thietBiKhac)}

        </>
    );
}
export default TrangChuUser;