const TRA_CUU_SAN_PHAM_URL = "http://localhost/web2/server/api/traCuuSanPham.php";

export async function traCuuSanPham() {
  try {
    const response = await fetch(TRA_CUU_SAN_PHAM_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Dữ liệu từ API:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
