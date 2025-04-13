<?php
// filepath: f:\xampp\htdocs\web2\server\api\getThongKeHoaDon.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy tham số từ request
$timeFrame = isset($_GET['timeFrame']) ? $_GET['timeFrame'] : 'monthly';
$status = isset($_GET['status']) ? $_GET['status'] : 'all';

// Chuẩn bị điều kiện trạng thái
$statusCondition = "";
if ($status !== 'all') {
    switch ($status) {
        case 'completed':
            $statusCondition = "AND hoadon.TrangThai = '1'";
            break;
        case 'pending':
            $statusCondition = "AND hoadon.TrangThai = '2'";
            break;
        case 'cancelled':
            $statusCondition = "AND hoadon.TrangThai = '0'";
            break;
    }
}

// Chuẩn bị SQL query dựa theo timeFrame
$sql = "";

switch ($timeFrame) {
    case 'daily':
        // Lấy dữ liệu theo ngày (30 ngày gần đây)
        $sql = "SELECT 
                    MONTH(hoadon.NgayDuyet) as Month,
                    YEAR(hoadon.NgayDuyet) as Year,
                    SUM(chitiethoadon.GiaBan) as TongTien,
                    COUNT(DISTINCT hoadon.MaHoaDon) as SoLuongDonHang
                FROM hoadon
                JOIN chitiethoadon ON hoadon.MaHoaDon = chitiethoadon.MaHoaDon
                JOIN khohang ON khohang.Seri = chitiethoadon.Seri
                WHERE hoadon.NgayDuyet >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                $statusCondition
                GROUP BY YEAR(hoadon.NgayDuyet), MONTH(hoadon.NgayDuyet)
                ORDER BY YEAR(hoadon.NgayDuyet), MONTH(hoadon.NgayDuyet)";
        break;
    
    case 'monthly':
        // Lấy dữ liệu theo tháng (12 tháng gần đây)
        $sql = "SELECT 
                    MONTH(hoadon.NgayDuyet) as Month,
                    YEAR(hoadon.NgayDuyet) as Year,
                    SUM(chitiethoadon.GiaBan) as TongTien,
                    COUNT(DISTINCT hoadon.MaHoaDon) as SoLuongDonHang
                FROM hoadon
                JOIN chitiethoadon ON hoadon.MaHoaDon = chitiethoadon.MaHoaDon
                JOIN khohang ON khohang.Seri = chitiethoadon.Seri
                WHERE hoadon.NgayDuyet >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                $statusCondition
                GROUP BY YEAR(hoadon.NgayDuyet), MONTH(hoadon.NgayDuyet)
                ORDER BY YEAR(hoadon.NgayDuyet), MONTH(hoadon.NgayDuyet)";
        break;
    
    case 'quarterly':
        // Lấy dữ liệu theo quý (4 quý gần đây)
        $sql = "SELECT 
                    QUARTER(hoadon.NgayDuyet) as Quarter,
                    YEAR(hoadon.NgayDuyet) as Year,
                    SUM(chitiethoadon.GiaBan) as TongTien,
                    COUNT(DISTINCT hoadon.MaHoaDon) as SoLuongDonHang
                FROM hoadon
                JOIN chitiethoadon ON hoadon.MaHoaDon = chitiethoadon.MaHoaDon
                JOIN khohang ON khohang.Seri = chitiethoadon.Seri
                WHERE hoadon.NgayDuyet >= DATE_SUB(NOW(), INTERVAL 4 QUARTER)
                $statusCondition
                GROUP BY YEAR(hoadon.NgayDuyet), QUARTER(hoadon.NgayDuyet)
                ORDER BY YEAR(hoadon.NgayDuyet), QUARTER(hoadon.NgayDuyet)";
        break;
    
    case 'yearly':
        // Lấy dữ liệu theo năm (5 năm gần đây)
        $sql = "SELECT 
                    YEAR(hoadon.NgayDuyet) as Year,
                    SUM(chitiethoadon.GiaBan) as TongTien,
                    COUNT(DISTINCT hoadon.MaHoaDon) as SoLuongDonHang
                FROM hoadon
                JOIN chitiethoadon ON hoadon.MaHoaDon = chitiethoadon.MaHoaDon
                JOIN khohang ON khohang.Seri = chitiethoadon.Seri
                WHERE hoadon.NgayDuyet >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
                $statusCondition
                GROUP BY YEAR(hoadon.NgayDuyet)
                ORDER BY YEAR(hoadon.NgayDuyet)";
        break;
    
    default:
        // Mặc định là theo tháng
        $sql = "SELECT 
                    MONTH(hoadon.NgayDuyet) as Month,
                    YEAR(hoadon.NgayDuyet) as Year,
                    SUM(khohang.GiaBan) as TongTien,
                    COUNT(DISTINCT hoadon.MaHoaDon) as SoLuongDonHang
                FROM hoadon
                JOIN chitiethoadon ON hoadon.MaHoaDon = chitiethoadon.MaHoaDon
                JOIN khohang ON khohang.Seri = chitiethoadon.Seri
                WHERE hoadon.NgayDuyet >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                $statusCondition
                GROUP BY YEAR(hoadon.NgayDuyet), MONTH(hoadon.NgayDuyet)
                ORDER BY YEAR(hoadon.NgayDuyet), MONTH(hoadon.NgayDuyet)";
}

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