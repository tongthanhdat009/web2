<?php
// filepath: c:\xampp\htdocs\web2\server\api\QuanLyDanhGia\duyetDanhGia.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS"); // Cho phép POST hoặc PUT
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
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->IDDanhGia)) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "Thiếu IDDanhGia."]);
    $conn->close();
    exit();
}

$idDanhGia = $data->IDDanhGia;
$newStatus = 'Đã duyệt'; // Trạng thái mới

// Câu lệnh SQL để cập nhật trạng thái
$sql = "UPDATE DanhGia SET TrangThai = ? WHERE IDDanhGia = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh SQL: " . $conn->error]);
    $conn->close();
    exit();
}

// Gán tham số
$stmt->bind_param("si", $newStatus, $idDanhGia); // "s" for string (TrangThai), "i" for integer (IDDanhGia)

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Đánh giá ID " . $idDanhGia . " đã được duyệt thành công."]);
    } else {
        // Không có dòng nào được cập nhật, có thể IDDanhGia không tồn tại hoặc trạng thái đã là 'Đã duyệt'
        http_response_code(404); // Not Found hoặc có thể là 200 với message khác
        echo json_encode(["success" => false, "error" => "Không tìm thấy đánh giá với ID " . $idDanhGia . " hoặc trạng thái không thay đổi."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thực thi câu lệnh SQL: " . $stmt->error]);
}

$stmt->close();
$conn->close();