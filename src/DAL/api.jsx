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
const API_URL_KHOHANG = "http://localhost/web2/server/api/getKhoHang.php";
const API_ADD_KHOHANG = "http://localhost/web2/server/api/addKhoHang.php";

//API endpoints for KhuyenMai

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



import KhuyenMaiDTO from "../DTO/KhuyenMaiDTO";

import NhaCungCapDTO from "../DTO/NhaCungCapDTO";
import HangHoaDTO from "../DTO/HangHoaDTO";

import ChungLoaiDTO from "../DTO/ChungLoaiDTO";
import PhieuNhapDTO from "../DTO/PhieuNhapDTO";
import KhoHangDTO from "../DTO/KhoHangDTO";
import TheLoaiDTO from "../DTO/TheLoaiDTO";




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

// Lấy danh sách kho hàng
export async function fetchKhoHang(MaPhieuNhap) {
    try {
        const url = MaPhieuNhap 
            ? `${API_URL_KHOHANG}?MaPhieuNhap=${MaPhieuNhap}`
            : API_URL_KHOHANG;
            
        const response = await fetch(url);
        const data = await response.json();
        console.log("API response KhoHang:", data);
        if (data.success && Array.isArray(data.data)) {
            return data.data.map(item => ({
                ...new KhoHangDTO({
                    Seri: item.Seri,
                    MaPhieuNhap: item.MaPhieuNhap,
                    MaHangHoa: item.MaHangHoa,
                    GiaNhap: item.GiaNhap,
                    GiaBan: item.GiaBan,
                    TinhTrang: item.TinhTrang
                }),
                TenHangHoa: item.TenHangHoa,
                TenHang: item.TenHang,
                TenNhaCungCap: item.TenNhaCungCap
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
        if (!khoHangDTO.MaPhieuNhap || !khoHangDTO.MaHangHoa || !khoHangDTO.GiaNhap || !khoHangDTO.GiaBan) {
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
                MaPhieuNhap: khoHangDTO.MaPhieuNhap,
                MaHangHoa: khoHangDTO.MaHangHoa,
                GiaNhap: khoHangDTO.GiaNhap,
                GiaBan: khoHangDTO.GiaBan,
                TinhTrang: khoHangDTO.TinhTrang || 0 // Mặc định là 0 nếu không có giá trị
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



