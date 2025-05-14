<?php
// filepath: c:\xampp\htdocs\web2\server\api\QuanLyDanhGia\getAllDanhGia.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$host = "localhost";
$dbname = "ql_cuahangdungcu";
$username = "root";
$password = ""; // Mật khẩu của bạn, nếu có

$conn = new mysqli($host, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Kết nối CSDL thất bại: " . $conn->connect_error]);
    exit();
}

// Thiết lập charset cho kết nối
if (!$conn->set_charset("utf8mb4")) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thiết lập charset: " . $conn->error]);
    $conn->close();
    exit();
}

// Câu lệnh SQL để lấy tất cả đánh giá cùng thông tin hàng hóa và tài khoản
$sql = "SELECT dg.IDDanhGia, dg.SoSao, dg.BinhLuan, 
               DATE_FORMAT(dg.ThoiGian, '%Y-%m-%d %H:%i:%s') as ThoiGian, 
               tk.TaiKhoan, dg.TrangThai, 
               hh.MaHangHoa, hh.TenHangHoa, hh.Anh
        FROM DanhGia dg
        LEFT JOIN HangHoa hh ON dg.MaHangHoa = hh.MaHangHoa
        LEFT JOIN TaiKhoan tk ON dg.IDTaiKhoan = tk.IDTaiKhoan
        ORDER BY dg.ThoiGian DESC";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh SQL: " . $conn->error]);
    $conn->close();
    exit();
}

// Không cần bind_param ở đây vì câu lệnh không có placeholder
// $stmt->bind_param("s", $maHangHoa); // XÓA HOẶC COMMENT DÒNG NÀY

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thực thi câu lệnh SQL: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}

$result = $stmt->get_result();
$reviews = [];

if ($result === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi lấy kết quả: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}

while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

if (empty($reviews)) {
    // Thông báo phù hợp hơn khi không có đánh giá nào trong toàn hệ thống
    echo json_encode(["success" => true, "data" => [], "message" => "Không có đánh giá nào trong hệ thống."]);
} else {
    echo json_encode(["success" => true, "data" => $reviews]);
}

$stmt->close();
$conn->close();
?>