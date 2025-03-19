class HangHoaDTO {
    constructor({ MaHangHoa, MaChungLoai, TenHangHoa, MaHang, MaKhuyenMai, MoTa, ThoiGianBaoHanh, Anh }) {
        this.maHangHoa = MaHangHoa;  
        this.maChungLoai = MaChungLoai;
        this.tenHangHoa = TenHangHoa;
        this.maHang = MaHang;
        this.maKhuyenMai = MaKhuyenMai;
        this.moTa = MoTa;
        this.thoiGianBaoHanh = ThoiGianBaoHanh;
        this.anh = Anh;
    }
}

export default HangHoaDTO;