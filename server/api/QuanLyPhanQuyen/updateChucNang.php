<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST"); // Allow POST as well for compatibility
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Check if required data is present
if (
    !empty($data->IDChucNang) &&
    !empty($data->TenChucNang)
) {
    // Basic validation
    if (trim($data->TenChucNang) === '') {
        http_response_code(400);
        echo json_encode(array("message" => "Tên chức năng không được để trống."));
        return;
    }

    // Check if the new TenChucNang already exists for a *different* IDChucNang
    $check_query = "SELECT IDChucNang FROM chucnang WHERE TenChucNang = :TenChucNang AND IDChucNang != :IDChucNang LIMIT 0,1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':TenChucNang', $data->TenChucNang);
    $check_stmt->bindParam(':IDChucNang', $data->IDChucNang);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(array("message" => "Tên chức năng đã tồn tại."));
        return;
    }

    // Proceed with update
    $query = "UPDATE chucnang SET TenChucNang = :TenChucNang WHERE IDChucNang = :IDChucNang";
    $stmt = $db->prepare($query);

    // Sanitize
    $idChucNang = htmlspecialchars(strip_tags($data->IDChucNang));
    $tenChucNang = htmlspecialchars(strip_tags($data->TenChucNang));

    // Bind values
    $stmt->bindParam(':TenChucNang', $tenChucNang);
    $stmt->bindParam(':IDChucNang', $idChucNang);

    try {
        if ($stmt->execute()) {
            // Check if any row was actually updated
            if ($stmt->rowCount() > 0) {
                http_response_code(200); // OK
                echo json_encode(array(
                    "success" => true,
                    "message" => "Cập nhật chức năng thành công."
                ));
            } else {
                // This could mean the IDChucNang didn't exist, or the data was the same
                http_response_code(404); // Not Found (or 304 Not Modified if data was same)
                echo json_encode(array("message" => "Không tìm thấy chức năng hoặc không có gì thay đổi."));
            }
        } else {
            // Log error
            http_response_code(503); // Service Unavailable
            echo json_encode(array("message" => "Không thể cập nhật chức năng. Lỗi cơ sở dữ liệu."));
        }
    } catch (PDOException $exception) {
        // Log exception
        http_response_code(500);
        echo json_encode(array("message" => "Lỗi khi cập nhật chức năng: " . $exception->getMessage()));
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Không thể cập nhật chức năng. Dữ liệu không đầy đủ (thiếu ID hoặc Tên)."));
}
?>
