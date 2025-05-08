class PhanQuyenDTO {
    constructor(data = {}) {
        this.IDQuyen = data.IDQuyen || '';
        this.TenQuyen = data.TenQuyen || '';
        // Normalize the ChucNang array format
        this.ChucNang = Array.isArray(data.ChucNang) 
            ? data.ChucNang.map(cn => ({
                IDChucNang: cn.IDChucNang || '',
                TenChucNang: cn.TenChucNang || '',
                Them: cn.Them === true || cn.Them === 1,
                Xoa: cn.Xoa === true || cn.Xoa === 1,
                Sua: cn.Sua === true || cn.Sua === 1
            })) 
            : [];
    }

    // Method to return data in format expected by API for add operations
    toApiAddData() {
        return {
            TenQuyen: this.TenQuyen,
            ChucNang: this.ChucNang.map(cn => ({
                IDChucNang: cn.IDChucNang,
                Them: cn.Them,
                Xoa: cn.Xoa,
                Sua: cn.Sua
            }))
        };
    }

    // Method to return data in format expected by API for update operations
    toApiUpdateData() {
        return {
            IDQuyen: this.IDQuyen,
            TenQuyen: this.TenQuyen,
            ChucNang: this.ChucNang.map(cn => ({
                IDChucNang: cn.IDChucNang,
                Them: cn.Them,
                Xoa: cn.Xoa,
                Sua: cn.Sua
            }))
        };
    }

    // Helper method to create a copy of this object
    clone() {
        return new PhanQuyenDTO({
            IDQuyen: this.IDQuyen,
            TenQuyen: this.TenQuyen,
            ChucNang: this.ChucNang.map(cn => ({...cn}))
        });
    }

    // Add a new ChucNang to this role
    addChucNang(chucNang) {
        // Check if already exists
        const exists = this.ChucNang.some(cn => cn.IDChucNang === chucNang.IDChucNang);
        if (!exists) {
            this.ChucNang.push({
                IDChucNang: chucNang.IDChucNang,
                TenChucNang: chucNang.TenChucNang,
                Them: false,
                Xoa: false,
                Sua: false
            });
        }
        return this;
    }

    // Remove a ChucNang from this role
    removeChucNang(idChucNang) {
        this.ChucNang = this.ChucNang.filter(cn => cn.IDChucNang !== idChucNang);
        return this;
    }

    // Update permission for a ChucNang
    updatePermission(idChucNang, permission, value) {
        const index = this.ChucNang.findIndex(cn => cn.IDChucNang === idChucNang);
        if (index !== -1 && ['Them', 'Xoa', 'Sua'].includes(permission)) {
            this.ChucNang[index][permission] = value;
        }
        return this;
    }
}

export default PhanQuyenDTO;