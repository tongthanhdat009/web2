const API_URL_HANGHOA = "http://localhost/web2/server/api/getHangHoa.php";

const API_UPDATE_HANGHOA = "http://localhost/web2/server/api/updateHangHoa.php";
const API_ADD_HANGHOA = "http://localhost/web2/server/api/addHangHoa.php";
//api the loai
const API_URL_THELOAI = "http://localhost/web2/server/api/getTheLoai.php";
//API endpoints for ChungLoai
const API_URL_CL = "http://localhost/web2/server/api/getChungLoai.php"
const API_UPDATE_CL = "http://localhost/web2/server/api/updateChungLoai.php"

//API endpoints for PhieuNhap
const API_URL_PHIEUNHAP = "http://localhost/web2/server/api/getPhieuNhap.php";
const API_ADD_PHIEUNHAP = "http://localhost/web2/server/api/addPhieuNhap.php";
const API_UPDATE_PHIEUNHAP = "http://localhost/web2/server/api/updatePhieuNhap.php";
const API_URL_KHOHANG = "http://localhost/web2/server/api/getKhoHang.php";
const API_ADD_KHOHANG = "http://localhost/web2/server/api/addKhoHang.php";

//API endpoints for ChiTietPhieuNhap
const API_URL_CHITIETPHIEUNHAP = "http://localhost/web2/server/api/getChiTietPhieuNhap.php";
const API_ADD_CHITIETPHIEUNHAP = "http://localhost/web2/server/api/addChiTietPhieuNhap.php";

//API endpoints for KhoiLuongTa
const API_URL_KHOILUONGTA = "http://localhost/web2/server/api/getKhoiLuongTa.php";
const API_ADD_KHOILUONGTA = "http://localhost/web2/server/api/addKhoiLuongTa.php";

//API endpoints for KichThuocQuanAo
const API_URL_KICHTHUOCQUANAO = "http://localhost/web2/server/api/getKichThuocQuanAo.php";
const API_ADD_KICHTHUOCQUANAO = "http://localhost/web2/server/api/addKichThuocQuanAo.php";

//API endpoints for KichThuocGiay
const API_URL_KICHTHUOCGIAY = "http://localhost/web2/server/api/getKichThuocGiay.php";
const API_ADD_KICHTHUOCGIAY = "http://localhost/web2/server/api/addKichThuocGiay.php";

//API endpoints for KhuyenMai
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

// API endpoints cho Chức Năng
const API_URL_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/getAllChucNang.php";
const API_ADD_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/addChucNang.php";
const API_UPDATE_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/updateChucNang.php";
const API_DELETE_CHUC_NANG = "http://localhost/web2/server/api/QuanLyPhanQuyen/deleteChucNang.php";

import KhuyenMaiDTO from "../DTO/KhuyenMaiDTO";
import NhaCungCapDTO from "../DTO/NhaCungCapDTO";
import HangHoaDTO from "../DTO/HangHoaDTO";
import ChungLoaiDTO from "../DTO/ChungLoaiDTO";
import PhieuNhapDTO from "../DTO/PhieuNhapDTO";
import KhoHangDTO from "../DTO/KhoHangDTO";
import TheLoaiDTO from "../DTO/TheLoaiDTO";
import ChiTietPhieuNhapDTO from "../DTO/ChiTietPhieuNhapDTO";
import KhoiLuongTaDTO from "../DTO/KhoiLuongTaDTO";
import KichThuocQuanAoDTO from "../DTO/KichThuocQuanAoDTO";
import KichThuocGiayDTO from "../DTO/KichThuocGiayDTO";
import PhanQuyenDTO from "../DTO/PhanQuyenDTO";
import ChucNangDTO from "../DTO/ChucNangDTO";

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

