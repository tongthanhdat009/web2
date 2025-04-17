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
        "message" => "Lỗi kết nối cơ sở dữ liệu",
        "debug_info" => $debug_info
    ]);
    exit();
}

// Debug: Hiển thị thông tin về request
$debug_info = [
    "request_method" => $_SERVER['REQUEST_METHOD'],
    "content_type" => isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : 'Not set',
    "raw_input" => file_get_contents("php://input"),
    "post_data" => $_POST,
    "headers" => getallheaders()
];

// Log request data
error_log("Request data: " . print_r($debug_info, true));

// Lấy dữ liệu từ request
$data = [];
$raw_data = file_get_contents("php://input");

// Parse JSON data
if (!empty($raw_data)) {
    $json_data = json_decode($raw_data, true);
    if ($json_data !== null) {
        $data = $json_data;
        $debug_info["parsed_json"] = $json_data;
        error_log("Parsed JSON data: " . print_r($json_data, true));
    } else {
        $debug_info["json_error"] = json_last_error_msg();
        error_log("JSON parse error: " . json_last_error_msg());
    }
}

// Nếu không có JSON data, thử lấy từ POST
if (empty($data)) {
    $data = $_POST;
    $debug_info["using_post"] = true;
    error_log("Using POST data: " . print_r($_POST, true));
}

error_log("Final data for processing: " . print_r($data, true));

// Kiểm tra các trường bắt buộc
$required_fields = ["MaPhieuNhap", "MaHangHoa", "GiaNhap", "GiaBan"];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing_fields[] = $field;
        error_log("Missing or empty field: " . $field);
        if (isset($data[$field])) {
            error_log("Field value: '" . $data[$field] . "'");
        } else {
            error_log("Field not set");
        }
    }
}

// Nếu thiếu trường
if (!empty($missing_fields)) {
    $response = [
        "success" => false,
        "message" => "Thiếu dữ liệu, vui lòng nhập đầy đủ",
        "missing_fields" => $missing_fields,
        "received_data" => $data,
        "debug_info" => $debug_info
    ];
    error_log("Error response: " . print_r($response, true));
    echo json_encode($response);
    exit();
}

// Validate và sanitize dữ liệu
$maPhieuNhap = trim($data['MaPhieuNhap']);
$maHangHoa = trim($data['MaHangHoa']);
$giaNhap = filter_var($data['GiaNhap'], FILTER_VALIDATE_FLOAT);
$giaBan = filter_var($data['GiaBan'], FILTER_VALIDATE_FLOAT);
$tinhTrang = isset($data['TinhTrang']) ? trim($data['TinhTrang']) : "0";

// Kiểm tra giá trị số
if ($giaNhap === false || $giaNhap < 0) {
    echo json_encode([
        "success" => false,
        "message" => "Giá nhập không hợp lệ",
        "debug_info" => $debug_info
    ]);
    exit();
}

if ($giaBan === false || $giaBan < 0) {
    echo json_encode([
        "success" => false,
        "message" => "Giá bán không hợp lệ",
        "debug_info" => $debug_info
    ]);
    exit();
}

// Tạo truy vấn SQL sử dụng prepared statement
$sql = "INSERT INTO khohang (MaPhieuNhap, MaHangHoa, GiaNhap, GiaBan, TinhTrang) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssddi", $maPhieuNhap, $maHangHoa, $giaNhap, $giaBan, $tinhTrang);

// Thực hiện truy vấn và kiểm tra lỗi
if ($stmt->execute()) {
    // Lấy ID vừa được tạo
    $seri = $conn->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Thêm kho hàng thành công",
        "data" => [
            "Seri" => $seri
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi thêm kho hàng: " . $stmt->error]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>