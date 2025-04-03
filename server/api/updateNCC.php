<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['MaNhaCungCap']) && isset($data['TenNhaCungCap'])) {
        $maNhaCungCap = $conn->real_escape_string($data['MaNhaCungCap']);
        $tenNhaCungCap = $conn->real_escape_string($data['TenNhaCungCap']);


    // Kiểm tra 'xem TenNhaCungCap đã tồn tại chưa (trừ trường hợp đang sửa)
    $checkNameSql = "SELECT TenNhaCungCap FROM nhacungcap WHERE TenNhaCungCap = '$tenNhaCungCap' AND MaNhaCungCap != '$maNhaCungCap'";
    $checkNameResult = $conn->query($checkNameSql);

    if ($checkNameResult->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Tên Nhà Cung Cấp đã tồn tại !!"]);
    } else {
        $sql = "UPDATE nhacungcap 
                SET TenNhaCungCap = '$tenNhaCungCap' 
                WHERE MaNhaCungCap = '$maNhaCungCap'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Sửa nhà cung cấp thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Sửa nhà cung cấp thất bại"]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
}

$conn->close();
?>
