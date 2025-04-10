class QuyenDTO {
    constructor(data = {}) {
        this.IDQuyen = data.IDQuyen || null;
        this.TenQuyen = data.TenQuyen || '';
        this.ChucNang = data.ChucNang || [];
    }

    static fromJSON(json) {
        return new QuyenDTO({
            IDQuyen: json.IDQuyen,
            TenQuyen: json.TenQuyen,
            ChucNang: json.ChucNang
        });
    }

    toJSON() {
        return {
            IDQuyen: this.IDQuyen,
            TenQuyen: this.TenQuyen,
            ChucNang: this.ChucNang
        };
    }
}

export default QuyenDTO;
