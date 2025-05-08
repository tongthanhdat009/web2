import React from 'react';
import LocTheoChungLoaiGeneric from './LocTheoChungLoaiGeneric';
const MA_THE_LOAI = {
    TA: 1,
    CARDIO: 2,
    THOI_TRANG: 3,
    THUCPHAM: 4,
    KHAC: 5,
    GIAY: 6
};

// Nhận selectedChungLoai và setSelectedChungLoai từ props
function LocTheoThietBiCardio({ selectedChungLoai, setSelectedChungLoai }) {
    return <LocTheoChungLoaiGeneric
        maTheLoai={MA_THE_LOAI.CARDIO}
        title="Thiết bị Cardio"
        // Truyền props xuống component generic
        selectedChungLoai={selectedChungLoai}
        setSelectedChungLoai={setSelectedChungLoai}
    />;
}

export default LocTheoThietBiCardio;
