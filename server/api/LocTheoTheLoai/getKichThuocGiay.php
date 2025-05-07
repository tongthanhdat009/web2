<?php
// filepath: f:\xampp\htdocs\web2\server\api\LocTheoTheLoai\getKichThuocGiay.php

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
    $queryKichThuoc = "SELECT * FROM kichthuocgiay WHERE IDKichThuocGiay != 0 ORDER BY IDKichThuocGiay ASC";

    $resultKichThuoc = $conn->query($queryKichThuoc);

    if (!$resultKichThuoc) {
         throw new Exception("Lỗi truy vấn: " . $conn->error);
    }

    $kichThuocList = array();
    while ($row = $resultKichThuoc->fetch_assoc()) {
        // Có thể chuyển đổi SoSize sang kiểu số nếu cần, nhưng thường không bắt buộc
        // $row['SoSize'] = floatval($row['SoSize']);
        $kichThuocList[] = $row;
    }

    // Trả về kết quả
    http_response_code(200); // OK
    echo json_encode(
        array(
            "success" => true,
            "data" => $kichThuocList, // Trả về danh sách kích thước giày
            "count" => count($kichThuocList)
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