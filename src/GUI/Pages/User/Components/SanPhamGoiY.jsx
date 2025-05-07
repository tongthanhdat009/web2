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
                        .slice(0, 5)
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
        <div className="d-flex flex-wrap" style={{ width: "100%", height: "fit-content" }}>
            {[...goiYNhoNhat, ...Array(5 - goiYNhoNhat.length).fill(null)].map((sp, idx) => (
                <div className="col p-2" key={sp ? sp.MaHangHoa + "-min" : "empty-" + idx}>
                    {sp ? (
                        <SanPhamCardLayout
                            MaHangHoa={sp.MaHangHoa}
                            Anh={sp.Anh}
                            TenHangHoa={sp.TenHangHoa}
                            GiaGoc={sp.GiaBan}
                            PhanTramKM={sp.PhanTramKM}
                            MoTa={sp.MoTa}
                        />
                    ) : (
                        <div style={{ width: "100%", height: "100%", visibility: "hidden" }}>
                            {/* Chỗ trống giữ layout */}
                            <SanPhamCardLayout />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SanPhamGoiY;