<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

include_once '../../config/Database.php';

// Kiểm tra nếu phương thức là OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kiểm tra nếu phương thức không phải DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Chỉ chấp nhận phương thức DELETE"]);
    exit();
}

// Kiểm tra nếu không có tham số 'IDQuyen'
if (!isset($_GET['IDQuyen'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu tham số 'IDQuyen'"]);
    exit();
}

$IDQuyen = $_GET['IDQuyen'];

$database = new Database();
$conn = $database->getConnection();

// Câu lệnh SQL để xóa dữ liệu
$query = "DELETE FROM phanquyen WHERE IDQuyen = ?";
$stmt = $conn->prepare($query);

// Gán giá trị tham số
$stmt->bind_param("i", $IDQuyen); // Sử dụng kiểu INT vì IDQuyen thường là số nguyên

// Thực thi truy vấn
if ($stmt->execute()) {
    // Kiểm tra số dòng bị ảnh hưởng (số bản ghi bị xóa)
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Xóa phân quyền thành công."]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Không tìm thấy phân quyền với IDQuyen được cung cấp."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi khi thực hiện xóa phân quyền."]);
}

// Đóng kết nối
$stmt->close();
$conn->close();
?>