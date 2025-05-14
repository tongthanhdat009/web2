const GET_ALL_DANH_GIA = "http://localhost/web2/server/api/QuanLyDanhGia/getAllDanhGia.php";
const DUYET_DANH_GIA = "http://localhost/web2/server/api/QuanLyDanhGia/duyetDanhGia.php";
const XOA_DANH_GIA = "http://localhost/web2/server/api/QuanLyDanhGia/deleteDanhGia.php";

export async function getAllDanhGia() {
  try {
        const response = await fetch(GET_ALL_DANH_GIA, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Network response was not ok and no JSON error body" }));
          console.error("API Error in getAllDanhGia:", errorData);
          throw new Error(errorData.error || "Network response was not ok");
        }

        const data = await response.json();
        // console.log("Dữ liệu từ API getAllDanhGia:", data); // Bỏ console.log ở đây, nên log ở component nếu cần
        return data;
    } 
    catch (error) {
        console.error("Error fetching data in getAllDanhGia:", error);
        // Trả về một object lỗi chuẩn hóa để component dễ xử lý
        return { success: false, error: error.message || "Unknown error occurred" };
    }
}

export async function duyetDanhGiaAPI(idDanhGia) {
  try {
    const response = await fetch(DUYET_DANH_GIA, {
      method: "POST", // Hoặc PUT, tùy theo cấu hình server
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IDDanhGia: idDanhGia }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      console.error("API Error in duyetDanhGiaAPI:", errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Mong đợi { success: true, message: "..." } hoặc { success: false, error: "..." }
  } catch (error) {
    console.error("Error in duyetDanhGiaAPI:", error);
    return { success: false, error: error.message || "Lỗi khi duyệt đánh giá." };
  }
}

export async function xoaDanhGiaAPI(idDanhGia) {
  try {
    const response = await fetch(XOA_DANH_GIA, {
      method: "POST", // Hoặc DELETE, tùy theo cấu hình server và cách gửi body
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IDDanhGia: idDanhGia }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      console.error("API Error in xoaDanhGiaAPI:", errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Mong đợi { success: true, message: "..." } hoặc { success: false, error: "..." }
  } catch (error) {
    console.error("Error in xoaDanhGiaAPI:", error);
    return { success: false, error: error.message || "Lỗi khi xóa đánh giá." };
  }
}