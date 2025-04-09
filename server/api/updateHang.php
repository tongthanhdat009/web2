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

require_once "../config/Database.php";

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
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra các trường bắt buộc
if (!isset($data['MaHang']) || !isset($data['TenHang'])) {
    echo json_encode([
        "success" => false,
        "message" => "Vui lòng nhập đầy đủ thông tin hãng"
    ]);
    exit();
}

// Validate và sanitize dữ liệu
$maHang = trim($data['MaHang']);
$tenHang = trim($data['TenHang']);

// Kiểm tra xem TenHang đã tồn tại chưa (trừ trường hợp đang sửa chính nó)
$checkNameSql = "SELECT TenHang FROM hang WHERE TenHang = ? AND MaHang != ?";
$checkNameStmt = $conn->prepare($checkNameSql);
$checkNameStmt->bind_param("ss", $tenHang, $maHang);
$checkNameStmt->execute();
$nameResult = $checkNameStmt->get_result();

if ($nameResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Tên hãng đã tồn tại!"]);
    $checkNameStmt->close();
    $conn->close();
    exit();
}
$checkNameStmt->close();

// Tạo truy vấn SQL sử dụng prepared statement
$sql = "UPDATE hang SET TenHang = ? WHERE MaHang = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $tenHang, $maHang);

// Thực hiện truy vấn và kiểm tra lỗi
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Cập nhật hãng thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy hãng để cập nhật"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật hãng: " . $stmt->error]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>
