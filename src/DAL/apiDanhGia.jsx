const GET_DANH_GIA = "http://localhost/web2/server/api/DanhGia/getDanhGia.php";
const ADD_DANH_GIA = "http://localhost/web2/server/api/DanhGia/addDanhGia.php";
export async function getDanhGia(MaHangHoa) {
    try {
        // Tạo URL với MaHangHoa là query parameter
       const response = await fetch(`${GET_DANH_GIA}?MaHangHoa=${MaHangHoa}`, {
            method: "GET", // Sử dụng phương thức GET
            headers: {
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: `Lỗi HTTP: ${response.status}` };
            }
            console.error("Lỗi API getDanhGia:", response.status, errorData);
            throw new Error(errorData.error || errorData.message || `Lỗi khi gọi API lấy đánh giá: ${response.status}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Lỗi trong hàm getDanhGia:", error);
        return { success: false, error: error.message, data: [] }; 
    }
}
export async function addDanhGia(reviewData) { // reviewData is an object
    try {
        const response = await fetch(ADD_DANH_GIA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Accept": "application/json" // Optional, but good practice
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                // If the error response is not JSON (e.g., HTML error page from server)
                const textError = await response.text();
                errorData = { message: `Lỗi HTTP: ${response.status}. Phản hồi không phải JSON: ${textError}` };
            }
            console.error("Lỗi API addDanhGia:", response.status, errorData);
            // Return an object that matches the expected error structure if possible
            return { 
                success: false, 
                error: errorData.error || errorData.message || `Lỗi khi gửi đánh giá: ${response.status}`,
                details: errorData.details 
            };
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Lỗi trong hàm addDanhGia:", error);
        return { success: false, error: error.message || "Lỗi kết nối hoặc lỗi không xác định khi gửi đánh giá." };
    }
}