<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$sql = "SELECT hoadon.MaHoaDon, hoadon.IDTaiKhoan, hoadon.NgayXuatHoaDon, hoadon.NgayDuyet, hoadon.TrangThai, SUM(khohang.GiaBan) AS TongTien
FROM hoadon
JOIN chitiethoadon ON chitiethoadon.MaHoaDon = hoadon.MaHoaDon
JOIN khohang ON khohang.Seri = chitiethoadon.Seri
GROUP BY hoadon.MaHoaDon, hoadon.IDTaiKhoan, hoadon.NgayXuatHoaDon, hoadon.NgayDuyet, hoadon.TrangThai";
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
