<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Tắt hiển thị lỗi PHP ra HTML

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception("Không thể kết nối đến cơ sở dữ liệu");
    }

    // Lấy tham số timeFrame từ request
    $timeFrame = isset($_GET['timeFrame']) ? $_GET['timeFrame'] : 'all';

    // Chuẩn bị SQL query dựa theo timeFrame
    $sql = "";

    switch ($timeFrame) {
        case 'monthly':
            $sql = "SELECT 
                        MONTH(pn.NgayNhap) as month,
                        YEAR(pn.NgayNhap) as year,
                        SUM(ctpn.GiaNhap) as totalValue
                    FROM phieunhap AS pn
                    JOIN chitietphieunhap ctpn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap
                    JOIN khohang kh ON ctpn.IDChiTietPhieuNhap = kh.IDChiTietPhieuNhap
                    JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                    WHERE pn.TrangThai = N'Đã duyệt'
                    AND pn.NgayNhap >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                    GROUP BY YEAR(pn.NgayNhap), MONTH(pn.NgayNhap)
                    ORDER BY YEAR(pn.NgayNhap), MONTH(pn.NgayNhap)";
            break;

        case 'quarterly':
            $sql = "SELECT 
                        QUARTER(pn.NgayNhap) as quarter,
                        YEAR(pn.NgayNhap) as year,
                        SUM(ctpn.GiaNhap) as totalValue
                    FROM phieunhap AS pn
                    JOIN chitietphieunhap ctpn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap
                    JOIN khohang kh ON ctpn.IDChiTietPhieuNhap = kh.IDChiTietPhieuNhap
                    JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                    WHERE pn.TrangThai = N'Đã duyệt'
                    AND pn.NgayNhap >= DATE_SUB(NOW(), INTERVAL 4 QUARTER)
                    GROUP BY YEAR(pn.NgayNhap), QUARTER(pn.NgayNhap)
                    ORDER BY YEAR(pn.NgayNhap), QUARTER(pn.NgayNhap)";
            break;

        case 'yearly':
            $sql = "SELECT 
                        YEAR(pn.NgayNhap) as year,
                        SUM(ctpn.GiaNhap) as totalValue
                    FROM phieunhap AS pn
                    JOIN chitietphieunhap ctpn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap
                    JOIN khohang kh ON ctpn.IDChiTietPhieuNhap = kh.IDChiTietPhieuNhap
                    JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                    WHERE pn.TrangThai = N'Đã duyệt'
                    AND pn.NgayNhap >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
                    GROUP BY YEAR(pn.NgayNhap)
                    ORDER BY YEAR(pn.NgayNhap)";
            break;

        case 'all':
            $sql = "SELECT 
                    pn.MaPhieuNhap,
                    pn.TrangThai,
                    pn.NgayNhap,
                    ncc.MaNhaCungCap, 
                    SUM(ctpn.GiaNhap) AS TongTien 
                FROM phieunhap AS pn
                JOIN chitietphieunhap ctpn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap
                JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                WHERE pn.TrangThai = N'Đã Nhập'
                GROUP BY pn.MaPhieuNhap, pn.NgayNhap, ncc.MaNhaCungCap
                ORDER BY pn.NgayNhap DESC";
            break;

        case 'fetch':
            $sql = "SELECT * FROM phieunhap";
            break;

        default:
            $sql = "SELECT 
                    pn.MaPhieuNhap,
                    pn.TrangThai,
                    pn.NgayNhap,
                    ncc.MaNhaCungCap, 
                    SUM(ctpn.GiaNhap) AS TongTien 
                FROM phieunhap AS pn
                JOIN chitietphieunhap ctpn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap
                JOIN nhacungcap AS ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                WHERE pn.TrangThai = N'Đã Nhập'
                GROUP BY pn.MaPhieuNhap, pn.NgayNhap, ncc.MaNhaCungCap
                ORDER BY pn.NgayNhap DESC";
    }

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Lỗi khi thực hiện truy vấn: " . $conn->error);
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>