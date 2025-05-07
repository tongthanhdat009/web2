import React from 'react';
import LocTheoChungLoaiGeneric from './LocTheoChungLoaiGeneric';
const MA_THE_LOAI = {
    TA: 1,
    CARDIO: 2,
    THOI_TRANG: 3,
    THUCPHAM: 4,
    KHAC: 5
};
// Nhận selectedChungLoai và setSelectedChungLoai từ props
function LocTheoThucPham({ selectedChungLoai, setSelectedChungLoai }) {
    return <LocTheoChungLoaiGeneric
        maTheLoai={MA_THE_LOAI.THUCPHAM}
        title="Thực phẩm bổ sung"
        // Truyền props xuống component generic
        selectedChungLoai={selectedChungLoai}
        setSelectedChungLoai={setSelectedChungLoai}
    />;
}

export default LocTheoThucPham;
