class HangHoaDTO {
    constructor({ MaHangHoa, MaChungLoai, TenHangHoa, MaHang, MaKhuyenMai, MoTa, ThoiGianBaoHanh, Anh, TrangThai }) {
        this.MaHangHoa = MaHangHoa;
        this.MaChungLoai = MaChungLoai;
        this.TenHangHoa = TenHangHoa;
        this.MaHang = MaHang;
        this.MaKhuyenMai = MaKhuyenMai;
        this.MoTa = MoTa;
        this.ThoiGianBaoHanh = ThoiGianBaoHanh;
        this.Anh = Anh;
        this.TrangThai = TrangThai;
    }
}

export default HangHoaDTO;