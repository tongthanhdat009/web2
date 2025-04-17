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

if (isset($data['MaKhuyenMai']) && isset($data['TenKhuyenMai']) && isset($data['MoTaKhuyenMai']) && isset($data['PhanTram'])) {
    $maKhuyenMai = $conn->real_escape_string($data['MaKhuyenMai']);
    $tenKhuyenMai = $conn->real_escape_string($data['TenKhuyenMai']);
    $moTaKhuyenMai = $conn->real_escape_string($data['MoTaKhuyenMai']);
    $phanTram = (int)$data['PhanTram'];

    // Kiểm tra 'xem TenKhuyenMai đã tồn tại chưa (trừ trường hợp đang sửa)
    $checkNameSql = "SELECT TenKhuyenMai FROM khuyenmai WHERE TenKhuyenMai = '$tenKhuyenMai' AND MaKhuyenMai != '$maKhuyenMai'";
    $checkNameResult = $conn->query($checkNameSql);

    if ($checkNameResult->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Tên Khuyến Mãi đã tồn tại !!"]);
    } else {
        $sql = "UPDATE khuyenmai 
                SET TenKhuyenMai = '$tenKhuyenMai', MoTaKhuyenMai = '$moTaKhuyenMai', PhanTram = $phanTram 
                WHERE MaKhuyenMai = '$maKhuyenMai'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Sửa khuyến mãi thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Sửa khuyến mãi thất bại"]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
}

$conn->close();
?>
