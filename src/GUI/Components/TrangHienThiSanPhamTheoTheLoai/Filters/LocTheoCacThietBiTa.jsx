import React, { useState, useEffect } from 'react'; // Import useState và useEffect
import { Form } from 'react-bootstrap';
import LocTheoChungLoaiGeneric from './LocTheoChungLoaiGeneric';
import axios from 'axios'; // Import axios để gọi API

const MA_THE_LOAI = {
    TA: 1,
    CARDIO: 2,
    THOI_TRANG: 3,
    THUCPHAM: 4,
    KHAC: 5
};

// API endpoint để lấy dữ liệu
const KHOI_LUONG_API_URL = 'http://localhost/web2/server/api/LocTheoTheLoai/getKhoiLuong.php';

function LocTheoCacThietBiTa({ selectedChungLoai, setSelectedChungLoai, selectedKhoiLuong, setSelectedKhoiLuong }) {

    const [khoiLuongOptions, setKhoiLuongOptions] = useState([]);
    const [loadingKhoiLuong, setLoadingKhoiLuong] = useState(true);
    const [errorKhoiLuong, setErrorKhoiLuong] = useState(null);   

    useEffect(() => {
        const fetchKhoiLuong = async () => {
            setLoadingKhoiLuong(true);
            setErrorKhoiLuong(null);
            try {
                const response = await axios.get(KHOI_LUONG_API_URL);
                if (response.data && response.data.success && Array.isArray(response.data.data)) {
                    // Map dữ liệu API thành định dạng { value: string, label: string }
                    const options = response.data.data.map(item => ({
                        // Giả sử API trả về IDKhoiLuongTa và KhoiLuong
                        // Sử dụng KhoiLuong làm value và label (hoặc IDKhoiLuongTa làm value nếu cần)
                        value: item.IDKhoiLuongTa.toString(), // Chuyển sang string nếu cần
                        label: `${item.KhoiLuong} kg`
                    }));
                    setKhoiLuongOptions(options);
                } else {
                    throw new Error(response.data?.message || "API không trả về dữ liệu khối lượng hợp lệ.");
                }
            } catch (error) {
                console.error("Lỗi fetch khối lượng:", error);
                setErrorKhoiLuong("Không thể tải danh sách khối lượng.");
            } finally {
                setLoadingKhoiLuong(false);
            }
        };

        fetchKhoiLuong();
    }, []); // Chỉ chạy 1 lần khi mount

    // Handler cho dropdown khối lượng
    const handleKhoiLuongChange = (event) => {
        const { value } = event.target;
        console.log("Selected khối lượng:", value);
        if (value === "") { // Nếu chọn "Tất cả"
            setSelectedKhoiLuong([]); // Reset bộ lọc khối lượng
        } else {
            // Cập nhật state cha với một mảng chứa chỉ giá trị được chọn
            // Logic lọc ở cha vẫn mong đợi một mảng
            setSelectedKhoiLuong([value]);
        }
    };

    // Xác định giá trị hiện tại của dropdown
    // Nếu selectedKhoiLuong có phần tử, lấy phần tử đầu tiên, ngược lại là chuỗi rỗng (cho "Tất cả")
    const currentSelectedValue = (selectedKhoiLuong && selectedKhoiLuong.length > 0) ? selectedKhoiLuong[0] : "";

    return (
        <>
            {/* Bộ lọc chủng loại generic */}
            <LocTheoChungLoaiGeneric
                maTheLoai={MA_THE_LOAI.TA}
                title="Loại thiết bị"
                selectedChungLoai={selectedChungLoai}
                setSelectedChungLoai={setSelectedChungLoai}
            />

            {/* Bộ lọc khối lượng mới bằng Dropdown */}
            <div className="mb-3 mt-3 border-top pt-3">
                <h6>Khối lượng</h6>
                {loadingKhoiLuong ? (
                    <small className="text-muted">Đang tải khối lượng...</small>
                ) : errorKhoiLuong ? (
                    <small className="text-danger">{errorKhoiLuong}</small>
                ) : (
                    <Form.Select
                        aria-label="Chọn khối lượng"
                        value={currentSelectedValue} // Giá trị hiện tại của dropdown
                        onChange={handleKhoiLuongChange}
                        size="sm" // Kích thước nhỏ hơn nếu muốn
                    >
                        <option value="">Tất cả khối lượng</option> {/* Option mặc định */}
                        {khoiLuongOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                )}
            </div>
        </>
    );
}

export default LocTheoCacThietBiTa;