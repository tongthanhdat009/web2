<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy dữ liệu từ POST
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Debug: Log the received data
error_log("Received data: " . print_r($data, true));

if (isset($data['MaNguoiDung'])) {
    $id = $conn->real_escape_string($data['MaNguoiDung']);
    
    // Kiểm tra xem người dùng có tồn tại không
    $checkSql = "SELECT * FROM nguoidung WHERE MaNguoiDung = '$id'";
    $checkResult = $conn->query($checkSql);
    
    if ($checkResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
        $conn->close();
        exit();
    }
    
    // Kiểm tra xem có đơn hàng hoặc dữ liệu liên quan không
    $checkOrderSql = "SELECT * FROM hoadon WHERE MaNguoiDung = '$id'";
    $checkOrderResult = $conn->query($checkOrderSql);
    
    if ($checkOrderResult->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Không thể xóa người dùng này vì có dữ liệu hóa đơn liên quan"]);
        $conn->close();
        exit();
    }
    
    $sql = "DELETE FROM nguoidung WHERE MaNguoiDung = '$id'";
    error_log("Delete query: " . $sql);
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Xóa người dùng thành công"]);
    } else {
        error_log("Delete error: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Xóa người dùng thất bại: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu ID người dùng"]);
}

$conn->close();
?>