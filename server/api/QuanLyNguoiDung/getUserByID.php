<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Kiểm tra xem có ID người dùng được truyền vào không
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "Thiếu ID người dùng"]);
    exit();
}

$id = $conn->real_escape_string($_GET['id']);

$sql = "SELECT * FROM nguoidung WHERE MaNguoiDung = '$id'";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Lỗi truy vấn: " . $conn->error]);
    exit();
}

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Ẩn mật khẩu khi trả về dữ liệu
    if (isset($user['MatKhau'])) {
        unset($user['MatKhau']);
    }
    
    echo json_encode(["success" => true, "data" => $user], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["success" => false, "message" => "Không tìm thấy người dùng"]);
}

$conn->close();
?>