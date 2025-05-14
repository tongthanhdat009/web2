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

// Lấy mã hóa đơn từ POST
$input = json_decode(file_get_contents("php://input"), true);
$maHoaDon = isset($_POST['MaHoaDon']) ? intval($_POST['MaHoaDon']) : (isset($input['MaHoaDon']) ? intval($input['MaHoaDon']) : 0);
if ($maHoaDon <= 0) {
    echo json_encode(["success" => false, "message" => "Thiếu hoặc sai mã hóa đơn"]);
    exit();
}

// 1. Cập nhật Tình Trạng = 'Chưa bán' cho các hàng hóa thuộc hóa đơn
$updateQuery = "
    UPDATE khohang
    SET TinhTrang = 'Chưa bán'
    WHERE Seri IN (
        SELECT Seri
        FROM chitiethoadon
        WHERE MaHoaDon = ?
    )
";
$stmtUpdate = $conn->prepare($updateQuery);
$stmtUpdate->bind_param("i", $maHoaDon);
$stmtUpdate->execute();

// 2. Xóa chi tiết hóa đơn
$deleteCTHDQuery = "DELETE FROM chitiethoadon WHERE MaHoaDon = ?";
$stmtCTHD = $conn->prepare($deleteCTHDQuery);
$stmtCTHD->bind_param("i", $maHoaDon);
$stmtCTHD->execute();

// 3. Xóa hóa đơn
$deleteHDQuery = "DELETE FROM hoadon WHERE MaHoaDon = ?";
$stmtHD = $conn->prepare($deleteHDQuery);
$stmtHD->bind_param("i", $maHoaDon);
$stmtHD->execute();

// Trả về kết quả
echo json_encode(["success" => true, "message" => "Đã xóa hóa đơn và cập nhật trạng thái hàng thành công."]);

$conn->close();
