<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$host = "localhost";
$dbname = "ql_cuahangdungcu";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối CSDL thất bại"]);
    exit();
}

// Lấy mã hóa đơn từ query string
$maHoaDon = isset($_GET['MaHoaDon']) ? intval($_GET['MaHoaDon']) : 0;
if ($maHoaDon <= 0) {
    echo json_encode(["success" => false, "message" => "Thiếu hoặc sai mã hóa đơn"]);
    exit();
}

$sql = "
SELECT hd.*, cthd.*, kh.*, ctpn.*, klt.*, ktqa.*, ktg.*, hh.MaHangHoa, hh.TenHangHoa, hh.Anh
FROM hoadon hd
JOIN chitiethoadon cthd ON cthd.MaHoaDon = hd.MaHoaDon
JOIN khohang kh ON kh.Seri = cthd.Seri
JOIN chitietphieunhap ctpn ON ctpn.IDChiTietPhieuNhap = kh.IDChiTietPhieuNhap
LEFT JOIN khoiluongta klt ON klt.IDKhoiLuongTa = ctpn.IDKhoiLuongTa
LEFT JOIN kichthuocquanao ktqa ON ktqa.IDKichThuocQuanAo = ctpn.IDKichThuocQuanAo
LEFT JOIN kichthuocgiay ktg ON ktg.IDKichThuocGiay = ctpn.IDKichThuocGiay
LEFT JOIN hanghoa hh ON hh.MaHangHoa = ctpn.MaHangHoa
WHERE hd.MaHoaDon = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $maHoaDon);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
$conn->close();