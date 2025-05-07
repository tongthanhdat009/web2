<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();


// Chuẩn bị SQL query
$sql = "SELECT * FROM kichthuocquanao";

// Thêm điều kiện nếu có IDChiTietPhieuNhap
$sql .= " ORDER BY IDKichThuocQuanAo ASC";

$result = $conn->query($sql);

if ($result) {
    $ktqa = [];
    while ($row = $result->fetch_assoc()) {
        $ktqa[] = [
            "IDKichThuocQuanAo" => $row["IDKichThuocQuanAo"],
            "KichThuocQuanAo" => $row["KichThuocQuanAo"],
        ];
    }
    echo json_encode([
        "success" => true,
        "data" => $ktqa
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi lấy danh sách kích thước quần áo: " . $conn->error
    ]);
}


$conn->close();
?>