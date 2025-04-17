class PhanQuyenDTO {
    constructor(data = {}) {
        this.IDChucNang = data.IDChucNang || null;
        this.IDQuyen = data.IDQuyen || null;
        this.TenChucNang = data.TenChucNang || '';
        this.Them = data.Them || 0;
        this.Xoa = data.Xoa || 0;
        this.Sua = data.Sua || 0;
    }

    static fromJSON(json) {
        return new PhanQuyenDTO({
            IDChucNang: json.IDChucNang,
            IDQuyen: json.IDQuyen,
            TenChucNang: json.TenChucNang,
            Them: json.Them,
            Xoa: json.Xoa,
            Sua: json.Sua
        });
    }

    toJSON() {
        return {
            IDChucNang: this.IDChucNang,
            IDQuyen: this.IDQuyen,
            TenChucNang: this.TenChucNang,
            Them: this.Them,
            Xoa: this.Xoa,
            Sua: this.Sua
        };
    }
}

export default PhanQuyenDTO;