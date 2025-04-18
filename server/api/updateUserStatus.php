<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối database thất bại"]);
    exit();
}

// Đọc dữ liệu từ body request
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->idTaiKhoan) || !isset($data->trangThai)) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin cần thiết"]);
    exit();
}

$idTaiKhoan = $data->idTaiKhoan;
$trangThai = $data->trangThai;

// Cập nhật trạng thái hoạt động
$sql = "UPDATE taikhoan SET HoatDong = ? WHERE IDTaiKhoan = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("ii", $trangThai, $idTaiKhoan);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật trạng thái thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật trạng thái: " . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Lỗi chuẩn bị câu lệnh SQL"]);
}

$conn->close();
?> 