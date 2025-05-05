<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Nếu là OPTIONS request, chỉ cần trả về 200 OK để trình duyệt không báo lỗi
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$host = "localhost";
$dbname = "ql_cuahangdungcu";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Lấy IDTaiKhoan từ JSON payload
$payload = json_decode(file_get_contents("php://input"), true);
$IDTaiKhoan = $payload["IDTaiKhoan"] ?? null;

if ($IDTaiKhoan === null) {
    http_response_code(400);
    echo json_encode(["error" => "Thiếu IDTaiKhoan"]);
    exit();
}

$vTaiKhoan = (int)$IDTaiKhoan;

// Xóa giỏ hàng của tài khoản
$sql = "DELETE FROM giohang WHERE IDTaiKhoan = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("i", $vTaiKhoan);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Đã xóa toàn bộ giỏ hàng của người dùng"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
