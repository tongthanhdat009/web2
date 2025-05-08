import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import LocTheoChungLoaiGeneric from './LocTheoChungLoaiGeneric'; // Import the generic component

const KICH_THUOC_GIAY_API_URL = 'http://localhost/web2/server/api/LocTheoTheLoai/getKichThuocGiay.php';

function LocTheoSizeGiay({ selectedShoeSizes, setSelectedShoeSizes, selectedShoeTypes, setSelectedShoeTypes }) {
    const [shoeSizeOptions, setShoeSizeOptions] = useState([]);
    const [loadingShoeSizes, setLoadingShoeSizes] = useState(true);
    const [errorShoeSizes, setErrorShoeSizes] = useState(null);

    useEffect(() => {
        const fetchShoeSizes = async () => {
            setLoadingShoeSizes(true);
            setErrorShoeSizes(null);
            try {
                const response = await axios.get(KICH_THUOC_GIAY_API_URL);
                if (response.data?.success && Array.isArray(response.data.data)) {
                    setShoeSizeOptions(response.data.data);
                } else {
                    throw new Error(response.data?.message || "API không trả về dữ liệu size giày hợp lệ.");
                }
            } catch (error) {
                console.error("Lỗi fetch size giày:", error);
                setErrorShoeSizes("Không thể tải danh sách size giày.");
            } finally {
                setLoadingShoeSizes(false);
            }
        };
        fetchShoeSizes();
    }, []);

    const handleShoeSizeChange = (event) => {
        const { value, checked } = event.target;
        setSelectedShoeSizes(prevSelected => {
            if (checked) {
                return prevSelected.includes(value) ? prevSelected : [...prevSelected, value];
            } else {
                return prevSelected.filter(id => id !== value);
            }
        });
    };

    return (
        <div className="mb-3 mt-3 border-top pt-3">
            {/* Bộ lọc chủng loại giày */}
            <LocTheoChungLoaiGeneric
                maTheLoai={6}
                title="Chủng Loại Giày"
                selectedChungLoai={selectedShoeTypes}
                setSelectedChungLoai={setSelectedShoeTypes}
            />

            {/* Bộ lọc size giày */}
            <h6 className="mt-4">Size Giày</h6>
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
        </div>
    );
}

export default LocTheoSizeGiay;