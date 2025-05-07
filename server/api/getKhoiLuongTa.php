<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();


// Chuẩn bị SQL query
$sql = "SELECT * FROM khoiluongta";

// Thêm điều kiện nếu có IDChiTietPhieuNhap
$sql .= " ORDER BY IDKhoiLuongTa ASC";

$result = $conn->query($sql);

if ($result) {
    $klts = [];
    while ($row = $result->fetch_assoc()) {
        $klts[] = [
            "IDKhoiLuongTa" => $row["IDKhoiLuongTa"],
            "KhoiLuong" => $row["KhoiLuong"],
        ];
    }
    echo json_encode([
        "success" => true,
        "data" => $klts
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi lấy danh sách khối lượng tạ: " . $conn->error
    ]);
}


$conn->close();
?>