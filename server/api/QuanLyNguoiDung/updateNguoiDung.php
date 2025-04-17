<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy dữ liệu từ POST
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Debug: Log the received data
error_log("Received data for update: " . print_r($data, true));

// Kiểm tra các trường bắt buộc
if (!isset($data['MaNguoiDung']) || empty($data['MaNguoiDung'])) {
    echo json_encode(["success" => false, "message" => "Thiếu ID người dùng"]);
    exit();
}

$maNguoiDung = $conn->real_escape_string($data['MaNguoiDung']);

// Kiểm tra xem người dùng có tồn tại không
$checkSql = "SELECT * FROM nguoidung WHERE MaNguoiDung = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("i", $maNguoiDung);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
    $checkStmt->close();
    $conn->close();
    exit();
}

$checkStmt->close();

// Xây dựng câu lệnh UPDATE động dựa trên dữ liệu được cung cấp
$updateFields = [];
$types = "";
$params = [];

// Thêm các tham số vào câu lệnh SQL nếu chúng được cung cấp
if (isset($data['HoTen']) && !empty($data['HoTen'])) {
    $updateFields[] = "HoTen = ?";
    $types .= "s";
    $params[] = trim($data['HoTen']);
}

if (isset($data['Email']) && !empty($data['Email'])) {
    // Kiểm tra email hợp lệ
    if (!filter_var($data['Email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Địa chỉ email không hợp lệ"]);
        $conn->close();
        exit();
    }
    
    // Kiểm tra email đã tồn tại với người dùng khác
    $checkEmailSql = "SELECT MaNguoiDung FROM nguoidung WHERE Email = ? AND MaNguoiDung != ?";
    $checkEmailStmt = $conn->prepare($checkEmailSql);
    $checkEmailStmt->bind_param("si", $data['Email'], $maNguoiDung);
    $checkEmailStmt->execute();
    $emailResult = $checkEmailStmt->get_result();
    
    if ($emailResult->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email đã được sử dụng bởi người dùng khác"]);
        $checkEmailStmt->close();
        $conn->close();
        exit();
    }
    $checkEmailStmt->close();
    
    $updateFields[] = "Email = ?";
    $types .= "s";
    $params[] = trim($data['Email']);
}

if (isset($data['DiaChi']) && !empty($data['DiaChi'])) {
    $updateFields[] = "DiaChi = ?";
    $types .= "s";
    $params[] = trim($data['DiaChi']);
}

if (isset($data['SoDienThoai']) && !empty($data['SoDienThoai'])) {
    $updateFields[] = "SoDienThoai = ?";
    $types .= "s";
    $params[] = trim($data['SoDienThoai']);
}

if (isset($data['TrangThai'])) {
    $updateFields[] = "TrangThai = ?";
    $types .= "i";
    $params[] = intval($data['TrangThai']);
}

// Đổi mật khẩu nếu có
if (isset($data['MatKhau']) && !empty($data['MatKhau'])) {
    $hashedPassword = password_hash(trim($data['MatKhau']), PASSWORD_DEFAULT);
    $updateFields[] = "MatKhau = ?";
    $types .= "s";
    $params[] = $hashedPassword;
}

// Nếu không có trường nào được cập nhật
if (empty($updateFields)) {
    echo json_encode(["success" => false, "message" => "Không có dữ liệu nào để cập nhật"]);
    $conn->close();
    exit();
}

// Tạo câu lệnh SQL
$sql = "UPDATE nguoidung SET " . implode(", ", $updateFields) . " WHERE MaNguoiDung = ?";
$types .= "i";
$params[] = $maNguoiDung;

// Tạo prepared statement
$stmt = $conn->prepare($sql);

// Bind các tham số
$stmt->bind_param($types, ...$params);

// Thực hiện truy vấn
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật người dùng thành công"]);
} else {
    error_log("Update error: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Cập nhật người dùng thất bại: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>