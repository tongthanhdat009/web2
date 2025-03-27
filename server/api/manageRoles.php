<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Lấy danh sách vai trò và quyền hạn
        $sql = "SELECT * FROM quyen";
        $result = $conn->query($sql);
        $roles = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($roles);
        break;

    case 'POST':
        // Thêm vai trò mới
        $data = json_decode(file_get_contents("php://input"), true);
        $tenQuyen = $data['TenQuyen'];

        // Check if role name already exists
        $checkRoleSql = "SELECT * FROM quyen WHERE TenQuyen = '$tenQuyen'";
        $checkRoleResult = $conn->query($checkRoleSql);
        if ($checkRoleResult->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Tên quyền đã tồn tại."]);
            exit;
        }

        $sql = "INSERT INTO quyen (TenQuyen) VALUES ('$tenQuyen')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;

    case 'PUT':
        // Cập nhật quyền hạn
        $data = json_decode(file_get_contents("php://input"), true);
        $idQuyen = $data['IDQuyen'];
        $tenQuyen = $data['TenQuyen'];
        $sql = "UPDATE quyen SET TenQuyen = '$tenQuyen' WHERE IDQuyen = $idQuyen";
        $conn->query($sql);
        echo json_encode(["success" => true]);
        break;

    case 'DELETE':
        // Xóa vai trò
        $idQuyen = $_GET['IDQuyen'];
        $sql = "DELETE FROM quyen WHERE IDQuyen = $idQuyen";
        $conn->query($sql);
        echo json_encode(["success" => true]);
        break;
}
?>
