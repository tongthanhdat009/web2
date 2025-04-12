const API_URL_HANGHOA = "http://localhost/web2/server/api/getHangHoa.php";
// API endpoints cho KhuyenMai
const API_URL_KM = "http://localhost/web2/server/api/getKhuyenMai.php";
const API_ADD_KM = "http://localhost/web2/server/api/addKhuyenMai.php";
const API_DELETE_KM = "http://localhost/web2/server/api/deleteKhuyenMai.php";
const API_UPDATE_KM = "http://localhost/web2/server/api/updateKhuyenMai.php";

// API endpoints cho Hang
const API_GET_HANG = "http://localhost/web2/server/api/getHang.php";
const API_ADD_HANG = "http://localhost/web2/server/api/addHang.php";
const API_UPDATE_HANG = "http://localhost/web2/server/api/updateHang.php";
const API_DELETE_HANG = "http://localhost/web2/server/api/deleteHang.php";

// API endpoints cho NCC
const API_URL_NCC = "http://localhost/web2/server/api/getNCC.php";
const API_ADD_NCC = "http://localhost/web2/server/api/addNCC.php";
const API_DELETE_NCC = "http://localhost/web2/server/api/deleteNCC.php";
const API_UPDATE_NCC = "http://localhost/web2/server/api/updateNCC.php";

// API endpoints cho Phân quyền
const API_URL_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/getAllQuyen.php";
const API_ADD_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/addQuyen.php";
const API_UPDATE_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/updateQuyen.php";
const API_DELETE_QUYEN = "http://localhost/web2/server/api/QuanLyPhanQuyen/deleteQuyen.php";

import KhuyenMaiDTO from "../DTO/KhuyenMaiDTO";
import HangDTO from "../DTO/HangDTO";
import NhaCungCapDTO from "../DTO/NhaCungCapDTO";
import HangHoaDTO from "../DTO/HangHoaDTO";
import QuyenDTO from "../DTO/QuyenDTO";
import PhanQuyenDTO from "../DTO/PhanQuyenDTO";

// Lấy danh sách hàng hóa
export async function fetchHangHoa() {
    try {
        const response = await fetch(API_URL_HANGHOA);
        const data = await response.json();
        console.log("API response:", data);
        return (data.data || []).map(item => new HangHoaDTO(item));
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return [];
    }
}

// Lấy danh sách khuyến mãi
export async function fetchKhuyenMai() {
    try {
        const response = await fetch(API_URL_KM);
        const data = await response.json();
        console.log("API response:", data);
        return (data.data || []).map(item => new KhuyenMaiDTO(item));
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return [];
    }
}

export async function addKhuyenMai(khuyenMaiDTO) {
    // Kiểm tra nếu dữ liệu đầu vào đầy đủ và hợp lệ
    if (!khuyenMaiDTO.MaKhuyenMai || !khuyenMaiDTO.TenKhuyenMai || !khuyenMaiDTO.MoTaKhuyenMai || isNaN(khuyenMaiDTO.PhanTram)) {
        console.error("Dữ liệu không hợp lệ:", khuyenMaiDTO);
        return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
    }

    // In ra dữ liệu để kiểm tra trước khi gửi
    console.log("Dữ liệu gửi đi:", khuyenMaiDTO);

    try {
        // Tạo đối tượng dữ liệu để gửi
        const dataToSend = {
            MaKhuyenMai: khuyenMaiDTO.MaKhuyenMai,
            TenKhuyenMai: khuyenMaiDTO.TenKhuyenMai,
            MoTaKhuyenMai: khuyenMaiDTO.MoTaKhuyenMai,
            PhanTram: khuyenMaiDTO.PhanTram
        };

        // In ra dữ liệu JSON để kiểm tra
        console.log("JSON gửi đi:", JSON.stringify(dataToSend));

        const response = await fetch(API_ADD_KM, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        // Kiểm tra phản hồi từ server
        const data = await response.json();

        // In phản hồi từ server để kiểm tra
        console.log("Phản hồi từ server:", data);

        // Xử lý kết quả từ API
        if (data.success) {
            return { success: true, message: "Thêm khuyến mãi thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm khuyến mãi" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm khuyến mãi:", error);
        return { success: false, message: "Lỗi khi thêm khuyến mãi: " + error.message };
    }
}

// Sửa khuyến mãi
export async function updateKhuyenMai(khuyenMaiDTO) {
    try {
        const response = await fetch(API_UPDATE_KM, {
            method: "POST",  // Thay vì PUT, ta có thể dùng POST để tránh vấn đề với server không hỗ trợ PUT
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                MaKhuyenMai: khuyenMaiDTO.MaKhuyenMai,
                TenKhuyenMai: khuyenMaiDTO.TenKhuyenMai,
                MoTaKhuyenMai: khuyenMaiDTO.MoTaKhuyenMai,
                PhanTram: khuyenMaiDTO.PhanTram,
            })  // Gửi đầy đủ thông tin cần thiết
        });

        const data = await response.json();
        if (data.success) {
            return { success: true, message: "Cập nhật khuyến mãi thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi cập nhật khuyến mãi" };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật khuyến mãi:", error);
        return { success: false, message: "Lỗi khi cập nhật khuyến mãi" };
    }
}

// Xóa khuyến mãi
export async function deleteKhuyenMai(maKhuyenMai) {
    try {
        console.log("Sending delete request for MaKhuyenMai:", maKhuyenMai);
        const response = await fetch(API_DELETE_KM, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ MaKhuyenMai: maKhuyenMai })
        });

        const data = await response.json();
        console.log("Delete response:", data);
        
        if (data.success) {
            return { success: true, message: "Xóa khuyến mãi thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi xóa khuyến mãi" };
        }
    } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        return { success: false, message: "Lỗi khi xóa khuyến mãi: " + error.message };
    }
}