export async function addHangHoa(HangHoaDTO) {
    // Kiểm tra nếu dữ liệu đầu vào đầy đủ và hợp lệ
    if (!HangHoaDTO.MaHangHoa || !HangHoaDTO.TenHangHoa || !HangHoaDTO.MaChungLoai || !HangHoaDTO.MaHang) {
        console.error("Dữ liệu không hợp lệ:", HangHoaDTO);
        return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
    }

    // In ra dữ liệu trước khi gửi
    console.log("Dữ liệu gửi đi:", HangHoaDTO);

    try {
        // Tạo đối tượng dữ liệu để gửi
        const dataToSend = {
            MaHangHoa: HangHoaDTO.MaHangHoa,
            TenHangHoa: HangHoaDTO.TenHangHoa,
            MaChungLoai: HangHoaDTO.MaChungLoai,
            MaHang: HangHoaDTO.MaHang,
            MaKhuyenMai: HangHoaDTO.MaKhuyenMai || null,
            MoTa: HangHoaDTO.MoTa || null,
            ThoiGianBaoHanh: HangHoaDTO.ThoiGianBaoHanh || null,
            Anh: HangHoaDTO.Anh || null,
            TrangThai: HangHoaDTO.TrangThai 
        };

        // In ra dữ liệu JSON trước khi gửi
        console.log("JSON gửi đi:", JSON.stringify(dataToSend));

        const response = await fetch('http://localhost/web2/server/api/addHangHoa.php', {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        // Thử parse phản hồi về JSON, nếu lỗi sẽ bắt ở catch
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("Phản hồi không phải JSON:", text);
            return { success: false, message: "Phản hồi server không phải JSON hợp lệ" };
        }

        console.log("Phản hồi từ server:", data);

        // Xử lý kết quả từ API
        if (data.success) {
            return { success: true, message: "Thêm hàng hóa thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm hàng hóa" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm hàng hóa:", error);
        return { success: false, message: "Lỗi khi thêm hàng hóa: " + error.message };
    }
}

export async function updateHangHoa(hangHoaDTO) {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!hangHoaDTO.MaHangHoa || !hangHoaDTO.TenHangHoa || !hangHoaDTO.MaChungLoai || !hangHoaDTO.MaHang) {
            console.error("Dữ liệu không hợp lệ:", hangHoaDTO);
            return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
        }

        // Tạo đối tượng dữ liệu để gửi
        const dataToSend = {
            MaHangHoa: hangHoaDTO.MaHangHoa,
            TenHangHoa: hangHoaDTO.TenHangHoa,
            MaChungLoai: hangHoaDTO.MaChungLoai,
            MaHang: hangHoaDTO.MaHang,
            MaKhuyenMai: hangHoaDTO.MaKhuyenMai || null,
            MoTa: hangHoaDTO.MoTa || null,
            ThoiGianBaoHanh: hangHoaDTO.ThoiGianBaoHanh || null,
            Anh: hangHoaDTO.Anh || null,
            TrangThai: hangHoaDTO.TrangThai 
        };

        console.log("Sending update request:", dataToSend);
        const response = await fetch(API_UPDATE_HANGHOA, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        const data = await response.json();
        console.log("Update response:", data);
        
        if (data.success) {
            return { success: true, message: "Cập nhật hàng hóa thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi cập nhật hàng hóa" };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật hàng hóa:", error);
        return { success: false, message: "Lỗi khi cập nhật hàng hóa: " + error.message };
    }
}


//chungloai
export async function fetchChungLoai() {
    try {
        const response = await fetch(API_URL_CL);
        const data = await response.json();
        console.log("API response:", data);
        return (data.data || []).map(item => new ChungLoaiDTO({
            MaChungLoai: item.MaChungLoai,
            TenChungLoai: item.TenChungLoai,
            MaTheLoai: item.MaTheLoai,
            TenTheLoai: item.TenTheLoai
        })
        );
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return [];
    }
}

export async function addChungLoai(ChungLoaiDTO) {
    // Kiểm tra nếu dữ liệu đầu vào đầy đủ và hợp lệ
    if (!ChungLoaiDTO.MaChungLoai || !ChungLoaiDTO.TenChungLoai || !ChungLoaiDTO.MaTheLoai) {
        console.error("Dữ liệu không hợp lệ:", ChungLoaiDTO);
        return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
    }

    // In ra dữ liệu để kiểm tra trước khi gửi
    console.log("Dữ liệu gửi đi:", ChungLoaiDTO);

    try {
        // Tạo đối tượng dữ liệu để gửi
        const dataToSend = {
            MaChungLoai: ChungLoaiDTO.MaChungLoai,
            TenChungLoai: ChungLoaiDTO.TenChungLoai,
            MaTheLoai: ChungLoaiDTO.MaTheLoai
        };

        // In ra dữ liệu JSON để kiểm tra
        console.log("JSON gửi đi:", JSON.stringify(dataToSend));

        const response = await fetch('http://localhost/web2/server/api/addChungLoai.php', {
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
            return { success: true, message: "Thêm chủng loại thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm chủng loại" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm chủng loại:", error);
        return { success: false, message: "Lỗi khi thêm chủng loại: " + error.message };
    }
}

export async function updateChungLoai(ChungLoaiDTO) {
    try {
        const response = await fetch(API_UPDATE_CL, {
            method: "POST",  // Thay vì PUT, ta có thể dùng POST để tránh vấn đề với server không hỗ trợ PUT
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                MaChungLoai: ChungLoaiDTO.MaChungLoai,
                TenChungLoai: ChungLoaiDTO.TenChungLoai,
                MaTheLoai: ChungLoaiDTO.MaTheLoai
            })  // Gửi đầy đủ thông tin cần thiết
        });

        const data = await response.json();
        if (data.success) {
            return { success: true, message: "Cập nhật chủng loại thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi cập nhật chủng loại" };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật chủng loạii:", error);
        return { success: false, message: "Lỗi khi cập nhật chủng loại" };
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
// Lấy danh sách thể loại
export async function fetchTheLoai() {
    try {
        const response = await fetch(API_URL_THELOAI);
        const data = await response.json();
        console.log("API response TheLoai:", data);
        
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => new TheLoaiDTO({
                MaTheLoai: item.MaTheLoai,
                TenTheLoai: item.TenTheLoai
            }));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thể loại:", error);
        return [];
    }
}


// Lấy danh sách phiếu nhập
export async function fetchPhieuNhap(timeFrame = 'fetch') {
    try {
        const response = await fetch(`${API_URL_PHIEUNHAP}?timeFrame=${timeFrame}`);
        const data = await response.json();
        console.log("API response PhieuNhap:", data);
        
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => new PhieuNhapDTO({
                MaPhieuNhap: item.MaPhieuNhap,
                TrangThai: item.TrangThai,
                IDTaiKhoan: item.IDTaiKhoan,
                MaNhaCungCap: item.MaNhaCungCap,
                NgayNhap: item.NgayNhap,
            }));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu nhập:", error);
        return [];
    }
}

// Thêm phiếu nhập
export async function addPhieuNhap(phieuNhapDTO) {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!phieuNhapDTO.TrangThai || !phieuNhapDTO.IDTaiKhoan || !phieuNhapDTO.MaNhaCungCap || !phieuNhapDTO.NgayNhap) {
            console.error("Dữ liệu không hợp lệ:", phieuNhapDTO);
            return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
        }

        console.log("Sending add request:", phieuNhapDTO);
        const response = await fetch(API_ADD_PHIEUNHAP, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                TrangThai: phieuNhapDTO.TrangThai,
                IDTaiKhoan: phieuNhapDTO.IDTaiKhoan,
                MaNhaCungCap: phieuNhapDTO.MaNhaCungCap,
                NgayNhap: phieuNhapDTO.NgayNhap
            })
        });

        const data = await response.json();
        console.log("Add response:", data);
        
        if (data.success) {
            return { 
                success: true, 
                message: "Thêm phiếu nhập thành công!",
                data: new PhieuNhapDTO(data)
            };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm phiếu nhập" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm phiếu nhập:", error);
        return { success: false, message: "Lỗi khi thêm phiếu nhập: " + error.message };
    }
}

