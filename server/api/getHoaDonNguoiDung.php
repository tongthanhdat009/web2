<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Trả về sớm nếu là preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL (nhớ include file config)
require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Kiểm tra nếu có IDTaiKhoan được gửi từ query
if (!isset($_GET['IDTaiKhoan'])) {
    echo json_encode(["success" => false, "message" => "Thiếu IDTaiKhoan"]);
    exit();
}

$IDTaiKhoan = $_GET['IDTaiKhoan'];

$sql = "
    SELECT 
        hoadon.MaHoaDon, 
        hoadon.IDTaiKhoan, 
        hoadon.NgayXuatHoaDon, 
        hoadon.NgayDuyet, 
        hoadon.TrangThai, 
        SUM(chitiethoadon.GiaBan) AS TongTien
    FROM hoadon
    JOIN chitiethoadon ON chitiethoadon.MaHoaDon = hoadon.MaHoaDon
    JOIN khohang ON khohang.Seri = chitiethoadon.Seri
    WHERE hoadon.IDTaiKhoan = ?
    GROUP BY hoadon.MaHoaDon, hoadon.IDTaiKhoan, hoadon.NgayXuatHoaDon, hoadon.NgayDuyet, hoadon.TrangThai
    ORDER BY hoadon.NgayXuatHoaDon DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $IDTaiKhoan);
$stmt->execute();
$result = $stmt->get_result();

$donHangList = [];
while ($row = $result->fetch_assoc()) {
    $donHangList[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $donHangList
], JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
exit();
?>
