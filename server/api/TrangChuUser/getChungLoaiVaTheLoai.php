<?php
// filepath: f:\xampp\htdocs\web2\server\api\TrangChuUser\getChungLoaiVaTheLoai.php

// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình CORS và Content-Type
header("Access-Control-Allow-Origin: *"); // Cho phép truy cập từ mọi nguồn gốc
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Chỉ cho phép GET và OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Chỉ chấp nhận phương thức GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ."]);
    exit();
}

// Include file cấu hình database
require_once "../../config/Database.php";

// Khởi tạo kết nối database
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if (!$conn) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "success" => false,
        "message" => "Lỗi kết nối cơ sở dữ liệu."
    ]);
    exit();
}

// Câu truy vấn SQL để lấy chủng loại và mã thể loại tương ứng
// Thêm cả TenTheLoai từ bảng theloai để có thông tin đầy đủ hơn
$sql = "SELECT cl.MaChungLoai, cl.TenChungLoai, cl.MaTheLoai, tl.TenTheLoai
        FROM chungloai cl
        LEFT JOIN theloai tl ON cl.MaTheLoai = tl.MaTheLoai
        ORDER BY tl.MaTheLoai, cl.MaChungLoai"; // Sắp xếp để dễ nhóm theo thể loại ở frontend (tùy chọn)

$stmt = $conn->prepare($sql);

// Kiểm tra lỗi prepare
if ($stmt === false) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi chuẩn bị truy vấn: " . $conn->error
    ]);
    $conn->close();
    exit();
}

// Thực thi truy vấn
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $data = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Chuyển đổi kiểu dữ liệu nếu cần (ví dụ: MaTheLoai thành số)
            if (isset($row['MaTheLoai']) && is_numeric($row['MaTheLoai'])) {
                $row['MaTheLoai'] = (int)$row['MaTheLoai'];
            }
            $data[] = $row;
        }
        http_response_code(200); // OK
        echo json_encode([
            "success" => true,
            "data" => $data
        ]);
    } else {
        http_response_code(200); // OK, nhưng không có dữ liệu
        echo json_encode([
            "success" => true,
            "data" => [], // Trả về mảng rỗng
            "message" => "Không tìm thấy dữ liệu chủng loại hoặc thể loại."
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi thực thi truy vấn: " . $stmt->error
    ]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>