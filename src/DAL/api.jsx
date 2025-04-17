const API_URL_HANGHOA = "http://localhost/web2/server/api/getHangHoa.php";
//API endpoints for KhuyenMai
const API_URL_KM = "http://localhost/web2/server/api/getKhuyenMai.php";
const API_ADD_KM = "http://localhost/web2/server/api/addKhuyenMai.php";
const API_DELETE_KM = "http://localhost/web2/server/api/deleteKhuyenMai.php";
const API_UPDATE_KM = "http://localhost/web2/server/api/updateKhuyenMai.php";

// API endpoints for Hang
const API_GET_HANG = "http://localhost/web2/server/api/getHang.php";
const API_ADD_HANG = "http://localhost/web2/server/api/addHang.php";
const API_UPDATE_HANG = "http://localhost/web2/server/api/updateHang.php";
const API_DELETE_HANG = "http://localhost/web2/server/api/deleteHang.php";

// API endpoints for NCC
const API_URL_NCC = "http://localhost/web2/server/api/getNCC.php";
const API_ADD_NCC = "http://localhost/web2/server/api/addNCC.php";
const API_DELETE_NCC = "http://localhost/web2/server/api/deleteNCC.php";
const API_UPDATE_NCC = "http://localhost/web2/server/api/updateNCC.php";

import KhuyenMaiDTO from "../DTO/KhuyenMaiDTO";
import HangDTO from "../DTO/HangDTO";
import NhaCungCapDTO from "../DTO/NhaCungCapDTO";
import HangHoaDTO from "../DTO/HangHoaDTO";

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
