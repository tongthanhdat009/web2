<?php
// filepath: c:\xampp\htdocs\web2\server\api\QuanLyQuyen\getQuyen.php
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

// Câu lệnh SQL để lấy tất cả các quyền
$sql = "SELECT * FROM quyen";
$result = $conn->query($sql);

if ($result === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thực thi câu lệnh SQL: " . $conn->error]);
    $conn->close();
    exit();
}

$quyens = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Chuyển đổi các giá trị Them, Xoa, Sua, Xem từ chuỗi sang boolean hoặc số nếu cần
        // Ví dụ, nếu trong DB lưu là '0'/'1' và bạn muốn boolean true/false:
        // $row['Them'] = (bool)$row['Them'];
        // $row['Xoa'] = (bool)$row['Xoa'];
        // $row['Sua'] = (bool)$row['Sua'];
        // $row['Xem'] = (bool)$row['Xem'];
        // Hoặc nếu bạn muốn số 0/1:
        // $row['Them'] = (int)$row['Them'];
        // $row['Xoa'] = (int)$row['Xoa'];
        // $row['Sua'] = (int)$row['Sua'];
        // $row['Xem'] = (int)$row['Xem'];
        $quyens[] = $row;
    }
    http_response_code(200);
    echo json_encode(["success" => true, "data" => $quyens]);
} else {
    http_response_code(200); // Hoặc 404 nếu bạn coi không có quyền nào là lỗi
    echo json_encode(["success" => true, "data" => [], "message" => "Không có quyền nào trong hệ thống."]);
}

$conn->close();
?>