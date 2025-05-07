<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/Database.php";

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception("Không thể kết nối đến cơ sở dữ liệu");
    }

    // Lấy tham số MaPhieuNhap từ request
    $maPhieuNhap = isset($_GET['MaPhieuNhap']) ? $_GET['MaPhieuNhap'] : null;

    if (!$maPhieuNhap) {
        throw new Exception("Thiếu tham số MaPhieuNhap");
    }

    // Chuẩn bị SQL query với JOIN các bảng liên quan
    $sql = "SELECT 
                ctp.*,
                hh.TenHangHoa,
                hh.MaHang,
                h.TenHang,
                klt.KhoiLuong,
                kq.KichThuocQuanAo,
                kg.KichThuocGiay
            FROM chitietphieunhap ctp
            LEFT JOIN hanghoa hh ON ctp.MaHangHoa = hh.MaHangHoa
            LEFT JOIN hang h ON hh.MaHang = h.MaHang
            LEFT JOIN khoiluongta klt ON ctp.IDKhoiLuongTa = klt.IDKhoiLuongTa
            LEFT JOIN kichthuocquanao kq ON ctp.IDKichThuocQuanAo = kq.IDKichThuocQuanAo
            LEFT JOIN kichthuocgiay kg ON ctp.IDKichThuocGiay = kg.IDKichThuocGiay
            WHERE ctp.MaPhieuNhap = ?
            ORDER BY ctp.IDChiTietPhieuNhap DESC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Lỗi chuẩn bị truy vấn: " . $conn->error);
    }

    $stmt->bind_param("s", $maPhieuNhap);

    if (!$stmt->execute()) {
        throw new Exception("Lỗi khi thực hiện truy vấn: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "IDChiTietPhieuNhap" => $row['IDChiTietPhieuNhap'],
            "MaPhieuNhap" => $row['MaPhieuNhap'],
            "MaHangHoa" => $row['MaHangHoa'],
            "TenHangHoa" => $row['TenHangHoa'],
            "MaHang" => $row['MaHang'],
            "TenHang" => $row['TenHang'],
            "IDKhoiLuongTa" => $row['IDKhoiLuongTa'],
            "KhoiLuong" => $row['KhoiLuong'],
            "IDKichThuocQuanAo" => $row['IDKichThuocQuanAo'],
            "KichThuocQuanAo" => $row['KichThuocQuanAo'],
            "IDKichThuocGiay" => $row['IDKichThuocGiay'],
            "KichThuocGiay" => $row['KichThuocGiay'],
            "GiaNhap" => $row['GiaNhap'],
            "GiaBan" => $row['GiaBan'],
            "SoLuongNhap" => $row['SoLuongNhap'],
            "SoLuongTon" => $row['SoLuongTon']
        ];
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
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>