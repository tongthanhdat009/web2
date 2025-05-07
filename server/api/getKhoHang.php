<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();


// Chuẩn bị SQL query
$sql = "SELECT * FROM khohang";

// Thêm điều kiện nếu có IDChiTietPhieuNhap
$sql .= " ORDER BY Seri ASC";

$result = $conn->query($sql);

if ($result) {
    $hangs = [];
    while ($row = $result->fetch_assoc()) {
        $hangs[] = [
            "Seri" => $row["Seri"],
            "TinhTrang" => $row["TinhTrang"],
            "IDChiTietPhieuNhap" => $row["IDChiTietPhieuNhap"],
        ];
    }
    echo json_encode([
        "success" => true,
        "data" => $hangs
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi lấy danh sách kho hàng: " . $conn->error
    ]);
}


$conn->close();
?>