// Cập nhật phiếu nhập
export async function updatePhieuNhap(phieuNhapDTO) {
    try {
        console.log("Sending update request:", phieuNhapDTO);
        const response = await fetch(API_UPDATE_PHIEUNHAP, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                MaPhieuNhap: phieuNhapDTO.MaPhieuNhap,
                TrangThai: phieuNhapDTO.TrangThai
            })
        });

        const data = await response.json();
        console.log("Update response:", data);
        
        if (data.success) {
            return { success: true, message: "Cập nhật phiếu nhập thành công!" };
        } else {
            return { success: false, message: data.message || "Lỗi khi cập nhật phiếu nhập" };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật phiếu nhập:", error);
        return { success: false, message: "Lỗi khi cập nhật phiếu nhập: " + error.message };
    }
}

// Lấy danh sách kho hàng
export async function fetchKhoHang(IDChiTietPhieuNhap) {
    try {
        const url = IDChiTietPhieuNhap 
            ? `${API_URL_KHOHANG}?IDChiTietPhieuNhap=${IDChiTietPhieuNhap}`
            : API_URL_KHOHANG;
            
        const response = await fetch(url);
        const data = await response.json();
        console.log("API response KhoHang:", data);
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => ({
                ...new KhoHangDTO({
                    Seri: item.Seri,
                    TinhTrang: item.TinhTrang,
                    IDChiTietPhieuNhap: item.IDChiTietPhieuNhap,
                }),
            }));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách kho hàng:", error);
        return [];
    }
}

