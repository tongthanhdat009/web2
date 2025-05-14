<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (isset($data->TrangThai) && isset($data->IDTaiKhoan)) {
    $trangThai = $data->TrangThai;
    $idTaiKhoan = $data->IDTaiKhoan;

    $query = "UPDATE taikhoan SET TrangThai = ? WHERE IDTaiKhoan = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $trangThai, $idTaiKhoan);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật trạng thái thành công."]);
    } else {
        echo json_encode(["success" => false, "message" => "Cập nhật thất bại."]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu đầu vào."]);
}

$conn->close();
?>