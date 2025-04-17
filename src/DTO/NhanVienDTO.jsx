import NguoiDungDTO from './NguoiDungDTO';

class NhanVienDTO extends NguoiDungDTO {
    constructor(MaNguoiDung, HoTen, GioiTinh, Email, SoDienThoai, IDTaiKhoan, Anh, NgaySinh, Luong, CCCD) {
        super(MaNguoiDung, HoTen, GioiTinh, Email, SoDienThoai, IDTaiKhoan, Anh);
        
        this.NgaySinh = NgaySinh;
        this.Luong = Luong;
        this.CCCD = CCCD;
    }

    getNgaySinh() {
        return this.NgaySinh;
    }

    getLuong() {
        return this.Luong;
    }

    getCCCD() {
        return this.CCCD;
    }

    setCCCD(CCCD) {
        this.CCCD = CCCD;
    }

    setNgaySinh(NgaySinh) {
        this.NgaySinh = NgaySinh;
    }

    setLuong(Luong) {
        this.Luong = Luong;
    }

    toString() {
        return `${super.toString()} NgaySinh: ${this.NgaySinh}, Luong: ${this.Luong}, CCCD: ${this.CCCD}`;
    }
}

export default NhanVienDTO;