// Thêm kho hàng
export async function addKhoHang(khoHangDTO) {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!khoHangDTO.IDChiTietPhieuNhap || !khoHangDTO.TinhTrang) {
            console.error("Dữ liệu không hợp lệ:", khoHangDTO);
            return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
        }

        console.log("Sending add request:", khoHangDTO);
        const response = await fetch(API_ADD_KHOHANG, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                Seri: khoHangDTO.Seri,
                TinhTrang: khoHangDTO.TinhTrang,
                IDChiTietPhieuNhap: khoHangDTO.IDChiTietPhieuNhap
            })
        });

        const data = await response.json();
        console.log("Add response:", data);
        
        if (data.success) {
            return { 
                success: true, 
                message: "Thêm kho hàng thành công!",
                data: new KhoHangDTO(data.data)
            };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm kho hàng" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm kho hàng:", error);
        return { success: false, message: "Lỗi khi thêm kho hàng: " + error.message };
    }
}

// Lấy danh sách khối lượng tạ
export async function fetchKhoiLuongTa() {
    try {
        const response = await fetch(API_URL_KHOILUONGTA);
        const data = await response.json();
        console.log("API response KhoiLuongTa:", data);
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => ({
                ...new KhoiLuongTaDTO({
                    IDKhoiLuongTa: item.IDKhoiLuongTa,
                    KhoiLuong: item.KhoiLuong
                }),
            }));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khối lượng tạ:", error);
        return [];
    }
}

// Lấy danh sách kích thước quần áo
export async function fetchKichThuocQuanAo() {
    try {
        const response = await fetch(API_URL_KICHTHUOCQUANAO);
        const data = await response.json();
        console.log("API response KichThuocQuanAo:", data);
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => ({
                ...new KichThuocQuanAoDTO({
                    IDKichThuocQuanAo: item.IDKichThuocQuanAo,
                    KichThuocQuanAo: item.KichThuocQuanAo
                }),
            }));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách kích thước quần áo:", error);
        return [];
    }
}

// Lấy danh sách kích thước giày
export async function fetchKichThuocGiay() {
    try {
        const response = await fetch(API_URL_KICHTHUOCGIAY);
        const data = await response.json();
        console.log("API response KichThuocGiay:", data);
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => ({
                ...new KichThuocGiayDTO({
                    IDKichThuocGiay: item.IDKichThuocGiay,
                    KichThuocGiay: item.KichThuocGiay
                }),
            }));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách kích thước giày:", error);
        return [];
    }
}

// Lấy danh sách chi tiết phiếu nhập
export async function fetchChiTietPhieuNhap(MaPhieuNhap) {
    try {
        const url = MaPhieuNhap 
            ? `${API_URL_CHITIETPHIEUNHAP}?MaPhieuNhap=${MaPhieuNhap}`
            : API_URL_CHITIETPHIEUNHAP;

        const response = await fetch(url);
        const data = await response.json();
        console.log("API response ChiTietPhieuNhap:", data);
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => ({
                ...new ChiTietPhieuNhapDTO({
                    IDChiTietPhieuNhap: item.IDChiTietPhieuNhap,
                    MaPhieuNhap: item.MaPhieuNhap,
                    MaHangHoa: item.MaHangHoa,
                    IDKhoiLuongTa: item.IDKhoiLuongTa,
                    IDKichThuocQuanAo: item.IDKichThuocQuanAo,
                    IDKichThuocGiay: item.IDKichThuocGiay,
                    GiaNhap: item.GiaNhap,
                    GiaBan: item.GiaBan,
                    SoLuongNhap: item.SoLuongNhap,
                    SoLuongTon: item.SoLuongTon
                }),
                TenHangHoa: item.TenHangHoa,
                TenHang: item.TenHang,
                KhoiLuong: item.KhoiLuong,
                KichThuocQuanAo: item.KichThuocQuanAo,
                KichThuocGiay: item.KichThuocGiay
            }));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết phiếu nhập:", error);
        return [];
    }
}

