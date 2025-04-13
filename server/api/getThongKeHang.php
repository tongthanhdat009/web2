<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy tham số từ request
$timeRange = isset($_GET['timeRange']) ? $_GET['timeRange'] : 'month';

// Xây dựng điều kiện thời gian
$timeCondition = "";
switch ($timeRange) {
    case 'week':
        $timeCondition = "AND DATE(hd.NgayDuyet) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;
    case 'month':
        $timeCondition = "AND DATE(hd.NgayDuyet) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
    case 'year':
        $timeCondition = "AND DATE(hd.NgayDuyet) >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)";
        break;
    default: // 'all' hoặc không xác định
        $timeCondition = "";
        break;
}

// SQL query để lấy doanh thu theo hãng
$sql = "SELECT 
            h.MaHang,
            h.TenHang,
            COUNT(cthd.Seri) AS SoLuong,
            SUM(cthd.GiaBan) AS TongDoanhThu
        FROM chitiethoadon cthd
        JOIN khohang kh ON cthd.Seri = kh.Seri
        JOIN hanghoa hh ON kh.MaHangHoa = hh.MaHangHoa
        JOIN hang h ON hh.MaHang = h.MaHang
        JOIN hoadon hd ON cthd.MaHoaDon = hd.MaHoaDon
        WHERE hd.TrangThai = '1' $timeCondition AND kh.TinhTrang = '1'
        GROUP BY h.MaHang, h.TenHang
        ORDER BY TongDoanhThu DESC";

// Debug SQL
error_log("SQL Query: " . $sql);

$result = $conn->query($sql);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Thêm thông tin debug vào response
$response = [
    "success" => true, 
    "data" => $data,
    "debug" => [
        "currentDate" => date("Y-m-d H:i:s"),
        "timeCondition" => $timeCondition,
        "totalRecords" => count($data)
    ]
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit();
?>