// Lấy danh sách hàng
export async function fetchHang() {
    try {
        const response = await fetch(API_GET_HANG);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
            return data.data;
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hãng:", error);
        return [];
    }
}

// Lấy danh sách nhà cung cấp
export async function fetchNCC() {
    try {
        const response = await fetch(API_URL_NCC);
        const data = await response.json();
        console.log("API response NCC:", data);
        
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => new NhaCungCapDTO(item.MaNhaCungCap, item.TenNhaCungCap));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi gọi API NCC:", error);
        return [];
    }
}

// Thêm nhà cung cấp
export async function addNCC(nhaCungCapDTO) {
    try {
        if (!nhaCungCapDTO.MaNhaCungCap || !nhaCungCapDTO.TenNhaCungCap) {
            console.error("Dữ liệu không hợp lệ:", nhaCungCapDTO);
            return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
        }

        console.log("Sending add request:", nhaCungCapDTO);
        const response = await fetch(API_ADD_NCC, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                MaNhaCungCap: nhaCungCapDTO.MaNhaCungCap,
                TenNhaCungCap: nhaCungCapDTO.TenNhaCungCap
            })
        });

        const data = await response.json();
        console.log("Add response:", data);
        
        if (data.success) {
            return { success: true, message: "Thêm nhà cung cấp thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm nhà cung cấp" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm nhà cung cấp:", error);
        return { success: false, message: "Lỗi khi thêm nhà cung cấp: " + error.message };
    }
}

// Sửa nhà cung cấp
export async function updateNCC(nhaCungCapDTO) {
    try {
        console.log("Sending update request:", nhaCungCapDTO);
        const response = await fetch(API_UPDATE_NCC, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                MaNhaCungCap: nhaCungCapDTO.MaNhaCungCap,
                TenNhaCungCap: nhaCungCapDTO.TenNhaCungCap
            })
        });

        const data = await response.json();
        console.log("Update response:", data);
        
        if (data.success) {
            return { success: true, message: "Cập nhật nhà cung cấp thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi cập nhật nhà cung cấp" };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật nhà cung cấp:", error);
        return { success: false, message: "Lỗi khi cập nhật nhà cung cấp: " + error.message };
    }
}

// Xóa nhà cung cấp
export async function deleteNCC(MaNhaCungCap) {
    try {
        console.log("Sending delete request for MaNhaCungCap:", MaNhaCungCap);
        const response = await fetch(API_DELETE_NCC, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ MaNhaCungCap: MaNhaCungCap })
        });

        const data = await response.json();
        console.log("Delete NCC response:", data);
        
        if (data.success) {
            return { success: true, message: "Xóa nhà cung cấp thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi xóa nhà cung cấp" };
        }
    } catch (error) {
        console.error("Lỗi khi xóa nhà cung cấp:", error);
        return { success: false, message: "Lỗi khi xóa nhà cung cấp: " + error.message };
    }
}

// Thêm hàng
export async function addHang(hangDTO) {
    try {
        console.log("Sending add request:", hangDTO);
        const response = await fetch(API_ADD_HANG, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                MaHang: hangDTO.MaHang,
                TenHang: hangDTO.TenHang
            })
        });

        const data = await response.json();
        console.log("Add response:", data);
        
        if (data.success) {
            return { success: true, message: "Thêm hàng thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm hàng" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm hàng:", error);
        return { success: false, message: "Lỗi khi thêm hàng: " + error.message };
    }
}

// Sửa hàng
export async function updateHang(hangDTO) {
    try {
        console.log("Sending update request:", hangDTO);
        const response = await fetch(API_UPDATE_HANG, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                MaHang: hangDTO.MaHang,
                TenHang: hangDTO.TenHang
            })
        });

        const data = await response.json();
        console.log("Update response:", data);
        
        if (data.success) {
            return { success: true, message: "Cập nhật hàng thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi cập nhật hàng" };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật hàng:", error);
        return { success: false, message: "Lỗi khi cập nhật hàng: " + error.message };
    }
}

// Xóa hàng
export async function deleteHang(maHang) {
    try {
        console.log("Sending delete request for:", maHang);
        const response = await fetch(API_DELETE_HANG, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                MaHang: maHang
            })
        });

        const data = await response.json();
        console.log("Delete response:", data);
        
        if (data.success) {
            return { success: true, message: "Xóa hàng thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi xóa hàng" };
        }
    } catch (error) {
        console.error("Lỗi khi xóa hàng:", error);
        return { success: false, message: "Lỗi khi xóa hàng: " + error.message };
    }
}

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
