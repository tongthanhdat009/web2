<?php
// filepath: f:\xampp\htdocs\web2\server\api\updateHoaDon.php

// Thiết lập header
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Bật báo lỗi để dễ debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Kết nối đến database
require_once "../config/Database.php";
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Không thể kết nối database: " . $conn->connect_error
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

// Nhận dữ liệu từ client
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra dữ liệu đầu vào
if (!$data || !isset($data->maHoaDon) || !isset($data->trangThai)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Dữ liệu không hợp lệ. Yêu cầu maHoaDon và trangThai."
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $query = "UPDATE hoadon SET TrangThai = ?, NgayDuyet = ? WHERE MaHoaDon = ?";
    
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        throw new Exception("Lỗi chuẩn bị câu truy vấn: " . $conn->error);
    }
    
    $stmt->bind_param("sss", $data->trangThai, $data->ngayDuyet, $data->maHoaDon);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(array(
                "success" => true,
                "message" => "Cập nhật trạng thái đơn hàng thành công."
            ), JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(array(
                "success" => false,
                "message" => "Không tìm thấy đơn hàng hoặc không có thay đổi."
            ), JSON_UNESCAPED_UNICODE);
        }
    } else {
        throw new Exception("Lỗi thực thi truy vấn: " . $stmt->error);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => $e->getMessage()
    ), JSON_UNESCAPED_UNICODE);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    
    $conn->close();
}
?>