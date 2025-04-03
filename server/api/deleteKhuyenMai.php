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

// Lấy dữ liệu từ POST
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Debug: Log the received data
error_log("Received data: " . print_r($data, true));

if (isset($data['MaKhuyenMai'])) {
    $id = $conn->real_escape_string($data['MaKhuyenMai']);
    
    // Debug: Log the SQL query
    $checkQuery = "SELECT * FROM hanghoa WHERE MaKhuyenMai = '$id'";
    error_log("Check query: " . $checkQuery);
    
    $checkResult = $conn->query($checkQuery);

    if ($checkResult->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Không thể xóa. Mã này đang được sử dụng trong sản phẩm"]);
    } else {
        $sql = "DELETE FROM khuyenmai WHERE MaKhuyenMai = '$id'";
        error_log("Delete query: " . $sql);
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Xóa thành công"]);
        } else {
            error_log("Delete error: " . $conn->error);
            echo json_encode(["success" => false, "message" => "Xóa thất bại: " . $conn->error]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu ID"]);
}

$conn->close();
?>
