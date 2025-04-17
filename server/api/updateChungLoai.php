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

if (isset($data['MaChungLoai']) && isset($data['TenChungLoai']) && isset($data['MaTheLoai'])) {
    $maChungLoai = $conn->real_escape_string($data['MaChungLoai']);
    $tenChungLoai = $conn->real_escape_string($data['TenChungLoai']);
    $maTheLoai = $conn->real_escape_string($data['MaTheLoai']);

    // Kiểm tra xem TenChungLoai đã tồn tại chưa (trừ trường hợp đang sửa)
    $checkNameSql = "SELECT TenChungLoai FROM chungloai WHERE TenChungLoai = '$tenChungLoai' AND MaChungLoai != '$maChungLoai'";
    $checkNameResult = $conn->query($checkNameSql);

    if ($checkNameResult->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Tên Chủng Loại đã tồn tại !!"]);
    } else {
        $sql = "UPDATE chungloai 
                SET TenChungLoai = '$tenChungLoai', MaTheLoai = '$maTheLoai' 
                WHERE MaChungLoai = '$maChungLoai'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Sửa chủng loại thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Sửa chủng loại thất bại"]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
}

$conn->close();
?>