<?php
// filepath: f:\xampp\htdocs\web2\server\api\LocTheoTheLoai\getKhoiLuong.php

// Thiết lập headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Bật báo lỗi để dễ debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Kết nối database
require_once "../../config/Database.php";
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(
        array(
            "success" => false,
            "message" => "Không thể kết nối đến database: " . $conn->connect_error
        ),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}


try {
    $queryKhoiLuong = "SELECT IDKhoiLuongTa, KhoiLuong FROM khoiluongta WHERE IDKhoiLuongTa != 0 ORDER BY KhoiLuong ASC"; // Sắp xếp nếu muốn
    $resultKhoiLuong = $conn->query($queryKhoiLuong);

    if (!$resultKhoiLuong) {
         throw new Exception("Lỗi truy vấn: " . $conn->error);
    }

    $khoiLuongList = array();
    while ($row = $resultKhoiLuong->fetch_assoc()) {
        // Chuyển đổi kiểu dữ liệu nếu cần, ví dụ KhoiLuong sang số
        $row['KhoiLuong'] = floatval($row['KhoiLuong']);
        $khoiLuongList[] = $row;
    }

    // Trả về kết quả
    http_response_code(200); // OK
    echo json_encode(
        array(
            "success" => true,
            "data" => $khoiLuongList, // Trả về danh sách khối lượng
            "count" => count($khoiLuongList)
        ),
        JSON_UNESCAPED_UNICODE
    );

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(
        array(
            "success" => false,
            "message" => "Lỗi: " . $e->getMessage()
        ),
        JSON_UNESCAPED_UNICODE
    );
} finally {
    // Đóng kết nối
    $conn->close();
}
?>