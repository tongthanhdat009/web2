<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$servername = "localhost";
$username = "root";
$password = "";
$database = "ql_cuahangdungcu";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Kết nối thất bại: " . $conn->connect_error]);
    exit();
}

// Đọc searchTerm từ input
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['searchTerm'])) {
    http_response_code(400);
    echo json_encode(["error" => "Thiếu tham số searchTerm"]);
    exit();
}
$searchTerm = $conn->real_escape_string($input['searchTerm']); // Sanitize input

// Viết SQL để tìm kiếm sản phẩm theo TenHangHoa
// Lấy thêm thông tin khuyến mãi nếu có
$sql = "
SELECT hh.*, ctpn.*, pn.*, klt.*, kq.*, kg.*, km.*
FROM hanghoa hh
JOIN chitietphieunhap ctpn ON ctpn.MaHangHoa = hh.MaHangHoa
JOIN phieunhap pn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
LEFT JOIN KhoiLuongTa klt ON ctpn.IDKhoiLuongTa = klt.IDKhoiLuongTa
LEFT JOIN KichThuocQuanAo kq ON ctpn.IDKichThuocQuanAo = kq.IDKichThuocQuanAo
LEFT JOIN KichThuocGiay kg ON ctpn.IDKichThuocGiay = kg.IDKichThuocGiay
LEFT JOIN khuyenmai km ON hh.MaKhuyenMai = km.MaKhuyenMai
WHERE hh.TenHangHoa LIKE CONCAT('%', ?, '%')
  AND ctpn.SoLuongTon > 0 
  AND pn.TrangThai = 'Đã duyệt'
  AND pn.NgayNhap = (
    SELECT MIN(pn2.NgayNhap)
    FROM chitietphieunhap ctpn2
    JOIN phieunhap pn2 ON pn2.MaPhieuNhap = ctpn2.MaPhieuNhap
    WHERE ctpn2.MaHangHoa = ctpn.MaHangHoa
      AND (ctpn.IDKhoiLuongTa = ctpn2.IDKhoiLuongTa OR (ctpn.IDKhoiLuongTa IS NULL AND ctpn2.IDKhoiLuongTa IS NULL))
      AND (ctpn.IDKichThuocQuanAo = ctpn2.IDKichThuocQuanAo OR (ctpn.IDKichThuocQuanAo IS NULL AND ctpn2.IDKichThuocQuanAo IS NULL))
      AND (ctpn.IDKichThuocGiay = ctpn2.IDKichThuocGiay OR (ctpn.IDKichThuocGiay IS NULL AND ctpn2.IDKichThuocGiay IS NULL))
      AND ctpn2.SoLuongTon > 0
  )
";

// Chuẩn bị câu lệnh
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Lỗi prepare: " . $conn->error]);
    exit();
}

// Gán tham số
$searchTermWildcard = "%" . $searchTerm . "%";
$stmt->bind_param('s', $searchTermWildcard);

// Thực thi
$stmt->execute();
$result = $stmt->get_result();

// Xử lý kết quả
$data = [];
while ($row = $result->fetch_assoc()) {
    // Chuyển đổi ConHang từ 0/1 sang boolean hoặc string "Còn hàng"/"Hết hàng"
    if ($row['ConHang'] !== null) {
        $row['TinhTrang'] = $row['ConHang'] ? "Còn hàng" : "Hết hàng";
    } else {
        // Nếu không có chi tiết phiếu nhập nào, coi như hết hàng
        $row['TinhTrang'] = "Hết hàng";
    }
    unset($row['ConHang']); // Xóa cột ConHang không cần thiết nữa

    // Tính giá sau khuyến mãi nếu có
    if ($row['GiaBanNhoNhat'] !== null && $row['PhanTramGiam'] !== null) {
        $currentDate = date('Y-m-d H:i:s');
        if ($row['NgayBatDauKM'] <= $currentDate && $row['NgayKetThucKM'] >= $currentDate) {
            $row['GiaKhuyenMai'] = $row['GiaBanNhoNhat'] * (1 - $row['PhanTramGiam'] / 100);
        } else {
            $row['GiaKhuyenMai'] = null; // Khuyến mãi không áp dụng
        }
    } else {
        $row['GiaKhuyenMai'] = null;
    }
    $data[] = $row;
}

echo json_encode($data);

// Đóng kết nối
$stmt->close();
$conn->close();
?>
