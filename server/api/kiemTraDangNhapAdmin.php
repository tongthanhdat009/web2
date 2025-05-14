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

if ($conn->connect_error) {
    echo json_encode(["message" => "Kết nối thất bại: " . $conn->connect_error]);
    http_response_code(500);
    exit;
}

// Đọc dữ liệu từ body request
$rawData = file_get_contents("php://input");
if (!$rawData) {
    echo json_encode(["message" => "Không có dữ liệu được gửi."]);
    http_response_code(400); // Bad Request
    exit;
}

$data = json_decode($rawData);

// Kiểm tra nếu không thể decode JSON hoặc dữ liệu không hợp lệ
if (json_last_error() !== JSON_ERROR_NONE || !isset($data->tenTaiKhoan) || !isset($data->matKhau)) {
    echo json_encode(["message" => "Dữ liệu không hợp lệ"]);
    http_response_code(400); // Bad Request
    exit;
}

// Tài khoản và mật khẩu
$tenTaiKhoan = $data->tenTaiKhoan;
$matKhau = $data->matKhau;

// Truy vấn kiểm tra tài khoản và lấy cả IDQuyen
$sql = "SELECT IDTaiKhoan, MatKhau, IDQuyen, TrangThai FROM taikhoan WHERE TaiKhoan = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["message" => "Lỗi chuẩn bị câu lệnh SQL: " . $conn->error]);
    http_response_code(500);
    exit;
}

$stmt->bind_param("s", $tenTaiKhoan);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "Tài khoản không tồn tại"]);
    exit;
}

$row = $result->fetch_assoc();

// Lấy mật khẩu đã hash và IDQuyen từ database
$storedHash = $row['MatKhau'];
$idQuyen = $row['IDQuyen'];

// Kiểm tra xem mật khẩu có phải định dạng bcrypt không (bắt đầu bằng $2y$)
$isBcrypt = strpos($storedHash, '$2y$') === 0;

// Kiểm tra mật khẩu
$passwordValid = false;

if ($isBcrypt) {
    // Nếu là bcrypt, sử dụng password_verify
    $passwordValid = password_verify($matKhau, $storedHash);
} else {
    // Nếu không phải bcrypt, giả sử là SHA-256
    $hashedPassword = hash("sha256", $matKhau, true);
    $passwordValid = hash_equals($storedHash, $hashedPassword);
}

if (!$passwordValid) {
    http_response_code(401); // Unauthorized
    echo json_encode(["message" => "Mật khẩu không chính xác"]);
    exit;
}
$trangThai = $row['TrangThai']; // Thêm dòng này
if ($trangThai == 0) {
    http_response_code(403); // Forbidden
    echo json_encode(["message" => "Tài khoản bị khóa"]);
    exit;
}
// Trả về idQuyen trong response thành công
echo json_encode([
    "message" => "Đăng nhập thành công",
    "idTaiKhoan" => $row['IDTaiKhoan'],
    "idQuyen" => $idQuyen
]);

$stmt->close();
$conn->close();
?>
