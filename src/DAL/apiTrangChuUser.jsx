import axios from 'axios';

const API_BASE_URL = 'http://localhost/web2/server/api/TrangChuUser';

/**
 * Lấy danh sách hàng hóa theo mã thể loại từ API.
 * @param {string | number} maTheLoai Mã thể loại cần lấy hàng hóa.
 * @returns {Promise<Array|null>} Promise trả về một mảng các đối tượng hàng hóa hoặc null nếu có lỗi.
 */
export const getHangHoaTheoTheLoai = async (maTheLoai) => {
    // Kiểm tra xem maTheLoai có được cung cấp không
    if (!maTheLoai) {
        console.error("Mã thể loại là bắt buộc.");
        return null; 
    }

    try {
        // Tạo URL với query parameter
        const url = `${API_BASE_URL}/getHangHoaTheoTheLoai.php?maTheLoai=${encodeURIComponent(maTheLoai)}`;

        // Gửi request GET bằng axios
        const response = await axios.get(url);

        // Kiểm tra response từ API backend
        if (response.data && response.data.success) {
            // Trả về mảng dữ liệu hàng hóa
            return response.data.data;
        } else {
            // Log lỗi nếu API trả về success: false hoặc cấu trúc không đúng
            console.error("Lỗi từ API:", response.data.message || "Không lấy được dữ liệu hàng hóa.");
            return null;
        }
    } catch (error) {
        // Log lỗi mạng hoặc lỗi trong quá trình xử lý request
        console.error("Lỗi khi gọi API getHangHoaTheoTheLoai:", error);
        // Có thể xử lý lỗi cụ thể hơn (ví dụ: error.response?.status)
        return null; // Trả về null khi có lỗi
    }
};

/**
 * Lấy danh sách tất cả chủng loại và thể loại tương ứng từ API.
 * @returns {Promise<Array|null>} Promise trả về một mảng các đối tượng chủng loại/thể loại hoặc null nếu có lỗi.
 */
export const getChungLoaiVaTheLoai = async () => {
    try {
        // URL của API endpoint
        const url = `${API_BASE_URL}/getChungLoaiVaTheLoai.php`;

        // Gửi request GET bằng axios
        const response = await axios.get(url);

        // Kiểm tra response từ API backend
        if (response.data && response.data.success) {
            // Trả về mảng dữ liệu chủng loại và thể loại
            return response.data.data;
        } else {
            // Log lỗi nếu API trả về success: false hoặc cấu trúc không đúng
            console.error("Lỗi từ API getChungLoaiVaTheLoai:", response.data.message || "Không lấy được dữ liệu chủng loại/thể loại.");
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API getChungLoaiVaTheLoai:", error);
        return null; 
    }
};    

export const getAllHangHoa = async (tenSanPham = '') => { // Accept tenSanPham, default to empty string
    try {
      let url = `${API_BASE_URL}/getAllHangHoa.php`;
      if (tenSanPham) {
        url += `?tenSanPham=${encodeURIComponent(tenSanPham)}`; // Add parameter if provided
      }
      const response = await axios.get(url); 
      console.log("Response from getAllHangHoa:", response.data); // Log the response for debugging
      // Assuming your PHP script returns the data directly, not nested under a 'data' or 'success' key
      // If it does, you might need: return response.data.data; or similar
      return response.data; 
    } catch (error) {
      console.error("Error fetching all products:", error);
      // Consider how your PHP script handles errors and what it returns.
      // If it returns JSON with an error message, you might want to parse that.
      return []; // Return empty array on error or if no products found
    }
  };