<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình CORS và Content-Type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kiểm tra phương thức request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Chỉ chấp nhận phương thức POST"]);
    exit();
}

require_once "../../config/Database.php";

// Khởi tạo kết nối database
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi kết nối cơ sở dữ liệu"
    ]);
    exit();
}

// Lấy dữ liệu từ request
$data = [];
$raw_data = file_get_contents("php://input");

// Parse JSON data
if (!empty($raw_data)) {
    $json_data = json_decode($raw_data, true);
    if ($json_data !== null) {
        $data = $json_data;
        error_log("Parsed JSON data: " . print_r($json_data, true));
    } else {
        error_log("JSON parse error: " . json_last_error_msg());
    }
}

// Nếu không có JSON data, thử lấy từ POST
if (empty($data)) {
    $data = $_POST;
    error_log("Using POST data: " . print_r($_POST, true));
}

error_log("Final data for processing: " . print_r($data, true));

// Kiểm tra các trường bắt buộc
$required_fields = ["TenDangNhap", "MatKhau", "HoTen", "Email", "DiaChi", "SoDienThoai"];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing_fields[] = $field;
    }
}

// Nếu thiếu trường
if (!empty($missing_fields)) {
    echo json_encode([
        "success" => false,
        "message" => "Vui lòng nhập đầy đủ thông tin người dùng",
        "missing_fields" => $missing_fields
    ]);
    exit();
}

// Validate và sanitize dữ liệu
$tenDangNhap = trim($data['TenDangNhap']);
$matKhau = trim($data['MatKhau']);
$hoTen = trim($data['HoTen']);
$email = trim($data['Email']);
$diaChi = trim($data['DiaChi']);
$soDienThoai = trim($data['SoDienThoai']);
$trangthai = isset($data['TrangThai']) ? intval($data['TrangThai']) : 1; // Mặc định là 1 (active)

// Băm mật khẩu
$hashedPassword = password_hash($matKhau, PASSWORD_DEFAULT);

// Kiểm tra xem tên đăng nhập đã tồn tại chưa
$checkSql = "SELECT TenDangNhap FROM nguoidung WHERE TenDangNhap = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $tenDangNhap);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Tên đăng nhập đã tồn tại"]);
    $checkStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

// Kiểm tra email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Địa chỉ email không hợp lệ"]);
    $conn->close();
    exit();
}

// Kiểm tra xem email đã tồn tại chưa
$checkEmailSql = "SELECT Email FROM nguoidung WHERE Email = ?";
$checkEmailStmt = $conn->prepare($checkEmailSql);
$checkEmailStmt->bind_param("s", $email);
$checkEmailStmt->execute();
$emailResult = $checkEmailStmt->get_result();

if ($emailResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email đã được sử dụng"]);
    $checkEmailStmt->close();
    $conn->close();
    exit();
}
$checkEmailStmt->close();

// Tạo truy vấn SQL sử dụng prepared statement
$sql = "INSERT INTO nguoidung (TenDangNhap, MatKhau, HoTen, Email, DiaChi, SoDienThoai, TrangThai) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssi", $tenDangNhap, $hashedPassword, $hoTen, $email, $diaChi, $soDienThoai, $trangthai);

// Thực hiện truy vấn và kiểm tra lỗi
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm người dùng thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi thêm người dùng: " . $stmt->error]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>