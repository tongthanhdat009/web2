<?php
require_once "../config/Database.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$database = new Database();
$conn = $database->getConnection();
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Xây dựng truy vấn linh hoạt dựa trên các điều kiện
$sql = "SELECT khohang.*, khohang.seri AS SeriKho, hanghoa.*, chitiethoadon.*, hoadon.* 
        FROM khohang 
        LEFT JOIN hanghoa ON khohang.MaHangHoa = hanghoa.MaHangHoa 
        LEFT JOIN chitiethoadon ON khohang.seri = chitiethoadon.seri 
        LEFT JOIN hoadon ON chitiethoadon.MaHoaDon = hoadon.MaHoaDon";


$result = $conn->query($sql);

$products = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Trả về kết quả dưới dạng JSON
echo json_encode($products);
?>
