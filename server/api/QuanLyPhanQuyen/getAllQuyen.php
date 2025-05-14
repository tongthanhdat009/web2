<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$query = "SELECT * FROM quyen WHERE Quyen.IDQuyen != '2' ORDER BY IDQuyen ASC";
$stmt = $conn->prepare($query);

if ($stmt->execute()) {
    // Store the result set to enable num_rows
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $quyens = array();

        // Bind the result variables
        $stmt->bind_result($IDQuyen, $TenQuyen);

        while ($stmt->fetch()) {
            $quyen = array(
                "IDQuyen" => $IDQuyen,
                "TenQuyen" => $TenQuyen,
            );

            $quyens[] = $quyen;
        }

        http_response_code(200);
        echo json_encode($quyens);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Không tìm thấy quyền nào."));
    }
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi khi thực hiện truy vấn."));
}
?>