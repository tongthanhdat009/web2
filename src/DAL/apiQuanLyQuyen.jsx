const GET_QUYEN = "http://localhost/web2/server/api/QuanLyQuyen/getQuyen.php";
const XOA_QUYEN = "http://localhost/web2/server/api/QuanLyQuyen/deleteQuyen.php";
const ADD_QUYEN = "http://localhost/web2/server/api/QuanLyQuyen/addQuyen.php";
export async function getQuyen() {
  try {
    const response = await fetch(GET_QUYEN, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: response.statusText || `HTTP error! status: ${response.status}` };
      }
      console.error("API Error in getQuyen:", errorData, "Status:", response.status);
      throw new Error(errorData.error || `Network response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching data in getQuyen:", error);
    return { success: false, error: error.message || "Unknown error occurred while fetching permissions" };
  }
}
export async function deleteQuyen(idQuyen) {
  try {
    const response = await fetch(XOA_QUYEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IDQuyen: idQuyen }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: response.statusText || `HTTP error! status: ${response.status}` };
      }
      console.error("API Error in xoaQuyen:", errorData, "Status:", response.status);
      throw new Error(errorData.error || `Network response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching data in xoaQuyen:", error);
    return { success: false, error: error.message || "Unknown error occurred while deleting permission" };
  }
}
export async function addQuyen(tenQuyen) { // Nhận tenQuyen làm tham số
  try {
    const response = await fetch(ADD_QUYEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ TenQuyen: tenQuyen }), // Gửi TenQuyen
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: response.statusText || `HTTP error! status: ${response.status}` };
      }
      console.error("API Error in addQuyen:", errorData, "Status:", response.status);
      throw new Error(errorData.error || `Network response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    // API PHP trả về { success: true, message: "...", quyen: { IDQuyen: ..., TenQuyen: ... } }
    // hoặc { success: false, error: "..." }
    return data;
  } catch (error) {
    console.error("Error in addQuyen:", error);
    return { success: false, error: error.message || "Unknown error occurred while adding permission" };
  }
}