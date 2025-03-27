export default class PhanQuyenDTO {
    constructor(idChucNang, idQuyen) {
        this.idChucNang = idChucNang; // Mã chức năng (FK)
        this.idQuyen = idQuyen; // Mã quyền (FK)
    }
}
