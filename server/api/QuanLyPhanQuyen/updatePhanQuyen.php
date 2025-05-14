<?php
// Cấu hình CORS
header("Access-Control-Allow-Origin: http://localhost:5173"); // Thay đổi thành origin của bạn
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true"); // Cho phép cookie hoặc thông tin xác thực

// Ghi log lỗi PHP (Chỉ bật trong môi trường phát triển)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// **Xử lý yêu cầu preflight (OPTIONS)**
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Trả về trạng thái HTTP 200 OK cho preflight request
    exit();
}

// **Kiểm tra phương thức HTTP**
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// **Đọc payload JSON**
$data = json_decode(file_get_contents("php://input"), true);

// **Ghi log payload nhận được (phục vụ debug)**
file_put_contents('php://stderr', "Payload received: " . print_r($data, true));

// **Kiểm tra payload**
if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
    exit();
}

if (!isset($data['IDQuyen'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing IDQuyen"]);
    exit();
}

if (!isset($data['TenQuyen'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing TenQuyen"]);
    exit();
}

if (!isset($data['ChucNangToAddOrUpdate']) || !is_array($data['ChucNangToAddOrUpdate'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid or missing ChucNangToAddOrUpdate"]);
    exit();
}

if (!isset($data['ChucNangToDelete']) || !is_array($data['ChucNangToDelete'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid or missing ChucNangToDelete"]);
    exit();
}

// Gán dữ liệu từ payload
$IDQuyen = $data['IDQuyen'];
$TenQuyen = $data['TenQuyen'];
$ChucNangToAddOrUpdate = $data['ChucNangToAddOrUpdate'];
$ChucNangToDelete = $data['ChucNangToDelete'];

// Kết nối cơ sở dữ liệu
include_once '../../config/Database.php';
$database = new Database();
$conn = $database->getConnection();

try {
    // **Bắt đầu giao dịch**
    $conn->begin_transaction();

    // **Xử lý thêm hoặc cập nhật**
    $addOrUpdateQuery = "
        INSERT INTO phanquyen (IDChucNang, IDQuyen, Them, Xoa, Sua)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        Them = VALUES(Them), Xoa = VALUES(Xoa), Sua = VALUES(Sua)";
    $addOrUpdateStmt = $conn->prepare($addOrUpdateQuery);
    if ($addOrUpdateStmt === false) {
        file_put_contents('php://stderr', "Prepare failed: " . $conn->error . "\n");
        throw new Exception("Failed to prepare statement for addOrUpdateQuery");
    }

    foreach ($ChucNangToAddOrUpdate as $chucNang) {
        if (
            !isset($chucNang['IDChucNang']) ||
            !isset($chucNang['Xem']) ||
            !isset($chucNang['Them']) ||
            !isset($chucNang['Xoa']) ||
            !isset($chucNang['Sua'])
        ) {
            throw new Exception("Invalid data in ChucNangToAddOrUpdate");
        }

        $addOrUpdateStmt->bind_param(
            "iiiii",
            $chucNang['IDChucNang'],
            $IDQuyen,
            $chucNang['Them'],
            $chucNang['Xoa'],
            $chucNang['Sua']
        );

        if (!$addOrUpdateStmt->execute()) {
            file_put_contents('php://stderr', "Execute failed: " . $addOrUpdateStmt->error . "\n");
            throw new Exception("Failed to execute addOrUpdateStmt");
        }
        file_put_contents('php://stderr', "Added/Updated IDChucNang: " . $chucNang['IDChucNang'] . "\n");
    }

    // **Xử lý xóa**
    $deleteQuery = "DELETE FROM phanquyen WHERE IDQuyen = ? AND IDChucNang = ?";
    $deleteStmt = $conn->prepare($deleteQuery);
    if ($deleteStmt === false) {
        file_put_contents('php://stderr', "Prepare failed: " . $conn->error . "\n");
        throw new Exception("Failed to prepare statement for deleteQuery");
    }

    foreach ($ChucNangToDelete as $chucNang) {
        if (!isset($chucNang['IDChucNang'])) {
            throw new Exception("Invalid data in ChucNangToDelete");
        }

        $deleteStmt->bind_param("ii", $IDQuyen, $chucNang['IDChucNang']);
        if (!$deleteStmt->execute()) {
            file_put_contents('php://stderr', "Execute failed: " . $deleteStmt->error . "\n");
            throw new Exception("Failed to execute deleteStmt");
        }
        file_put_contents('php://stderr', "Deleted IDChucNang: " . $chucNang['IDChucNang'] . "\n");
    }

    // **Commit giao dịch**
    $conn->commit();
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
} catch (Exception $e) {
    // **Rollback giao dịch nếu lỗi**
    $conn->rollback();
    file_put_contents('php://stderr', "Transaction failed: " . $e->getMessage() . "\n");
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật", "error" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>