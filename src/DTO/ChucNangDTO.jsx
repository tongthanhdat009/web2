// src/DTO/ChucNangDTO.jsx
class ChucNangDTO {
    constructor(data = {}) {
        this.IDChucNang = data.IDChucNang || '';
        this.TenChucNang = data.TenChucNang || '';
    }

    // Method to return data in format expected by API for add operations
    toApiAddData() {
        return {
            TenChucNang: this.TenChucNang
        };
    }

    // Method to return data in format expected by API for update operations
    toApiUpdateData() {
        return {
            IDChucNang: this.IDChucNang,
            TenChucNang: this.TenChucNang
        };
    }

    // Helper method to create a copy of this object
    clone() {
        return new ChucNangDTO({
            IDChucNang: this.IDChucNang,
            TenChucNang: this.TenChucNang
        });
    }
}

export default ChucNangDTO;
