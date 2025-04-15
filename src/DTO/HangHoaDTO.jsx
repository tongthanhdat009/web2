class HangHoaDTO {
    constructor({ MaHangHoa, MaChungLoai, TenHangHoa, MaHang, MaKhuyenMai, MoTa, ThoiGianBaoHanh, Anh, TrangThai }) {
        this.maHangHoa = MaHangHoa;  
        this.maChungLoai = MaChungLoai;
        this.tenHangHoa = TenHangHoa;
        this.maHang = MaHang;
        this.maKhuyenMai = MaKhuyenMai;
        this.moTa = MoTa;
        this.thoiGianBaoHanh = ThoiGianBaoHanh;
        this.anh = Anh;
        this.trangThai = TrangThai;
    }
}

export default HangHoaDTO;