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
$required_fields = [
    "MaPhieuNhap",
    "MaHangHoa",
    "GiaNhap",
    "GiaBan",
    "SoLuongNhap",
    "SoLuongTon"
];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    throw new Exception("Thiếu dữ liệu, vui lòng nhập đầy đủ: " . implode(", ", $missing_fields));
}

// Validate và sanitize dữ liệu
$maPhieuNhap = intval($data['MaPhieuNhap']);
$maHangHoa = intval($data['MaHangHoa']);
$giaNhap = floatval($data['GiaNhap']);
$giaBan = floatval($data['GiaBan']);
$soLuongNhap = intval($data['SoLuongNhap']);
$soLuongTon = intval($data['SoLuongTon']);

// Các trường tùy chọn
$idKhoiLuongTa = isset($data['IDKhoiLuongTa']) ? intval($data['IDKhoiLuongTa']) : null;
$idKichThuocQuanAo = isset($data['IDKichThuocQuanAo']) ? intval($data['IDKichThuocQuanAo']) : null;
$idKichThuocGiay = isset($data['IDKichThuocGiay']) ? intval($data['IDKichThuocGiay']) : null;

// Kiểm tra giá trị
if ($giaNhap <= 0 || $giaBan <= 0 || $soLuongNhap <= 0 || $soLuongTon <= 0) {
    throw new Exception("Giá trị không hợp lệ");
}

// Tạo truy vấn SQL sử dụng prepared statement
$sql = "INSERT INTO chitietphieunhap (
                MaPhieuNhap,
                MaHangHoa,
                IDKhoiLuongTa,
                IDKichThuocQuanAo,
                IDKichThuocGiay,
                GiaNhap,
                GiaBan,
                SoLuongNhap,
                SoLuongTon
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    throw new Exception("Lỗi chuẩn bị truy vấn: " . $conn->error);
}

$stmt->bind_param(
    "iiiiiddii",
    $maPhieuNhap,
    $maHangHoa,
    $idKhoiLuongTa,
    $idKichThuocQuanAo,
    $idKichThuocGiay,
    $giaNhap,
    $giaBan,
    $soLuongNhap,
    $soLuongTon
);

if ($stmt->execute()) {
    $idChiTietPhieuNhap = $conn->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Thêm chi tiết phiếu nhập thành công",
        "data" => [
            "IDChiTietPhieuNhap" => $idChiTietPhieuNhap,
            "MaPhieuNhap" => $maPhieuNhap,
            "MaHangHoa" => $maHangHoa,
            "IDKhoiLuongTa" => $idKhoiLuongTa,
            "IDKichThuocQuanAo" => $idKichThuocQuanAo,
            "IDKichThuocGiay" => $idKichThuocGiay,
            "GiaNhap" => $giaNhap,
            "GiaBan" => $giaBan,
            "SoLuongNhap" => $soLuongNhap,
            "SoLuongTon" => $soLuongTon
        ]
    ], JSON_UNESCAPED_UNICODE);
} else {
    throw new Exception("Lỗi khi thêm chi tiết phiếu nhập: " . $stmt->error);
}


// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>