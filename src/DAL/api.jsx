const API_URL = "http://localhost/web2/server/api/getHangHoa.php";
import HangHoaDTO from "../DTO/HangHoaDTO";
export async function fetchHangHoa() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("API response:", data);

        // Đảm bảo dữ liệu là mảng và mapping sang DTO
        return (data.data || []).map(item => new HangHoaDTO(item));
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return []; // Trả về mảng rỗng nếu lỗi
    }
}