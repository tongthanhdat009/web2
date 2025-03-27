<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['hoTen']) && !empty($data['ngaySinh']) && !empty($data['email']) && !empty($data['gioiTinh'])) {
    $hoTen = $conn->real_escape_string($data['hoTen']);
    $ngaySinh = $conn->real_escape_string($data['ngaySinh']);
    $email = $conn->real_escape_string($data['email']);
    $gioiTinh = $conn->real_escape_string($data['gioiTinh']);

    // Check if email already exists
    $checkEmailSql = "SELECT * FROM nguoidung WHERE Email = '$email'";
    $checkEmailResult = $conn->query($checkEmailSql);
    if ($checkEmailResult->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email đã tồn tại."]);
        exit;
    }

    $sql = "INSERT INTO nguoidung (HoTen, GioiTinh, Email) VALUES ('$hoTen', '$gioiTinh', '$email')";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
}
?>