// Thêm chi tiết phiếu nhập
export async function addChiTietPhieuNhap(chiTietPhieuNhapDTO) {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!chiTietPhieuNhapDTO.MaPhieuNhap || !chiTietPhieuNhapDTO.MaHangHoa || !chiTietPhieuNhapDTO.GiaNhap || !chiTietPhieuNhapDTO.GiaBan || !chiTietPhieuNhapDTO.SoLuongNhap || !chiTietPhieuNhapDTO.SoLuongTon) {
            console.error("Dữ liệu không hợp lệ:", chiTietPhieuNhapDTO);
            return { success: false, message: "Dữ liệu không hợp lệ hoặc thiếu thông tin" };
        }

        console.log("Sending add request:", chiTietPhieuNhapDTO);
        const response = await fetch(API_ADD_CHITIETPHIEUNHAP, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                IDChiTietPhieuNhap: chiTietPhieuNhapDTO.IDChiTietPhieuNhap,
                MaPhieuNhap: chiTietPhieuNhapDTO.MaPhieuNhap,
                MaHangHoa: chiTietPhieuNhapDTO.MaHangHoa,
                IDKhoiLuongTa: chiTietPhieuNhapDTO.IDKhoiLuongTa,
                IDKichThuocQuanAo: chiTietPhieuNhapDTO.IDKichThuocQuanAo,
                IDKichThuocGiay: chiTietPhieuNhapDTO.IDKichThuocGiay,
                GiaNhap: chiTietPhieuNhapDTO.GiaNhap,
                GiaBan: chiTietPhieuNhapDTO.GiaBan,
                SoLuongNhap: chiTietPhieuNhapDTO.SoLuongNhap,
                SoLuongTon: chiTietPhieuNhapDTO.SoLuongTon
            })
        });

        const data = await response.json();
        console.log("Add response:", data);
        
        if (data.success) {
            return { 
                success: true, 
                message: "Thêm chi tiết phiếu nhập thành công!",
                data: new ChiTietPhieuNhapDTO(data.data)
            };
        } else {
            return { success: false, message: data.message || "Lỗi khi thêm chi tiết phiếu nhập" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm chi tiết phiếu nhập:", error);
        return { success: false, message: "Lỗi khi thêm chi tiết phiếu nhập: " + error.message };
    }
}

// Lấy danh sách tất cả các quyền (không phân trang, dùng cho dropdowns, etc.)
export async function fetchAllQuyen() {
    try {
        const response = await fetch(API_URL_QUYEN, {
            credentials: 'include'
        });
        const data = await response.json(); console.log("API response Quyen:", data);
        if (response.ok) {
            const rolesData = Array.isArray(data) ? data : (data.data || []);
            return {
                success: true,
                data: rolesData.map(role => new PhanQuyenDTO(role))
            };
        } else {
            return {
                success: false,
                message: data.message || "Lỗi khi lấy danh sách tất cả quyền",
                code: data.code
            };
        }
    } catch (error) {
        console.error("Lỗi khi gọi API lấy tất cả quyền:", error);
        return {
            success: false,
            message: "Lỗi kết nối khi lấy danh sách tất cả quyền"
        };
    }
}

