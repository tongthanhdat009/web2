<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy tham số timeFrame từ request
$timeFrame = isset($_GET['timeFrame']) ? $_GET['timeFrame'] : 'monthly';

// Chuẩn bị SQL query dựa theo timeFrame
$sql = "";

switch ($timeFrame) {
    case 'monthly':
        // Lấy dữ liệu theo tháng (12 tháng gần đây)
        $sql = "SELECT 
                    MONTH(pn.NgayNhap) as month,
                    YEAR(pn.NgayNhap) as year,
                    SUM(kh.GiaNhap) as totalValue
                FROM phieunhap AS pn
                JOIN khohang AS kh ON kh.MaPhieuNhap = pn.MaPhieuNhap
                JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                WHERE pn.TrangThai = N'Đã Nhập'
                AND pn.NgayNhap >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY YEAR(pn.NgayNhap), MONTH(pn.NgayNhap)
                ORDER BY YEAR(pn.NgayNhap), MONTH(pn.NgayNhap)";
        break;
    
    case 'quarterly':
        // Lấy dữ liệu theo quý (4 quý gần đây)
        $sql = "SELECT 
                    QUARTER(pn.NgayNhap) as quarter,
                    YEAR(pn.NgayNhap) as year,
                    SUM(kh.GiaNhap) as totalValue
                FROM phieunhap AS pn
                JOIN khohang AS kh ON kh.MaPhieuNhap = pn.MaPhieuNhap
                JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                WHERE pn.TrangThai = N'Đã Nhập'
                AND pn.NgayNhap >= DATE_SUB(NOW(), INTERVAL 4 QUARTER)
                GROUP BY YEAR(pn.NgayNhap), QUARTER(pn.NgayNhap)
                ORDER BY YEAR(pn.NgayNhap), QUARTER(pn.NgayNhap)";
        break;
    
    case 'yearly':
        // Lấy dữ liệu theo năm (5 năm gần đây)
        $sql = "SELECT 
                    YEAR(pn.NgayNhap) as year,
                    SUM(kh.GiaNhap) as totalValue
                FROM phieunhap AS pn
                JOIN khohang AS kh ON kh.MaPhieuNhap = pn.MaPhieuNhap
                JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                WHERE pn.TrangThai = N'Đã Nhập'
                AND pn.NgayNhap >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
                GROUP BY YEAR(pn.NgayNhap)
                ORDER BY YEAR(pn.NgayNhap)";
        break;
    
    case 'all':
        // Lấy tất cả dữ liệu (không lọc theo thời gian)
        $sql = "SELECT 
                pn.MaPhieuNhap,
                pn.NgayNhap,
                ncc.MaNhaCungCap, 
                SUM(kh.GiaNhap) AS TongTien 
            FROM khohang AS kh
            JOIN phieunhap AS pn ON kh.MaPhieuNhap = pn.MaPhieuNhap
            JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
            WHERE pn.TrangThai = N'Đã Nhập'
            GROUP BY pn.MaPhieuNhap, pn.NgayNhap, ncc.MaNhaCungCap
            ORDER BY pn.NgayNhap DESC";
        break;
    
    default:
        // Mặc định là trả về tất cả phiếu nhập
        $sql = "SELECT 
                pn.MaPhieuNhap,
                pn.NgayNhap,
                ncc.MaNhaCungCap, 
                SUM(kh.GiaNhap) AS TongTien 
            FROM khohang AS kh
            JOIN phieunhap AS pn ON kh.MaPhieuNhap = pn.MaPhieuNhap
            JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
            WHERE pn.TrangThai = N'Đã Nhập'
            GROUP BY pn.MaPhieuNhap, pn.NgayNhap, ncc.MaNhaCungCap
            ORDER BY pn.NgayNhap DESC";
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