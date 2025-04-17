// API endpoints cho Phân quyền
const API_URL_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/getAllQuyen.php";
const API_ADD_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/addQuyen.php";
const API_UPDATE_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/updateQuyen.php";
const API_DELETE_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/deleteQuyen.php";

// API endpoints cho Chức năng
const API_GET_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/getAllChucNang.php";
const API_ADD_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/addChucNang.php";
const API_UPDATE_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/updateChucNang.php";
const API_DELETE_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/deleteChucNang.php";



// Lấy danh sách phân quyền với phân trang và tìm kiếm
export async function fetchRoles(page = 1, limit = 10, search = '', showSystem = false) {
    try {
        const params = new URLSearchParams({
            page,
            limit,
            search,
            system: showSystem
        });

        const response = await fetch(`${API_GET_ROLES}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
        }

        const data = await response.json();

        if (data.code === "NO_SESSION") {
            throw new Error("Vui lòng đăng nhập lại");
        }
        
        if (data.code === "NO_PERMISSION") {
            throw new Error("Bạn không có quyền xem danh sách quyền");
        }

        if (!data.success) {
            throw new Error(data.message || "Lỗi khi tải danh sách quyền");
        }

        return data.data || [];
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
}

// Lấy danh sách chức năng
export async function getAllChucNang() {
    try {
        const response = await fetch(API_GET_CHUC_NANG);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        if (result.data && Array.isArray(result.data)) {
            // Assuming ChucNangDTO takes ID and Ten
            return result.data.map(cn => new ChucNangDTO(cn.IDChucNang, cn.TenChucNang));
        }

        return [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chức năng:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

// Thêm chức năng mới
export async function addChucNang(chucNangData) { // Expects { TenChucNang: '...' }
    try {
        const response = await fetch(API_ADD_CHUC_NANG, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chucNangData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        // Return the newly created ChucNang data from the API response
        return {
            success: true,
            message: result.message || "Thêm chức năng thành công",
            data: result.data // Should contain IDChucNang and TenChucNang
        };
    } catch (error) {
        console.error("Lỗi khi thêm chức năng:", error);
        throw error; // Re-throw the error
    }
}

// Cập nhật chức năng
export async function updateChucNang(chucNangData) { // Expects { IDChucNang: ..., TenChucNang: '...' }
    try {
        const response = await fetch(API_UPDATE_CHUC_NANG, {
            // Using POST as the PHP script allows it, common practice
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chucNangData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return {
            success: true,
            message: result.message || "Cập nhật chức năng thành công"
        };
    } catch (error) {
        console.error("Lỗi khi cập nhật chức năng:", error);
        throw error; // Re-throw the error
    }
}

// Xóa chức năng
export async function deleteChucNang(idChucNang) {
    try {
        const response = await fetch(API_DELETE_CHUC_NANG, {
            // Using POST as the PHP script allows it
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IDChucNang: idChucNang })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return {
            success: true,
            message: result.message || "Xóa chức năng thành công"
        };
    } catch (error) {
        console.error("Lỗi khi xóa chức năng:", error);
        throw error; // Re-throw the error
    }
}

// Thêm quyền mới
export async function addRole(role) {
    try {
        const response = await fetch('http://localhost/web2/server/api/manageRoles.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tenQuyen: role.tenQuyen,
                moTa: role.moTa,
                trangThai: role.trangThai,
                phanQuyen: role.phanQuyen,
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (data.code === "NO_CREATE_PERMISSION") {
            throw new Error("Bạn không có quyền thêm quyền mới");
        }
        
        if (data.code === "NAME_EXISTS") {
            throw new Error("Tên quyền đã tồn tại");
        }

        if (data.code === "EMPTY_NAME") {
            throw new Error("Tên quyền không được để trống");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Cập nhật quyền
export async function updateRole(role) {
    try {
        const response = await fetch('http://localhost/web2/server/api/manageRoles.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idQuyen: role.idQuyen,
                tenQuyen: role.tenQuyen,
                moTa: role.moTa,
                trangThai: role.trangThai,
                phanQuyen: role.phanQuyen
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (data.code === "NO_UPDATE_PERMISSION") {
            throw new Error("Bạn không có quyền sửa quyền");
        }

        if (data.code === "SYSTEM_ROLE") {
            throw new Error("Không thể sửa quyền hệ thống");
        }

        if (data.code === "NAME_EXISTS") {
            throw new Error("Tên quyền đã tồn tại");
        }

        return { success: true };
    } catch (error) {
        throw error;
    }
}

// Xóa quyền
export async function deleteRole(id) {
    try {
        const response = await fetch(`http://localhost/web2/server/api/manageRoles.php?IDQuyen=${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.code === "NO_DELETE_PERMISSION") {
            throw new Error("Bạn không có quyền xóa quyền");
        }

        if (data.code === "SYSTEM_ROLE") {
            throw new Error("Không thể xóa quyền hệ thống");
        }

        if (data.code === "ROLE_IN_USE") {
            throw new Error("Quyền đang được sử dụng, không thể xóa");
        }

        return { success: true };
    } catch (error) {
        throw error;  
    }
}

// Functions cho quản lý phân quyền

// Lấy danh sách quyền
export async function getAllQuyen() {
    try {
        const response = await fetch(API_URL_QUYEN);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (Array.isArray(data)) {
            return data.map(quyen => ({
                ...quyen,
                ChucNang: quyen.ChucNang.map(cn => ({
                    IDChucNang: cn.IDChucNang,
                    TenChucNang: cn.TenChucNang,
                    Them: cn.Them,
                    Xoa: cn.Xoa,
                    Sua: cn.Sua
                }))
            }));
        }
        
        return [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách quyền:", error);
        throw error;
    }
}

// Thêm quyền mới
export async function addQuyen(quyenDTO) {
    try {
        const response = await fetch(API_ADD_QUYEN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TenQuyen: quyenDTO.TenQuyen,
                ChucNang: quyenDTO.ChucNang
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Lỗi khi thêm quyền');
        }

        return {
            success: true,
            message: "Thêm quyền thành công",
            data: data
        };
    } catch (error) {
        console.error("Lỗi khi thêm quyền:", error);
        throw error;
    }
}

// Cập nhật quyền
export async function updateQuyen(quyenDTO) {
    try {
        const response = await fetch(API_UPDATE_QUYEN, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                IDQuyen: quyenDTO.IDQuyen,
                TenQuyen: quyenDTO.TenQuyen,
                ChucNang: quyenDTO.ChucNang
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Lỗi khi cập nhật quyền');
        }

        return {
            success: true,
            message: "Cập nhật quyền thành công"
        };
    } catch (error) {
        console.error("Lỗi khi cập nhật quyền:", error);
        throw error;
    }
}

// Xóa quyền
export async function deleteQuyen(idQuyen) {
    try {
        const response = await fetch(API_DELETE_QUYEN, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                IDQuyen: idQuyen
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Lỗi khi xóa quyền');
        }

        return {
            success: true,
            message: "Xóa quyền thành công"
        };
    } catch (error) {
        console.error("Lỗi khi xóa quyền:", error);
        throw error;
    }
}