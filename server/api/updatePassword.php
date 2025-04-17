<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Kiểm tra phương thức HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lấy dữ liệu từ yêu cầu
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['userId'] ?? null;
    $newPassword = $data['newPassword'] ?? null;
    $role = $data['role'] ?? null; // 'customer' hoặc 'employee'

    // Kiểm tra dữ liệu đầu vào
    if (!$userId || !$newPassword || !$role) {
        echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ.']);
        exit;
    }

    // Hash mật khẩu mới
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // Xác định bảng cần cập nhật
    $table = $role === 'customer' ? 'nguoidung' : ($role === 'employee' ? 'nhanvien' : null);

    if (!$table) {
        echo json_encode(['success' => false, 'message' => 'Vai trò không hợp lệ.']);
        exit;
    }

    // Kiểm tra xem người dùng có tồn tại không
    $checkSql = "SELECT IDTaiKhoan FROM $table WHERE MaNguoiDung = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param('i', $userId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Người dùng không tồn tại.']);
        exit;
    }

    $row = $result->fetch_assoc();
    $idTaiKhoan = $row['IDTaiKhoan'];

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    $sql = "UPDATE taikhoan SET matKhau = ? WHERE IDTaiKhoan = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $hashedPassword, $idTaiKhoan);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cập nhật mật khẩu thành công.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cập nhật mật khẩu thất bại.']);
    }

    $stmt->close();
    $checkStmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Phương thức không hợp lệ.']);
}
?>
