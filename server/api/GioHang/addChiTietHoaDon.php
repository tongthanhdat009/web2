<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$host = "localhost";
$dbname = "ql_cuahangdungcu";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối thất bại: " . $conn->connect_error]);
    exit();
}

// Nhận dữ liệu từ client (POST dạng JSON)
$data = json_decode(file_get_contents("php://input"), true);
$MaHoaDon = $data['MaHoaDon'] ?? null;
$chiTietArr = $data['chiTiet'] ?? null; // Mảng [{Seri, GiaBan}, ...]

if (!$MaHoaDon || !is_array($chiTietArr) || count($chiTietArr) === 0) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu hoặc dữ liệu không hợp lệ"]);
    $conn->close();
    exit();
}

$sql = "INSERT INTO chitiethoadon (MaHoaDon, Seri, GiaBan) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Lỗi prepare: " . $conn->error]);
    $conn->close();
    exit();
}

$successCount = 0;
foreach ($chiTietArr as $item) {
    $Seri = $item['Seri'] ?? null;
    $GiaBan = $item['GiaBan'] ?? null;
    if ($Seri && $GiaBan !== null) {
        $stmt->bind_param("isd", $MaHoaDon, $Seri, $GiaBan);
        if ($stmt->execute()) {
            $successCount++;
        }
    }
}
$stmt->close();
$conn->close();

if ($successCount === count($chiTietArr)) {
    echo json_encode(["success" => true, "message" => "Thêm chi tiết hóa đơn thành công"]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Có lỗi khi thêm một số chi tiết hóa đơn",
        "soLuongThanhCong" => $successCount
    ]);
}
?>