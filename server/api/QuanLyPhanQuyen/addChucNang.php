<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->TenChucNang)
) {
    // Basic validation: Check if TenChucNang is not just whitespace
    if (trim($data->TenChucNang) === '') {
        http_response_code(400);
        echo json_encode(array("message" => "Tên chức năng không được để trống."));
        return;
    }

    // Check if TenChucNang already exists
    $check_query = "SELECT IDChucNang FROM chucnang WHERE TenChucNang = :TenChucNang LIMIT 0,1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':TenChucNang', $data->TenChucNang);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(array("message" => "Tên chức năng đã tồn tại."));
        return;
    }

    // Proceed with insertion
    $query = "INSERT INTO chucnang (TenChucNang) VALUES (:TenChucNang)";
    $stmt = $db->prepare($query);

    // Sanitize
    $tenChucNang = htmlspecialchars(strip_tags($data->TenChucNang));

    // Bind values
    $stmt->bindParam(":TenChucNang", $tenChucNang);

    try {
        if ($stmt->execute()) {
            $lastId = $db->lastInsertId();
            http_response_code(201); // Created
            echo json_encode(array(
                "success" => true,
                "message" => "Thêm chức năng thành công.",
                "data" => array(
                    "IDChucNang" => $lastId,
                    "TenChucNang" => $tenChucNang // Return the sanitized name
                )
            ));
        } else {
            // Log the error internally if possible
            // error_log("Database error: " . implode(":", $stmt->errorInfo()));
            http_response_code(503); // Service Unavailable
            echo json_encode(array("message" => "Không thể thêm chức năng. Lỗi cơ sở dữ liệu."));
        }
    } catch (PDOException $exception) {
        // Log the exception internally if possible
        // error_log("PDOException: " . $exception->getMessage());
        http_response_code(500);
        echo json_encode(array("message" => "Lỗi khi thêm chức năng: " . $exception->getMessage()));
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Không thể thêm chức năng. Dữ liệu không đầy đủ."));
}
?>
