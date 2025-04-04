<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy tham số từ request
$mode = isset($_GET['mode']) ? $_GET['mode'] : 'quantity'; // quantity hoặc value
$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) && $_GET['limit'] > 0 ? (int)$_GET['limit'] : 0;

// Chuẩn bị SQL query
$orderBy = $mode === 'value' ? "TongGiaTri DESC" : "SoLuong DESC";
$limitClause = $limit > 0 ? "LIMIT $limit" : "";

// Thiết lập SQL query theo schema mới
$sql = "SELECT  h.TenHang
FROM phieunhap pn 
JOIN khohang kh ON pn.MaPhieuNhap = kh.MaPhieuNhap
 JOIN hanghoa hh ON hh.MaHangHoa = kh.MaHangHoa 
 JOIN hang h ON hh.MaHang = h.MaHang 
 WHERE pn.TrangThai = N'Đã Nhập' 
 GROUP BY hh.TenHangHoa;";

$result = $conn->query($sql);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $data], JSON_UNESCAPED_UNICODE);
exit();
?>