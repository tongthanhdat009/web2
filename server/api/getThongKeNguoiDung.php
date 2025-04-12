<?php
// filepath: f:\xampp\htdocs\web2\server\api\getTopUsers.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy tham số từ request
$timeRange = isset($_GET['timeRange']) ? $_GET['timeRange'] : 'all';
$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 5;
$viewType = isset($_GET['viewType']) ? $_GET['viewType'] : 'count';

// Xây dựng điều kiện thời gian
$timeCondition = "";
switch ($timeRange) {
    case 'month':
        $timeCondition = "AND DATE(hd.NgayDuyet) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
    case 'quarter':
        $timeCondition = "AND DATE(hd.NgayDuyet) >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)";
        break;
    case 'year':
        $timeCondition = "AND DATE(hd.NgayDuyet) >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)";
        break;
    default: // 'all' hoặc không xác định
        $timeCondition = "";
        break;
}

// Xác định trường sắp xếp
$orderBy = $viewType === 'value' ? 'TongTien DESC' : 'SoLuongDonHang DESC';

// SQL query để lấy người dùng mua nhiều nhất
$sql = "SELECT 
            u.MaNguoiDung,
            u.HoTen,
            u.Email,
            COUNT(hd.MaHoaDon) AS SoLuongDonHang,
            SUM(kh.GiaBan) AS TongTien
        FROM nguoidung u
        JOIN hoadon hd ON u.IDTaiKhoan = hd.IDTaiKhoan
        JOIN chitiethoadon cthd ON cthd.MaHoaDon = hd.MaHoaDon
        JOIN khohang kh ON kh.Seri = cthd.Seri
        WHERE hd.TrangThai = '1' $timeCondition
        GROUP BY u.MaNguoiDung, u.HoTen, u.Email
        ORDER BY $orderBy
        LIMIT $limit";

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
        "viewType" => $viewType,
        "totalRecords" => count($data)
    ]
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit();
?>