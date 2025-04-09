<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

try {
    $sql = "SELECT IDChucNang, TenChucNang FROM chucnang ORDER BY IDChucNang";
    $result = $conn->query($sql);
    
    $functions = array();
    while($row = $result->fetch_assoc()) {
        $functions[] = $row;
    }
    
    echo json_encode($functions);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi khi lấy dữ liệu: " . $e->getMessage()));
}
?>