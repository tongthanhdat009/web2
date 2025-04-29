const LAY_GIO_HANG = "http://localhost/web2/server/api/GioHang/layThongTinGioHang.php";
const THEM_GIO_HANG = "http://localhost/web2/server/api/ChiTietHangHoa/addToCart.php";
const XOA_GIO_HANG = "http://localhost/web2/server/api/GioHang/deleteCart.php";
const LAY_THONG_TIN_NGUOI_DUNG = "http://localhost/web2/server/api/GioHang/getThongTinNguoiDung.php";
const KIEM_TRA_DU_HANG = "http://localhost/web2/server/api/GioHang/checkDuHangThanhToan.php";
const TAO_HOA_DON = "http://localhost/web2/server/api/GioHang/createHoaDon.php";
const LAY_SERI = "http://localhost/web2/server/api/GioHang/getSeri.php";
const TAO_CHI_TIET_HOA_DON = "http://localhost/web2/server/api/GioHang/addChiTietHoaDon.php";
export async function layGioHang(idTaiKhoan) {
  try {
    const response = await fetch(`${LAY_GIO_HANG}?IDTaiKhoan=${idTaiKhoan}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Có lỗi xảy ra khi lấy giỏ hàng");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    throw error;
  }
}
export async function capNhatGioHang(idTaiKhoan, cart) {
  try {
    // Bước 1: Xóa toàn bộ giỏ hàng của người dùng
    const responseXoa = await fetch(XOA_GIO_HANG, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IDTaiKhoan: idTaiKhoan,
      }),
    });

    const dataXoa = await responseXoa.json();
    if (!responseXoa.ok || !dataXoa.success) {
      throw new Error(dataXoa.error || `Lỗi khi xóa giỏ hàng của người dùng ${idTaiKhoan}`);
    }

    // Bước 2: Thêm lại các sản phẩm mới vào giỏ hàng
    for (const item of cart) {
      const responseThem = await fetch(THEM_GIO_HANG, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IDTaiKhoan: idTaiKhoan,
          MaHangHoa: item.MaHangHoa,
          SoLuong: item.SoLuong,
          IDKhoiLuongTa: item.IDKhoiLuongTa,
          IDKichThuocQuanAo: item.IDKichThuocQuanAo,
          IDKichThuocGiay: item.IDKichThuocGiay,
        }),
      });

      const dataThem = await responseThem.json();
      if (!responseThem.ok || !dataThem.success) {
        throw new Error(dataThem.error || `Lỗi khi thêm sản phẩm có mã ${item.MaHangHoa} vào giỏ hàng`);
      }
    }

    return { success: true, message: "Giỏ hàng đã được cập nhật thành công." };

  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    return { success: false, message: error.message };
  }

}
export async function getThongTinNguoiDung(idTaiKhoan) {
  try {
    const response = await fetch(`${LAY_THONG_TIN_NGUOI_DUNG}?IDTaiKhoan=${idTaiKhoan}`, {
      method: "GET",
    });

    const text = await response.text();

    if (!response.ok) {
      // Có thể text là JSON hoặc thông báo lỗi HTML
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Có lỗi xảy ra khi lấy thông tin người dùng");
      } catch {
        throw new Error("Có lỗi xảy ra và dữ liệu không phải JSON");
      }
    }

    if (!text) {
      throw new Error("Không có dữ liệu trả về từ server.");
    }

    const data = JSON.parse(text);
    return data;

  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error;
  }
}
async function checkThanhToan(cart) {
  try {
    for (const item of cart) {
      const response = await fetch(KIEM_TRA_DU_HANG, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SoLuong: item.SoLuong, 
          IDChiTietPhieuNhap: item.IDChiTietPhieuNhap, 
        }),
      });

      const data = await response.json();
      if (!response.ok || data.result === false) {
        // Nếu tồn kho không đủ
        return { success: false, message: `Sản phẩm ${item.MaHangHoa} không đủ số lượng tồn kho ${item.IDChiTietPhieuNhap}.` };
      }
    }

    // Nếu tất cả các sản phẩm đều có đủ số lượng tồn kho
    return { success: true, message: "Tất cả sản phẩm đều đủ số lượng để thanh toán." };

  } catch (error) {
    console.error("Lỗi khi kiểm tra thanh toán:", error);
    return { success: false, message: error.message };
  }
}

export async function getSeri(cart) {
  const seriArr = [];
  for (const item of cart) {
    try {
      const response = await fetch(LAY_SERI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IDChiTietPhieuNhap: item.IDChiTietPhieuNhap,
          SoLuong: item.SoLuong,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.seri)) {
        // Xử lý từng seri, thêm thuộc tính GiaBan và các thông tin khác từ item
        data.seri.forEach((seri) => {
          let giaBan = item.GiaBan;
          // Nếu có khuyến mãi thì tính lại giá bán
          if (item.MaKhuyenMai && item.PhanTram) {
            giaBan = Math.round(item.GiaBan * (1 - Number(item.PhanTram) / 100));
          }
          seriArr.push({
            Seri: seri,
            GiaBan: giaBan,
          });
        });
      } else {
        throw new Error(data.message || "Không lấy được Seri cho sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy Seri:", error);
      throw error;
    }
  }
  return seriArr;
}
export async function themChiTietHoaDon(IDHoaDon, seriArr) {
  try {
    const response = await fetch(TAO_CHI_TIET_HOA_DON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        MaHoaDon: IDHoaDon,
        chiTiet: seriArr, // Mảng [{Seri, GiaBan}, ...]
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Lỗi khi thêm chi tiết hóa đơn.");
    }
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Lỗi khi thêm chi tiết hóa đơn:", error);
    return { success: false, message: error.message };
  }
}
export async function ThanhToan(IDTaiKhoan, HoTen, SoDienThoai, DiaChi, HinhThucThanhToan, cart) {
  try {
    const checkResult = await checkThanhToan(cart);

    if (!checkResult.success) {
      return { success: false, message: checkResult.message };
    }

    if (!HoTen || !SoDienThoai || !DiaChi || !HinhThucThanhToan) {
      return { success: false, message: "Vui lòng điền đầy đủ thông tin thanh toán." };
    }

    const response = await fetch(TAO_HOA_DON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IDTaiKhoan: IDTaiKhoan,
        DiaChi: DiaChi,
        TenNguoiMua: HoTen,
        SoDienThoai: SoDienThoai,
        HinhThucThanhToan: HinhThucThanhToan,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Lỗi khi tạo hóa đơn.");
    }

    // Nếu tạo hóa đơn thành công, gọi getSeri
    const seriArr = await getSeri(cart);

    // Gọi thêm chi tiết hóa đơn
    const addChiTietResult = await themChiTietHoaDon(data.IDHoaDon, seriArr);
    if (!addChiTietResult.success) {
      throw new Error(addChiTietResult.message || "Lỗi khi thêm chi tiết hóa đơn.");
    }

    // Xóa giỏ hàng nếu thành công
    await fetch(XOA_GIO_HANG, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IDTaiKhoan: IDTaiKhoan,
      }),
    });

    return { success: true, message: "Hóa đơn đã được tạo thành công.", seriArr };

  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    return { success: false, message: error.message };
  }
}