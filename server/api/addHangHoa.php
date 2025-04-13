<?php
// Bật hiển thị lỗi để debug
ini_set('display_errors', 0); // Không hiển thị lỗi ra trình duyệt
ini_set('log_errors', 1); // Ghi lỗi vào file log
ini_set('error_log', __DIR__ . '/error.log'); // Tạo file error.log cùng thư mục

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

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi kết nối cơ sở dữ liệu"
    ]);
    exit();
}

// Debug request
$debug_info = [
    "request_method" => $_SERVER['REQUEST_METHOD'],
    "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'Not set',
    "raw_input" => file_get_contents("php://input"),
    "headers" => getallheaders()
];

// Parse input JSON
$data = [];
$raw_data = file_get_contents("php://input");

if (!empty($raw_data)) {
    $json_data = json_decode($raw_data, true);
    if ($json_data !== null) {
        $data = $json_data;
        $debug_info["parsed_json"] = $json_data;
    } else {
        $debug_info["json_error"] = json_last_error_msg();
        echo json_encode([
            "success" => false,
            "message" => "Dữ liệu JSON không hợp lệ",
            "debug_info" => $debug_info
        ]);
        exit();
    }
}

// Kiểm tra các trường bắt buộc
$required_fields = ["MaHangHoa", "TenHangHoa", "MaChungLoai", "MaHang"];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu thông tin bắt buộc",
        "missing_fields" => $missing_fields,
        "debug_info" => $debug_info
    ]);
    exit();
}

// Kiểm tra mã hàng hóa đã tồn tại
$check_query = "SELECT 1 FROM hanghoa WHERE MaHangHoa = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("s", $data['MaHangHoa']);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Mã hàng hóa đã tồn tại"
    ]);
    $check_stmt->close();
    $conn->close();
    exit();
}
$check_stmt->close();

// Kiểm tra tên hàng hóa đã tồn tại
$check_name_query = "SELECT 1 FROM hanghoa WHERE TenHangHoa = ?";
$check_name_stmt = $conn->prepare($check_name_query);
$check_name_stmt->bind_param("s", $data['TenHangHoa']);
$check_name_stmt->execute();
$check_name_stmt->store_result();

if ($check_name_stmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Tên hàng hóa đã tồn tại"
    ]);
    $check_name_stmt->close();
    $conn->close();
    exit();
}
$check_name_stmt->close();

// Kiểm tra chủng loại tồn tại
$check_cl_query = "SELECT 1 FROM chungloai WHERE MaChungLoai = ?";
$check_cl_stmt = $conn->prepare($check_cl_query);
$check_cl_stmt->bind_param("s", $data['MaChungLoai']);
$check_cl_stmt->execute();
$check_cl_stmt->store_result();

if ($check_cl_stmt->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Chủng loại không tồn tại"
    ]);
    $check_cl_stmt->close();
    $conn->close();
    exit();
}
$check_cl_stmt->close();

// Kiểm tra hãng tồn tại
$check_h_query = "SELECT 1 FROM hang WHERE MaHang = ?";
$check_h_stmt = $conn->prepare($check_h_query);
$check_h_stmt->bind_param("s", $data['MaHang']);
$check_h_stmt->execute();
$check_h_stmt->store_result();

if ($check_h_stmt->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Hãng không tồn tại"
    ]);
    $check_h_stmt->close();
    $conn->close();
    exit();
}
$check_h_stmt->close();

// Nếu có MaKhuyenMai thì kiểm tra
$check_km_query = "SELECT 1 FROM khuyenmai WHERE MaKhuyenMai = ?";
$check_km_stmt = $conn->prepare($check_km_query);
$check_km_stmt->bind_param("s", $data['MaKhuyenMai']);
$check_km_stmt->execute();
$check_km_stmt->store_result();

if ($check_km_stmt->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Khuyến mãi không tồn tại"
    ]);
    $check_km_stmt->close();
    $conn->close();
    exit();
}
$check_km_stmt->close();

// Thay thế các giá trị null bằng chuỗi trống nếu có
$maKhuyenMai = isset($data['MaKhuyenMai']) ? $data['MaKhuyenMai'] : '';
$moTa = isset($data['MoTa']) ? $data['MoTa'] : '';
$thoiGianBaoHanh = isset($data['ThoiGianBaoHanh']) ? $data['ThoiGianBaoHanh'] : '';
$anh = isset($data['Anh']) ? $data['Anh'] : '';

// Chuẩn bị câu lệnh insert
$query = "INSERT INTO hanghoa (MaHangHoa, TenHangHoa, MaChungLoai, MaHang, MaKhuyenMai, MoTa, ThoiGianBaoHanh, Anh) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);
$stmt->bind_param(
    "ssssssss",
    $data['MaHangHoa'],
    $data['TenHangHoa'],
    $data['MaChungLoai'],
    $data['MaHang'],
    $maKhuyenMai,  // Không phải null nữa
    $moTa,  // Không phải null nữa
    $thoiGianBaoHanh,  // Không phải null nữa
    $anh  // Không phải null nữa
);

// Thực thi truy vấn
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm hàng hóa thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi thêm hàng hóa: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>