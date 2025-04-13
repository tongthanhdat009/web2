class NguoiDungDTO {
    constructor(MaNguoiDung, HoTen, GioiTinh, Email, SoDienThoai, IDTaiKhoan, Anh){
        this.MaNguoiDung = MaNguoiDung;
        this.HoTen = HoTen;
        this.GioiTinh = GioiTinh;
        this.Email = Email;
        this.SoDienThoai = SoDienThoai;
        this.IDTaiKhoan = IDTaiKhoan;
        this.Anh = Anh;
    }
    getMaNguoiDung() {
        return this.MaNguoiDung;
    }
    getHoTen() {
        return this.HoTen;
    }
    getGioiTinh() {
        return this.GioiTinh;
    }
    getEmail() {
        return this.Email;
    }
    getSoDienThoai() {
        return this.SoDienThoai;
    }
    getIDTaiKhoan() {
        return this.IDTaiKhoan;
    }
    getAnh() {
        return this.Anh;
    }
    setMaNguoiDung(MaNguoiDung) {
        this.MaNguoiDung = MaNguoiDung;
    }
    setHoTen(HoTen) {
        this.HoTen = HoTen;
    }
    setGioiTinh(GioiTinh) {
        this.GioiTinh = GioiTinh;
    }
    setEmail(Email) {
        this.Email = Email;
    }
    setSoDienThoai(SoDienThoai) {
        this.SoDienThoai = SoDienThoai;
    }
    setIDTaiKhoan(IDTaiKhoan) {
        this.IDTaiKhoan = IDTaiKhoan;
    }
    setAnh(Anh) {
        this.Anh = Anh;
    }
    toString() {
        return `MaNguoiDung: ${this.MaNguoiDung}, HoTen: ${this.HoTen}, GioiTinh: ${this.GioiTinh}, Email: ${this.Email}, SoDienThoai: ${this.SoDienThoai}, IDTaiKhoan: ${this.IDTaiKhoan}, Anh: ${this.Anh}`;
    }
}
export default NguoiDungDTO;