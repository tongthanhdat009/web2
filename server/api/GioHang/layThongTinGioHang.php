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

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Kết nối thất bại: " . $conn->connect_error]);
    exit();
}

// Kiểm tra IDTaiKhoan
if (!isset($_GET['IDTaiKhoan'])) {
    http_response_code(400);
    echo json_encode(["error" => "Thiếu IDTaiKhoan"]);
    exit();
}
$idTaiKhoan = $_GET['IDTaiKhoan'];

// Lấy thông tin giỏ hàng
$sqlGioHang = "SELECT gh.*, hh.*, km.*, klt.*, kq.*, kg.*, h.*
FROM giohang gh
JOIN hanghoa hh ON hh.MaHangHoa = gh.MaHangHoa
JOIN hang h ON hh.MaHang = h.MaHang
LEFT JOIN khuyenmai km ON hh.MaKhuyenMai = km.MaKhuyenMai
LEFT JOIN khoiluongta klt ON gh.IDKhoiLuongTa = klt.IDKhoiLuongTa
LEFT JOIN KichThuocQuanAo kq ON gh.IDKichThuocQuanAo = kq.IDKichThuocQuanAo
LEFT JOIN KichThuocGiay kg ON gh.IDKichThuocGiay = kg.IDKichThuocGiay
WHERE gh.IDTaiKhoan = ?";

$stmtGioHang = $conn->prepare($sqlGioHang);

if (!$stmtGioHang) {
    http_response_code(500);
    echo json_encode(["error" => "Lỗi chuẩn bị câu truy vấn giỏ hàng"]);
    exit();
}

$stmtGioHang->bind_param("i", $idTaiKhoan);
$stmtGioHang->execute();
$resultGioHang = $stmtGioHang->get_result();

$giohang = [];
if ($resultGioHang->num_rows > 0) {
    while ($row = $resultGioHang->fetch_assoc()) {
        $giohang[] = $row;
    }
} else {
    echo json_encode(["message" => "Giỏ hàng trống"]);
    $stmtGioHang->close();
    $conn->close();
    exit();
}
$stmtGioHang->close();

// Tiếp tục lấy thông tin chi tiết sản phẩm
$maHangHoaArray = array_column($giohang, 'MaHangHoa'); // lấy ra tất cả MaHangHoa trong giỏ hàng

// Chuẩn bị chuỗi IN (?, ?, ?)
$placeholders = implode(',', array_fill(0, count($maHangHoaArray), '?'));

// Viết SQL lấy chi tiết sản phẩm
$sqlSanPham = "
SELECT hh.*, ctpn.*, pn.*, klt.*, kq.*, kg.*, km.*
FROM hanghoa hh
JOIN chitietphieunhap ctpn ON ctpn.MaHangHoa = hh.MaHangHoa
JOIN phieunhap pn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
LEFT JOIN KhoiLuongTa klt ON ctpn.IDKhoiLuongTa = klt.IDKhoiLuongTa
LEFT JOIN KichThuocQuanAo kq ON ctpn.IDKichThuocQuanAo = kq.IDKichThuocQuanAo
LEFT JOIN KichThuocGiay kg ON ctpn.IDKichThuocGiay = kg.IDKichThuocGiay
LEFT JOIN khuyenmai km ON hh.MaKhuyenMai = km.MaKhuyenMai
WHERE hh.MaHangHoa IN ($placeholders)
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

$stmtSanPham = $conn->prepare($sqlSanPham);
if (!$stmtSanPham) {
    http_response_code(500);
    echo json_encode(["error" => "Lỗi chuẩn bị câu truy vấn sản phẩm"]);
    exit();
}

// Bind tham số động
$types = str_repeat('i', count($maHangHoaArray)); // toàn bộ là kiểu int (i)
$stmtSanPham->bind_param($types, ...$maHangHoaArray);

$stmtSanPham->execute();
$resultSanPham = $stmtSanPham->get_result();

$sanpham = [];
while ($row = $resultSanPham->fetch_assoc()) {
    $sanpham[] = $row;
}

$stmtSanPham->close();
$conn->close();

// Trả về cả 2 mảng
echo json_encode([
    "giohang" => $giohang,
    "sanpham" => $sanpham
]);
?>
