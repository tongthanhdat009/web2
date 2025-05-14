<?php
// filepath: c:\xampp\htdocs\web2\server\api\QuanLyQuyen\addQuyen.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if (!isset($data->TenQuyen) || empty(trim($data->TenQuyen))) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "Thiếu hoặc tên quyền không hợp lệ."]);
    $conn->close();
    exit();
}

$tenQuyen = trim($data->TenQuyen);

// Kiểm tra xem TenQuyen đã tồn tại chưa
$sql_check = "SELECT IDQuyen FROM quyen WHERE TenQuyen = ?";
$stmt_check = $conn->prepare($sql_check);
if ($stmt_check === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh kiểm tra: " . $conn->error]);
    $conn->close();
    exit();
}
$stmt_check->bind_param("s", $tenQuyen);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(["success" => false, "error" => "Tên quyền '" . htmlspecialchars($tenQuyen) . "' đã tồn tại."]);
    $stmt_check->close();
    $conn->close();
    exit();
}
$stmt_check->close();

// Câu lệnh SQL để thêm quyền mới
$sql_insert = "INSERT INTO quyen (TenQuyen) VALUES (?)";
$stmt_insert = $conn->prepare($sql_insert);

if ($stmt_insert === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh INSERT: " . $conn->error]);
    $conn->close();
    exit();
}

// Gán tham số
$stmt_insert->bind_param("s", $tenQuyen);

if ($stmt_insert->execute()) {
    $last_id = $conn->insert_id; // Lấy ID của bản ghi vừa thêm
    http_response_code(201); // Created
    echo json_encode([
        "success" => true,
        "message" => "Quyền '" . htmlspecialchars($tenQuyen) . "' đã được thêm thành công.",
        "quyen" => [
            "IDQuyen" => $last_id,
            "TenQuyen" => $tenQuyen
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thực thi câu lệnh SQL: " . $stmt_insert->error]);
}

$stmt_insert->close();
$conn->close();
?>