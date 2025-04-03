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

// Kiểm tra mã hãng
if (!isset($data['MaHang'])) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu mã hãng"
    ]);
    exit();
}

$maHang = trim($data['MaHang']);

// Kiểm tra xem hãng có sản phẩm nào không
$checkProductsSql = "SELECT COUNT(*) as count FROM hanghoa WHERE MaHang = ?";
$checkProductsStmt = $conn->prepare($checkProductsSql);
$checkProductsStmt->bind_param("s", $maHang);
$checkProductsStmt->execute();
$productsResult = $checkProductsStmt->get_result();
$productsCount = $productsResult->fetch_assoc()['count'];
$checkProductsStmt->close();

if ($productsCount > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Đã có sản phẩm sử dụng hãng này!!"
    ]);
    $conn->close();
    exit();
}

// Tạo truy vấn SQL sử dụng prepared statement
$sql = "DELETE FROM hang WHERE MaHang = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $maHang);

// Thực hiện truy vấn và kiểm tra lỗi
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Xóa hãng thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy hãng để xóa"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi xóa hãng: " . $stmt->error]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>
