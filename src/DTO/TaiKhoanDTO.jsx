class TaiKhoanDTO {
    constructor(idTaiKhoan, tenDangNhap, matKhau, idQuyen) {
        this.idTaiKhoan = idTaiKhoan; // Mã tài khoản
        this.tenDangNhap = tenDangNhap; // Tên đăng nhập
        this.matKhau = matKhau; // Mật khẩu
        this.idQuyen = idQuyen; // Mã quyền (FK)
    }
}
export default TaiKhoanDTO;