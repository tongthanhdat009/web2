<?php
// filepath: c:\xampp\htdocs\web2\server\api\QuanLyDanhGia\deleteDanhGia.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS"); // Cho phép POST hoặc DELETE
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

// Lấy dữ liệu từ request body (JSON)
// Sử dụng POST cho đơn giản, mặc dù DELETE thường không có body,
// nhưng nhiều thư viện client gửi body với DELETE hoặc có thể dùng POST để delete.
// Nếu muốn tuân thủ REST hơn, có thể lấy IDDanhGia từ query parameter với phương thức DELETE.
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->IDDanhGia)) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "Thiếu IDDanhGia."]);
    $conn->close();
    exit();
}

$idDanhGia = $data->IDDanhGia;

// Câu lệnh SQL để xóa đánh giá
$sql = "DELETE FROM DanhGia WHERE IDDanhGia = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh SQL: " . $conn->error]);
    $conn->close();
    exit();
}

// Gán tham số
$stmt->bind_param("i", $idDanhGia); // "i" for integer (IDDanhGia)

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Đánh giá ID " . $idDanhGia . " đã được xóa thành công."]);
    } else {
        // Không có dòng nào được xóa, có thể IDDanhGia không tồn tại
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "error" => "Không tìm thấy đánh giá với ID " . $idDanhGia . " để xóa."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thực thi câu lệnh SQL: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>