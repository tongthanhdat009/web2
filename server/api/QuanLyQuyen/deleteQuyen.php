<?php
// filepath: c:\xampp\htdocs\web2\server\api\QuanLyQuyen\deleteQuyen.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS"); // DELETE cũng là một lựa chọn hợp lý
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$host = "localhost";
$dbname = "ql_cuahangdungcu"; // Thay đổi nếu tên database của bạn khác
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

if (!isset($data->IDQuyen) || !is_numeric($data->IDQuyen) || $data->IDQuyen <= 0) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "Thiếu hoặc IDQuyen không hợp lệ."]);
    $conn->close();
    exit();
}

$idQuyen = (int)$data->IDQuyen;

// Bước 1: Kiểm tra xem IDQuyen có đang được sử dụng trong bảng taikhoan không
$sql_check_taikhoan = "SELECT COUNT(*) as count FROM taikhoan WHERE IDQuyen = ?";
$stmt_check_taikhoan = $conn->prepare($sql_check_taikhoan);

if ($stmt_check_taikhoan === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh kiểm tra tài khoản: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt_check_taikhoan->bind_param("i", $idQuyen);
$stmt_check_taikhoan->execute();
$result_check_taikhoan = $stmt_check_taikhoan->get_result();
$row_check_taikhoan = $result_check_taikhoan->fetch_assoc();
$stmt_check_taikhoan->close();

if ($row_check_taikhoan['count'] > 0) {
    http_response_code(409); // Conflict - Hoặc 400 Bad Request
    echo json_encode(["success" => false, "error" => "Không thể xóa quyền này vì đang có " . $row_check_taikhoan['count'] . " tài khoản sử dụng."]);
    $conn->close();
    exit();
}

// Bước 2: Nếu không có tài khoản nào sử dụng, tiến hành xóa quyền
$sql_delete_quyen = "DELETE FROM quyen WHERE IDQuyen = ?";
$stmt_delete_quyen = $conn->prepare($sql_delete_quyen);

if ($stmt_delete_quyen === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh xóa quyền: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt_delete_quyen->bind_param("i", $idQuyen);

if ($stmt_delete_quyen->execute()) {
    if ($stmt_delete_quyen->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Quyền ID " . $idQuyen . " đã được xóa thành công."]);
    } else {
        // Không có dòng nào được xóa, có thể IDQuyen không tồn tại
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "error" => "Không tìm thấy quyền với ID " . $idQuyen . " để xóa."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thực thi câu lệnh xóa quyền: " . $stmt_delete_quyen->error]);
}

$stmt_delete_quyen->close();
$conn->close();
?>