<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['MaPhieuNhap']) && isset($data['TrangThai'])) {
    $maPhieuNhap = $conn->real_escape_string($data['MaPhieuNhap']);
    $trangThai = $conn->real_escape_string($data['TrangThai']);

    $sql = "UPDATE phieunhap 
            SET TrangThai = '$trangThai' 
            WHERE MaPhieuNhap = '$maPhieuNhap'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Cập nhật phiếu nhập thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Cập nhật phiếu nhập thất bại"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
}

$conn->close();
?>