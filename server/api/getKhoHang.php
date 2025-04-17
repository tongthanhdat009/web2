<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Lấy tham số MaPhieuNhap từ request nếu có
$maPhieuNhap = isset($_GET['MaPhieuNhap']) ? $_GET['MaPhieuNhap'] : null;

// Chuẩn bị SQL query
$sql = "SELECT 
            kh.Seri,
            kh.MaPhieuNhap,
            kh.MaHangHoa,
            kh.GiaNhap,
            kh.GiaBan,
            kh.TinhTrang,
            hh.TenHangHoa,
            hh.MaHang,
            hh.MaChungLoai,
            h.TenHang,
            ncc.TenNhaCungCap
        FROM khohang AS kh
        LEFT JOIN hanghoa AS hh ON kh.MaHangHoa = hh.MaHangHoa
        LEFT JOIN hang AS h ON hh.MaHang = h.MaHang
        LEFT JOIN phieunhap AS pn ON kh.MaPhieuNhap = pn.MaPhieuNhap
        LEFT JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap";

// Thêm điều kiện nếu có MaPhieuNhap
if ($maPhieuNhap) {
    $sql .= " WHERE kh.MaPhieuNhap = ?";
}

$sql .= " ORDER BY kh.Seri ASC";

try {
    $stmt = $conn->prepare($sql);

    if ($maPhieuNhap) {
        $stmt->bind_param("s", $maPhieuNhap);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = [
                "Seri" => $row['Seri'],
                "MaPhieuNhap" => $row['MaPhieuNhap'],
                "MaHangHoa" => $row['MaHangHoa'],
                "TenHangHoa" => $row['TenHangHoa'],
                "MaHang" => $row['MaHang'],
                "MaChungLoai" => $row['MaChungLoai'],
                "GiaNhap" => $row['GiaNhap'],
                "GiaBan" => $row['GiaBan'],
                "TinhTrang" => $row['TinhTrang'],
                "TenHang" => $row['TenHang'],
                "TenNhaCungCap" => $row['TenNhaCungCap']
            ];
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi lấy dữ liệu kho hàng: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>