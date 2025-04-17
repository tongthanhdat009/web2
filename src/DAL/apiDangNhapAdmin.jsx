const KIEM_TRA_DANG_NHAP_ADMIN = "http://localhost/web2/server/api/kiemTraDangNhapAdmin.php";
const LAY_THONG_TIN_DANG_NHAP_ADMIN = "http://localhost/web2/server/api/layThongTinDangNhapAdmin.php";

export async function dangNhap(tenTaiKhoan, matKhau) {
  try {
    const response = await fetch(KIEM_TRA_DANG_NHAP_ADMIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenTaiKhoan, matKhau }), // Đảm bảo dữ liệu JSON đúng
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi đăng nhập");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function layThongTinTaiKhoan(idTaiKhoan) {
  try {
    const response = await fetch(LAY_THONG_TIN_DANG_NHAP_ADMIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idTaiKhoan }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch account info: ${errorMessage}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return data;
    } else {
      throw new Error("Không tìm thấy dữ liệu");
    }
  } catch (error) {
    console.error("Error fetching account info:", error);
    throw error;
  }
}
