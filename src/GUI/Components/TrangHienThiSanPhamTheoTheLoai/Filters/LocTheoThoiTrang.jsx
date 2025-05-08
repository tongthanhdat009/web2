import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import LocTheoChungLoaiGeneric from './LocTheoChungLoaiGeneric';
import axios from 'axios';

const MA_THE_LOAI = {
    TA: 1,
    CARDIO: 2,
    THOI_TRANG: 3,
    THUCPHAM: 4,
    KHAC: 5,
    GIAY: 6
};

// API URLs
const KICH_THUOC_QUAN_AO_API_URL = 'http://localhost/web2/server/api/LocTheoTheLoai/getKichThuocQuanAo.php';
const KICH_THUOC_GIAY_API_URL = 'http://localhost/web2/server/api/LocTheoTheLoai/getKichThuocGiay.php';

// Nhận thêm props cho kích thước
function LocTheoThoiTrang({
    selectedChungLoai, setSelectedChungLoai,
    selectedClothingSizes, setSelectedClothingSizes, // Props cho size quần áo
    // selectedShoeSizes, setSelectedShoeSizes        // Props cho size giày
}) {

    const [clothingSizeOptions, setClothingSizeOptions] = useState([]);
    const [loadingClothingSizes, setLoadingClothingSizes] = useState(true);
    const [errorClothingSizes, setErrorClothingSizes] = useState(null);

    // const [shoeSizeOptions, setShoeSizeOptions] = useState([]);
    // const [loadingShoeSizes, setLoadingShoeSizes] = useState(true);
    // const [errorShoeSizes, setErrorShoeSizes] = useState(null);

    // Fetch Kích thước Quần áo
    useEffect(() => {
        const fetchClothingSizes = async () => {
            setLoadingClothingSizes(true);
            setErrorClothingSizes(null);
            try {
                const response = await axios.get(KICH_THUOC_QUAN_AO_API_URL);
                if (response.data?.success && Array.isArray(response.data.data)) {
                    setClothingSizeOptions(response.data.data);
                } else {
                    throw new Error(response.data?.message || "API không trả về dữ liệu size quần áo hợp lệ.");
                }
            } catch (error) {
                console.error("Lỗi fetch size quần áo:", error);
                setErrorClothingSizes("Không thể tải danh sách size quần áo.");
            } finally {
                setLoadingClothingSizes(false);
            }
        };
        fetchClothingSizes();
    }, []);

    // Fetch Kích thước Giày
    // useEffect(() => {
    //     const fetchShoeSizes = async () => {
    //         setLoadingShoeSizes(true);
    //         setErrorShoeSizes(null);
    //         try {
    //             const response = await axios.get(KICH_THUOC_GIAY_API_URL);
    //             if (response.data?.success && Array.isArray(response.data.data)) {
    //                 setShoeSizeOptions(response.data.data);
    //             } else {
    //                 throw new Error(response.data?.message || "API không trả về dữ liệu size giày hợp lệ.");
    //             }
    //         } catch (error) {
    //             console.error("Lỗi fetch size giày:", error);
    //             setErrorShoeSizes("Không thể tải danh sách size giày.");
    //         } finally {
    //             setLoadingShoeSizes(false);
    //         }
    //     };
    //     fetchShoeSizes();
    // }, []);

    // Handler cho checkbox size quần áo
    const handleClothingSizeChange = (event) => {
        const { value, checked } = event.target;
        console.log("Checkbox size quần áo:", value, checked); // Debug log
        setSelectedClothingSizes(prevSelected => {
            if (checked) {
                return prevSelected.includes(value) ? prevSelected : [...prevSelected, value];
            } else {
                return prevSelected.filter(id => id !== value);
            }
        });
    };

    // Handler cho checkbox size giày
    // const handleShoeSizeChange = (event) => {
    //     const { value, checked } = event.target;
    //     console.log("Checkbox size gia:", value, checked); // Debug log

    //     setSelectedShoeSizes(prevSelected => {
    //         if (checked) {
    //             return prevSelected.includes(value) ? prevSelected : [...prevSelected, value];
    //         } else {
    //             return prevSelected.filter(id => id !== value);
    //         }
    //     });
    // };

    return (
        <>
            {/* Bộ lọc chủng loại generic */}
            <LocTheoChungLoaiGeneric
                maTheLoai={MA_THE_LOAI.THOI_TRANG}
                title="Loại sản phẩm"
                selectedChungLoai={selectedChungLoai}
                setSelectedChungLoai={setSelectedChungLoai}
            />

            {/* Bộ lọc Size Quần Áo */}
            <div className="mb-3 mt-3 border-top pt-3">
                <h6>Size Quần Áo</h6>
                {loadingClothingSizes ? (
                    <small className="text-muted">Đang tải size...</small>
                ) : errorClothingSizes ? (
                    <small className="text-danger">{errorClothingSizes}</small>
                ) : clothingSizeOptions.length > 0 ? (
                    <Form>
                        {clothingSizeOptions.map((size) => (
                            <Form.Check
                                key={size.IDKichThuocQuanAo}
                                type="checkbox"
                                id={`clothingsize-${size.IDKichThuocQuanAo}`}
                                label={size.KichThuocQuanAo} // Hiển thị tên size
                                value={size.IDKichThuocQuanAo.toString()} // Giá trị là ID
                                checked={(selectedClothingSizes || []).includes(size.IDKichThuocQuanAo.toString())}
                                onChange={handleClothingSizeChange}
                            />
                        ))}
                    </Form>
                ) : (
                     <small className="text-muted">Không có size.</small>
                )}
            </div>

            {/* Bộ lọc Size Giày */}
            {/* <div className="mb-3 mt-3 border-top pt-3">
                <h6>Size Giày</h6>
                 {loadingShoeSizes ? (
                    <small className="text-muted">Đang tải size...</small>
                ) : errorShoeSizes ? (
                    <small className="text-danger">{errorShoeSizes}</small>
                ) : shoeSizeOptions.length > 0 ? (
                    <Form>
                        {shoeSizeOptions.map((size) => (
                            <Form.Check
                                key={size.IDKichThuocGiay}
                                type="checkbox"
                                id={`shoesize-${size.IDKichThuocGiay}`}
                                label={size.KichThuocGiay} // Hiển thị số size
                                value={size.IDKichThuocGiay.toString()} // Giá trị là ID
                                checked={(selectedShoeSizes || []).includes(size.IDKichThuocGiay.toString())}
                                onChange={handleShoeSizeChange}
                            />
                        ))}
                    </Form>
                 ) : (
                     <small className="text-muted">Không có size.</small>
                 )}
            </div> */}
        </>
    );
}

export default LocTheoThoiTrang;