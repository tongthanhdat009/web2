<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$db = $database->getConnection(); // This is returning a mysqli connection

// Assuming the table name is 'chucnang' and columns are 'IDChucNang', 'TenChucNang'
$query = "SELECT IDChucNang, TenChucNang FROM chucnang ORDER BY IDChucNang ASC";

try {
    $stmt = $db->prepare($query);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(array("message" => "Lỗi khi chuẩn bị truy vấn: " . $db->error));
        exit;
    }

    if ($stmt->execute()) {
        $result = $stmt->get_result(); // Get the result set from the prepared statement
        $chucNangItems = array(); 

        // Loop through the results and build the array
        while ($row = $result->fetch_assoc()) { // Use fetch_assoc() on the result set
            $chucNangItem = array(
                "IDChucNang" => isset($row['IDChucNang']) ? $row['IDChucNang'] : null,
                "TenChucNang" => isset($row['TenChucNang']) ? $row['TenChucNang'] : null
            );
            $chucNangItems[] = $chucNangItem;
        }
        $stmt->close(); // Close the statement

        if (!empty($chucNangItems)) {
            http_response_code(200);
            echo json_encode(array("data" => $chucNangItems));
        } else {
            http_response_code(200); 
            echo json_encode(
                array("data" => [], "message" => "Không tìm thấy chức năng nào.")
            );
        }
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Lỗi khi thực hiện truy vấn: " . $stmt->error));
    }
} catch (Exception $exception) { // Catch generic Exception for mysqli errors if not PDOException
    http_response_code(500);
    echo json_encode(
        array("message" => "Lỗi khi truy vấn dữ liệu chức năng: " . $exception->getMessage())
    );
}
$db->close(); // Close the database connection
?>