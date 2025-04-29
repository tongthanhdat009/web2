const LAY_CHI_TIET_HANG_HOA = "http://localhost/web2/server/api/ChiTietHangHoa/getChiTietHangHoa.php";
const THEM_VAO_GIO_HANG = "http://localhost/web2/server/api/ChiTietHangHoa/addToCart.php";
export async function chiTietHangHoa(maHangHoa) {   
    try {
        const response = await fetch(LAY_CHI_TIET_HANG_HOA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ MaHangHoa: maHangHoa }),  // Gửi mã hàng hóa cho API
        });

        if (!response.ok) {
            throw new Error("Lỗi khi gọi API");
        }

        const data = await response.json();
        console.log("Dữ liệu chi tiết hàng hóa:", data);  // In dữ liệu ra console để kiểm tra
        return data;  // Trả về dữ liệu chi tiết sản phẩm
    } catch (error) {
        console.error("Lỗi gọi API chi tiết hàng hóa:", error);
        return null;  // Trả về null nếu có lỗi
    }
}

export async function addToCart(
    IDTaiKhoan,
    MaHangHoa,
    SoLuong,
    IDKhoiLuongTa = 0,
    IDKichThuocQuanAo = 0,
    IDKichThuocGiay = 0
  ) 
{
  console.log(IDTaiKhoan, MaHangHoa, SoLuong, IDKhoiLuongTa, IDKichThuocQuanAo, IDKichThuocGiay);
    try {
      const response = await fetch(THEM_VAO_GIO_HANG, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IDTaiKhoan,
          MaHangHoa: MaHangHoa,
          SoLuong,
          IDKhoiLuongTa,
          IDKichThuocQuanAo,
          IDKichThuocGiay
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Kết quả addToCart:", result);
      return result;
    } catch (error) {
      console.error("Lỗi addToCart:", error);
      return { success: false, error: error.message };
    }
}