<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, POST"); // Allow POST for compatibility
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection(); // mysqli connection

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->IDChucNang)) {
    $idChucNang = htmlspecialchars(strip_tags($data->IDChucNang));

    // Check if the ChucNang is used in the phanquyen table
    $check_usage_query = "SELECT COUNT(*) as count FROM phanquyen WHERE IDChucNang = ?";
    $check_stmt = mysqli_prepare($conn, $check_usage_query);
    mysqli_stmt_bind_param($check_stmt, "i", $idChucNang);
    mysqli_stmt_execute($check_stmt);
    mysqli_stmt_bind_result($check_stmt, $usage_count);
    mysqli_stmt_fetch($check_stmt);
    mysqli_stmt_close($check_stmt);

    if ($usage_count > 0) {
        http_response_code(409); // Conflict
        echo json_encode(array("message" => "Không thể xóa chức năng này vì đang được sử dụng trong phân quyền."));
        return;
    }

    // Proceed with deletion if not in use
    $delete_query = "DELETE FROM chucnang WHERE IDChucNang = ?";
    $delete_stmt = mysqli_prepare($conn, $delete_query);
    mysqli_stmt_bind_param($delete_stmt, "i", $idChucNang);
    mysqli_stmt_execute($delete_stmt);

    if (mysqli_stmt_affected_rows($delete_stmt) > 0) {
        http_response_code(200); // OK
        echo json_encode(array(
            "success" => true,
            "message" => "Xóa chức năng thành công."
        ));
    } else {
        http_response_code(404); // Not Found
        echo json_encode(array("message" => "Không tìm thấy chức năng để xóa."));
    }

    mysqli_stmt_close($delete_stmt);

} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Không thể xóa chức năng. Thiếu IDChucNang."));
}
?>
