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
$raw_data = file_get_contents("php://input");
$data = json_decode($raw_data, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Dữ liệu không hợp lệ"
    ]);
    exit();
}

// Kiểm tra các trường bắt buộc
$required_fields = ["IDChiTietPhieuNhap", "TinhTrang"];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu dữ liệu, vui lòng nhập đầy đủ",
        "missing_fields" => $missing_fields
    ]);
    exit();
}

// Validate và sanitize dữ liệu
$idChiTietPhieuNhap = trim($data['IDChiTietPhieuNhap']);
$tinhTrang = trim($data['TinhTrang']);

// Tạo truy vấn SQL sử dụng prepared statement
$sql = "INSERT INTO khohang (IDChiTietPhieuNhap, TinhTrang) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $idChiTietPhieuNhap, $tinhTrang);

// Thực hiện truy vấn và kiểm tra lỗi
if ($stmt->execute()) {
    // Lấy Seri vừa được tạo
    $seri = $conn->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Thêm kho hàng thành công",
        "data" => [
            "Seri" => $seri,
            "TinhTrang" => $tinhTrang,
            "IDChiTietPhieuNhap" => $idChiTietPhieuNhap
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi thêm kho hàng: " . $stmt->error
    ]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>