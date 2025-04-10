class QuyenDTO {
    constructor(data = {}) {
        this.idQuyen = data.idQuyen || '';
        this.tenQuyen = data.tenQuyen || '';
        this.moTa = data.moTa || '';
        this.trangThai = data.trangThai !== undefined ? data.trangThai : 1;
        this.heThong = data.heThong || 0;
        this.phanQuyen = data.phanQuyen || [];
    }
}
export default QuyenDTO;