// Lấy danh sách tất cả các chức năng
export async function getAllChucNang() {
    try {
        const response = await fetch(API_URL_CHUC_NANG, {
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok && result.data) {
            return {
                success: true,
                data: result.data.map(cn => new ChucNangDTO(cn))
            };
        } else {
            return {
                success: false,
                message: result.message || "Lỗi khi lấy danh sách chức năng",
            };
        }
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách chức năng:", error);
        return {
            success: false,
            message: "Lỗi kết nối khi lấy danh sách chức năng"
        };
    }
}

// // Thêm chức năng mới
// export async function addChucNang(chucNangData) {
//     try {
//         const response = await fetch(API_ADD_CHUC_NANG, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             credentials: 'include',
//             body: JSON.stringify(chucNangData.toApiAddData())
//         });
//         const data = await response.json();
//         if (data.success) {
//             return { 
//                 success: true, 
//                 message: "Thêm chức năng thành công!",
//                 data: new ChucNangDTO(data.data)
//             };
//         } else {
//             return { 
//                 success: false, 
//                 message: data.message || "Lỗi khi thêm chức năng"
//             };
//         }
//     } catch (error) {
//         console.error("Lỗi khi thêm chức năng:", error);
//         return { 
//             success: false, 
//             message: "Lỗi kết nối khi thêm chức năng"
//         };
//     }
// }

// // Cập nhật chức năng
// export async function updateChucNang(chucNangData) {
//     try {
//         const response = await fetch(API_UPDATE_CHUC_NANG, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             credentials: 'include',
//             body: JSON.stringify(chucNangData.toApiUpdateData())
//         });
//         const data = await response.json();
//         if (data.success) {
//             return { 
//                 success: true, 
//                 message: "Cập nhật chức năng thành công!"
//             };
//         } else {
//             return { 
//                 success: false, 
//                 message: data.message || "Lỗi khi cập nhật chức năng"
//             };
//         }
//     } catch (error) {
//         console.error("Lỗi khi cập nhật chức năng:", error);
//         return { 
//             success: false, 
//             message: "Lỗi kết nối khi cập nhật chức năng"
//         };
//     }
// }

// // Xóa chức năng
// export async function deleteChucNang(idChucNang) {
//     try {
//         const response = await fetch(API_DELETE_CHUC_NANG, {
//             method: "DELETE",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             credentials: 'include',
//             body: JSON.stringify({ IDChucNang: idChucNang })
//         });
//         const data = await response.json();
//         if (data.success) {
//             return { 
//                 success: true, 
//                 message: "Xóa chức năng thành công!"
//             };
//         } else {
//             return { 
//                 success: false, 
//                 message: data.message || "Lỗi khi xóa chức năng"
//             };
//         }
//     } catch (error) {
//         console.error("Lỗi khi xóa chức năng:", error);
//         return { 
//             success: false, 
//             message: "Lỗi kết nối khi xóa chức năng"
//         };
//     }
// }

// Thêm quyền mới
export async function addQuyen(quyenData) {
    try {
        // Validate data
        if (!quyenData.TenQuyen) {
            return { 
                success: false, 
                message: "Tên quyền không được để trống" 
            };
        }

        // Creating payload 
        const payload = {
            TenQuyen: quyenData.TenQuyen,
            ChucNang: quyenData.ChucNang || []
        };

        const response = await fetch(API_ADD_QUYEN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: 'include', 
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok) {
            return { 
                success: true, 
                message: "Thêm quyền thành công!",
                data: {
                    IDQuyen: data.IDQuyen,
                    TenQuyen: quyenData.TenQuyen,
                    ChucNang: quyenData.ChucNang || []
                }
            };
        } else {
            return { 
                success: false, 
                message: data.message || "Lỗi khi thêm quyền" 
            };
        }
    } catch (error) {
        console.error("Lỗi khi thêm quyền:", error);
        return { 
            success: false, 
            message: "Lỗi kết nối khi thêm quyền" 
        };
    }
}

// Cập nhật quyền
export async function updateQuyen(quyenData) {
    try {
        // Validate data
        if (!quyenData.IDQuyen) {
            return { 
                success: false, 
                message: "ID quyền không được để trống" 
            };
        }

        // Creating payload
        const payload = {
            IDQuyen: quyenData.IDQuyen,
            TenQuyen: quyenData.TenQuyen,
            ChucNang: quyenData.ChucNang || []
        };

        const response = await fetch(API_UPDATE_QUYEN, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok) {
            return { 
                success: true, 
                message: "Cập nhật quyền thành công!" 
            };
        } else {
            return { 
                success: false, 
                message: data.message || "Lỗi khi cập nhật quyền" 
            };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật quyền:", error);
        return { 
            success: false, 
            message: "Lỗi kết nối khi cập nhật quyền" 
        };
    }
}

// Xóa quyền
export async function deleteQuyen(idQuyen) {
    try {
        const response = await fetch(API_DELETE_QUYEN, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ IDQuyen: idQuyen })
        });

        const data = await response.json();
        
        if (response.ok) {
            return { 
                success: true, 
                message: "Xóa quyền thành công!" 
            };
        } else {
            return { 
                success: false, 
                message: data.message || "Lỗi khi xóa quyền" 
            };
        }
    } catch (error) {
        console.error("Lỗi khi xóa quyền:", error);
        return { 
            success: false, 
            message: "Lỗi kết nối khi xóa quyền" 
        };
    }
}












