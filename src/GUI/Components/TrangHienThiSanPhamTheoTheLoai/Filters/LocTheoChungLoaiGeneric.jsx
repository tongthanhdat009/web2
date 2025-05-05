import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { getChungLoaiVaTheLoai } from '../../../../DAL/apiTrangChuUser'; // Adjusted path

// Nhận thêm selectedChungLoai và setSelectedChungLoai từ props
function LocTheoChungLoaiGeneric({ maTheLoai, title, selectedChungLoai, setSelectedChungLoai }) {
    const [chungLoaiList, setChungLoaiList] = useState([]);
    // Không cần state selectedChungLoai cục bộ nữa

    useEffect(() => {
        const fetchAndFilterChungLoai = async () => {
            try {
                const allData = await getChungLoaiVaTheLoai();
                if (allData && Array.isArray(allData)) {
                    const filteredData = allData.filter(cl => cl.MaTheLoai === maTheLoai);
                    setChungLoaiList(filteredData);
                } else {
                    console.error("API did not return a valid array.");
                    setChungLoaiList([]);
                }
            } catch (error) {
                console.error("Error fetching or filtering chung loai:", error);
                setChungLoaiList([]);
            }
        };
        fetchAndFilterChungLoai();
    }, [maTheLoai]);

    // Handle checkbox change - Gọi hàm từ props
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const maChungLoaiValue = value; // Value từ checkbox
        // Gọi hàm setSelectedChungLoai từ props để cập nhật state ở component cha
        setSelectedChungLoai(prevSelected => {
            if (checked) {
                // Thêm vào nếu chưa có (tránh trùng lặp)
                return prevSelected.includes(maChungLoaiValue) ? prevSelected : [...prevSelected, maChungLoaiValue];
            } else {
                // Loại bỏ khỏi danh sách
                return prevSelected.filter(id => id !== maChungLoaiValue);
            }
        });
    };

     return (
        <div className="mb-3">
            <h6>{title}</h6>
            {chungLoaiList.length > 0 ? (
                <Form>
                    {chungLoaiList.map((chungLoai) => (   
                        <Form.Check
                            key={chungLoai.MaChungLoai}
                            type="checkbox"
                            id={chungLoai.MaChungLoai}
                            label={chungLoai.TenChungLoai}
                            value={chungLoai.MaChungLoai}
                            // Kiểm tra checked dựa trên prop selectedChungLoai từ cha
                            checked={selectedChungLoai.includes(chungLoai.MaChungLoai.toString())}
                            onChange={handleCheckboxChange}
                        />
                    ))}
                </Form>
            ) : (
                <small className="text-muted">Không có chủng loại nào cho thể loại này.</small>
            )}
        </div>
    );
}

export default LocTheoChungLoaiGeneric;