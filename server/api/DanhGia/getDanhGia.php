<?php
// filepath: c:\xampp\htdocs\web2\server\api\ChiTietHangHoa\getDanhGia.php
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

// Lấy MaHangHoa từ query string
$maHangHoa = isset($_GET['MaHangHoa']) ? $conn->real_escape_string($_GET['MaHangHoa']) : '';

if (empty($maHangHoa)) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "Thiếu tham số MaHangHoa."]);
    $conn->close();
    exit();
}

$sql = "SELECT dg.IDDanhGia, dg.SoSao, dg.BinhLuan, dg.ThoiGian, tk.TaiKhoan, dg.TrangThai
        FROM DanhGia dg
        LEFT JOIN TaiKhoan tk ON dg.IDTaiKhoan = tk.IDTaiKhoan
        WHERE dg.MaHangHoa = ? AND dg.TrangThai = 'Đã Duyệt'
        ORDER BY dg.ThoiGian DESC";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh SQL: " . $conn->error]);
    $conn->close();
    exit();
}

// Bind tham số MaHangHoa (s = string)
$stmt->bind_param("s", $maHangHoa);

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
    echo json_encode(["success" => true, "data" => [], "message" => "Không có đánh giá nào cho sản phẩm này."]);
} else {
    echo json_encode(["success" => true, "data" => $reviews]);
}

$stmt->close();
$conn->close();
?>