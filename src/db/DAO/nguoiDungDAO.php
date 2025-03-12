<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../DataBaseConfig.php";

// Khởi tạo đối tượng DatabaseConfig và lấy kết nối cơ sở dữ liệu
$dbConfig = new DatabaseConfig();
$conn = $dbConfig->getConnection();

// Kiểm tra xem biến $conn có tồn tại và được khởi tạo đúng cách không
if (!$conn) {
    die("Kết nối cơ sở dữ liệu không thành công.");
}

$sql = "SELECT * FROM nguoidung";
$result = $conn->query($sql);

$users = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);
$conn->close();
?>