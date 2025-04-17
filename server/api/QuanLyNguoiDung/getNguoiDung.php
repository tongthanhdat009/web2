<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$sql = "SELECT * FROM nguoidung";
$result = $conn->query($sql);   

$users = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Ẩn mật khẩu khi trả về dữ liệu
        if (isset($row['MatKhau'])) {
            unset($row['MatKhau']);
        }
        $users[] = $row;
    }
}

// Xuất dữ liệu dưới dạng JSON hợp lệ
echo json_encode(["success" => true, "data" => $users], JSON_UNESCAPED_UNICODE);
exit();
?>