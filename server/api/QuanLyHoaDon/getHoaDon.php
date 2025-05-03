<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$sql = "SELECT hoadon.MaHoaDon, hoadon.IDTaiKhoan, hoadon.NgayXuatHoaDon, hoadon.NgayDuyet, hoadon.TrangThai, SUM(chitiethoadon.GiaBan) AS TongTien
        FROM chitiethoadon, hoadon
        WHERE chitiethoadon.MaHoaDon = hoadon.MaHoaDon
        GROUP BY hoadon.MaHoaDon";
$result = $conn->query($sql);

$products = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $products], JSON_UNESCAPED_UNICODE);
exit();
?>
