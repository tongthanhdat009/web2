<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$servername = "localhost";
$username = "root";
$password = "";
$database = "ql_cuahangdungcu";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Kết nối thất bại: " . $conn->connect_error]);
    exit();
}

$maChungLoai = isset($_GET['maChungLoai']) ? intval($_GET['maChungLoai']) : 0;

try {
    // Truy vấn lấy danh sách gợi ý MaHangHoa
    $sql = "
        SELECT 
            hh.MaHangHoa, 
            COUNT(CASE WHEN kh.TinhTrang = 'Đã bán' THEN 1 END) AS SoLuongDaBan
        FROM hanghoa hh 
        JOIN chitietphieunhap ctpn ON hh.MaHangHoa = ctpn.MaHangHoa 
        JOIN khohang kh ON kh.IDChiTietPhieuNhap = ctpn.IDChiTietPhieuNhap
        WHERE ctpn.SoLuongTon > 0 AND hh.MaChungLoai = ?
        GROUP BY hh.MaHangHoa
        ORDER BY SoLuongDaBan DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $maChungLoai);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $details = [];
    if (count($data) > 0) {
        $sqlDetail = "
            SELECT hh.*, ctpn.*, pn.*, klt.*, kq.*, kg.*, km.*
            FROM hanghoa hh
            JOIN chitietphieunhap ctpn ON ctpn.MaHangHoa = hh.MaHangHoa
            JOIN phieunhap pn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
            LEFT JOIN KhoiLuongTa klt ON ctpn.IDKhoiLuongTa = klt.IDKhoiLuongTa
            LEFT JOIN KichThuocQuanAo kq ON ctpn.IDKichThuocQuanAo = kq.IDKichThuocQuanAo
            LEFT JOIN KichThuocGiay kg ON ctpn.IDKichThuocGiay = kg.IDKichThuocGiay
            LEFT JOIN khuyenmai km ON hh.MaKhuyenMai = km.MaKhuyenMai
            WHERE hh.MaHangHoa = ?
              AND ctpn.SoLuongTon > 0 
              AND pn.TrangThai = 'Đã duyệt'
              AND pn.NgayNhap = (
                SELECT MIN(pn2.NgayNhap)
                FROM chitietphieunhap ctpn2
                JOIN phieunhap pn2 ON pn2.MaPhieuNhap = ctpn2.MaPhieuNhap
                WHERE ctpn2.MaHangHoa = ctpn.MaHangHoa
                  AND (ctpn.IDKhoiLuongTa = ctpn2.IDKhoiLuongTa OR (ctpn.IDKhoiLuongTa IS NULL AND ctpn2.IDKhoiLuongTa IS NULL))
                  AND (ctpn.IDKichThuocQuanAo = ctpn2.IDKichThuocQuanAo OR (ctpn.IDKichThuocQuanAo IS NULL AND ctpn2.IDKichThuocQuanAo IS NULL))
                  AND (ctpn.IDKichThuocGiay = ctpn2.IDKichThuocGiay OR (ctpn.IDKichThuocGiay IS NULL AND ctpn2.IDKichThuocGiay IS NULL))
                  AND ctpn2.SoLuongTon > 0
              )
        ";
        $stmtDetail = $conn->prepare($sqlDetail);

        foreach ($data as $item) {
            $stmtDetail->bind_param('i', $item['MaHangHoa']);
            $stmtDetail->execute();
            $resultDetail = $stmtDetail->get_result();
            while ($rowDetail = $resultDetail->fetch_assoc()) {
                $details[] = $rowDetail;
            }
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $details
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}