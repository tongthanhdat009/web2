import React, { useEffect, useState } from "react";
import SanPhamCardLayout from "../../../Components/SanPhamCardLayout";
import { getGoiY } from "../../../../DAL/apiChiTietHangHoa.jsx";

function SanPhamGoiY({ maChungLoai, maHangHoaHienTai }) {
    const [goiYNhoNhat, setGoiYNhoNhat] = useState([]);

    useEffect(() => {
        if (maChungLoai) {
            getGoiY(maChungLoai).then(res => {
                if (res && res.data) {
                    const map = {};
                    res.data.forEach(item => {
                        // Ép kiểu về string để so sánh chắc chắn
                        if (
                            String(item.MaHangHoa) !== String(maHangHoaHienTai) && (
                                !map[item.MaHangHoa] ||
                                (item.GiaBan && item.GiaBan < map[item.MaHangHoa].GiaBan)
                            )
                        ) {
                            map[item.MaHangHoa] = item;
                        }
                    });
                    // Chuyển PhanTram sang số
                    const result = Object.values(map)
                        .slice(0, 6)
                        .map(sp => ({
                            ...sp,
                            PhanTramKM: sp.PhanTram ? Number(sp.PhanTram) : 0
                        }));
                    setGoiYNhoNhat(result);
                }
            });
        }
    }, [maChungLoai, maHangHoaHienTai]);

    return (
        <div className="d-flex flex-wrap" style={{ width: "100%"  }}>
            {goiYNhoNhat.map((sp, idx) => (
                <SanPhamCardLayout
                    key={sp.MaHangHoa + "-min"}
                    MaHangHoa={sp.MaHangHoa}
                    Anh={sp.Anh}
                    TenHangHoa={sp.TenHangHoa}
                    GiaGoc={sp.GiaBan}
                    PhanTramKM={sp.PhanTramKM}
                    MoTa={sp.MoTa}
                />
            ))}
        </div>
    );
}

export default SanPhamGoiY;