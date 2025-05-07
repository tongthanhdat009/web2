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
$sql = "SELECT kh.*, klt.*, ktqa.*, ktg.*, hh.*, cthd.GiaBan, hd.*, pn.MaPhieuNhap
FROM khohang kh
JOIN chitietphieunhap ctpn ON ctpn.IDChiTietPhieuNhap =  kh.IDChiTietPhieuNhap
JOIN khoiluongta klt ON klt.IDKhoiLuongTa = ctpn.IDKhoiLuongTa
JOIN kichthuocquanao ktqa ON ktqa.IDKichThuocQuanAo = ctpn.IDKichThuocQuanAo
JOIN kichthuocgiay ktg ON ktg.IDKichThuocGiay = ctpn.IDKichThuocGiay
JOIN hanghoa hh ON hh.MaHangHoa = ctpn.MaHangHoa
JOIN phieunhap pn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
LEFT JOIN chitiethoadon cthd ON  cthd.Seri = kh.Seri
LEFT JOIN hoadon hd ON hd.MaHoaDon = cthd.MaHoaDon";


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
