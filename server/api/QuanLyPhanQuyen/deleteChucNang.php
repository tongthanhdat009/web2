<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, POST"); // Allow POST for compatibility
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$db = $database->getConnection();

// Get input data (assuming ID is sent in the body for DELETE/POST)
$data = json_decode(file_get_contents("php://input"));

// Check if IDChucNang is provided
if (!empty($data->IDChucNang)) {
    $idChucNang = htmlspecialchars(strip_tags($data->IDChucNang));

    // Check if the ChucNang is used in the phanquyen table
    // Assuming the linking table is 'phanquyen' with columns 'IDQuyen', 'IDChucNang'
    $check_usage_query = "SELECT COUNT(*) as count FROM phanquyen WHERE IDChucNang = :IDChucNang";
    $check_stmt = $db->prepare($check_usage_query);
    $check_stmt->bindParam(':IDChucNang', $idChucNang);

    try {
        $check_stmt->execute();
        $row = $check_stmt->fetch(PDO::FETCH_ASSOC);
        $usage_count = $row['count'];

        if ($usage_count > 0) {
            // ChucNang is in use, cannot delete
            http_response_code(409); // Conflict
            echo json_encode(array("message" => "Không thể xóa chức năng này vì đang được sử dụng trong phân quyền."));
            return;
        }

        // Proceed with deletion if not in use
        $delete_query = "DELETE FROM chucnang WHERE IDChucNang = :IDChucNang";
        $delete_stmt = $db->prepare($delete_query);
        $delete_stmt->bindParam(':IDChucNang', $idChucNang);

        if ($delete_stmt->execute()) {
            // Check if a row was actually deleted
            if ($delete_stmt->rowCount() > 0) {
                http_response_code(200); // OK
                echo json_encode(array(
                    "success" => true,
                    "message" => "Xóa chức năng thành công."
                ));
            } else {
                // IDChucNang not found
                http_response_code(404); // Not Found
                echo json_encode(array("message" => "Không tìm thấy chức năng để xóa."));
            }
        } else {
            // Log error
            http_response_code(503); // Service Unavailable
            echo json_encode(array("message" => "Không thể xóa chức năng. Lỗi cơ sở dữ liệu."));
        }

    } catch (PDOException $exception) {
        // Log exception
        http_response_code(500);
        echo json_encode(array("message" => "Lỗi khi xóa chức năng: " . $exception->getMessage()));
    }

} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Không thể xóa chức năng. Thiếu IDChucNang."));
}
?>
