<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Hiển thị lỗi PHP (chỉ nên dùng khi debug)
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// Xử lý preflight request cho CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối tới cơ sở dữ liệu
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ql_cuahangdungcu";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Kết nối thất bại: " . $conn->connect_error]);
    exit();
}

// Nhận dữ liệu từ phía frontend (POST dạng JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu đầu vào
$IDTaiKhoan = $data['IDTaiKhoan'] ?? null;
$DiaChi = $data['DiaChi'] ?? null;
$TenNguoiMua = $data['TenNguoiMua'] ?? null;
$SoDienThoai = $data['SoDienThoai'] ?? null;
$HinhThucThanhToan = $data['HinhThucThanhToan'] ?? null;

if ($IDTaiKhoan !== null && $DiaChi && $TenNguoiMua && $SoDienThoai && $HinhThucThanhToan) {
    $NgayXuatHoaDon = date('Y-m-d');
    $NgayDuyet = null; // Có thể để NULL

    $sql = "INSERT INTO HoaDon (IDTaiKhoan, NgayXuatHoaDon, NgayDuyet, TrangThai, DiaChi, TenNguoiMua, SoDienThoai, HinhThucThanhToan) 
            VALUES (?, ?, ?, 'Chờ Duyệt', ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Lỗi prepare: " . $conn->error]);
        $conn->close();
        exit();
    }

    $stmt->bind_param(
        "issssss",
        $IDTaiKhoan,
        $NgayXuatHoaDon,
        $NgayDuyet,
        $DiaChi,
        $TenNguoiMua,
        $SoDienThoai,
        $HinhThucThanhToan
    );

    if ($stmt->execute()) {
        $IDHoaDonMoi = $conn->insert_id;
        echo json_encode([
            "success" => true,
            "message" => "Hóa đơn đã được thêm thành công.",
            "IDHoaDon" => $IDHoaDonMoi
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi thêm hóa đơn: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại."]);
}

$conn->close();
?>