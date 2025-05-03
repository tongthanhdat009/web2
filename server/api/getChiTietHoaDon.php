<?php
// filepath: f:\xampp\htdocs\web2\server\api\QuanLyHoaDon\getChiTietHoaDon.php

// Thiết lập headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Bật báo lỗi để dễ debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Kết nối database
require_once "../config/Database.php";
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(
        array(
            "success" => false,
            "message" => "Không thể kết nối đến database: " . $conn->connect_error
        ),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

// Kiểm tra có tham số maHoaDon hay không
if (!isset($_GET['maHoaDon'])) {
    http_response_code(400);
    echo json_encode(
        array(
            "success" => false,
            "message" => "Thiếu tham số mã hóa đơn"
        ),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

$maHoaDon = $_GET['maHoaDon'];

try {
    // Lấy thông tin hóa đơn
    $queryHoaDon = "SELECT * FROM hoadon WHERE MaHoaDon = ?";
    $stmtHoaDon = $conn->prepare($queryHoaDon);
    
    $stmtHoaDon->bind_param("s", $maHoaDon);
    $stmtHoaDon->execute();
    $resultHoaDon = $stmtHoaDon->get_result();
    
    if ($resultHoaDon->num_rows == 0) {
        echo json_encode(
            array(
                "success" => false,
                "message" => "Không tìm thấy hóa đơn với mã: " . $maHoaDon
            ),
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }
    
    $hoaDon = $resultHoaDon->fetch_assoc();

    // Lấy chi tiết hóa đơn
    $queryChiTiet = "SELECT c.*, h.TenHangHoa
                    FROM chitiethoadon c
                    JOIN khohang k ON c.Seri = k.Seri
                    JOIN chitietphieunhap ctpn ON ctpn.IDChiTietPhieuNhap = k.IDChiTietPhieuNhap
                    JOIN hanghoa h ON h.MaHangHoa = ctpn.IDChiTietPhieuNhap
                    WHERE c.MaHoaDon = ?";
    
    $stmtChiTiet = $conn->prepare($queryChiTiet);
    
    $stmtChiTiet->bind_param("s", $maHoaDon);
    $stmtChiTiet->execute();
    $resultChiTiet = $stmtChiTiet->get_result();
    
    $chiTietHoaDon = array();
    while ($row = $resultChiTiet->fetch_assoc()) {
        $chiTietHoaDon[] = $row;
    }
    
    // lấy tổng tiền
    $queryTongTien = "SELECT SUM(c.GiaBan) AS TongTien
                    FROM chitiethoadon c
                    WHERE c.MaHoaDon = ?";
    $stmtTongTien = $conn->prepare($queryTongTien);
    $stmtTongTien->bind_param("s", $maHoaDon);
    $stmtTongTien->execute();
    $resultTongTien = $stmtTongTien->get_result();

    $tongTien = $resultTongTien->fetch_assoc()['TongTien'];
    
    // Trả về kết quả
    echo json_encode(
        array(
            "success" => true,
            "hoaDon" => $hoaDon,
            "chiTiet" => $chiTietHoaDon,
            "count" => count($chiTietHoaDon),
            "tongTien" => $tongTien,
        ),
        JSON_UNESCAPED_UNICODE
    );
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(
        array(
            "success" => false,
            "message" => "Lỗi: " . $e->getMessage()
        ),
        JSON_UNESCAPED_UNICODE
    );
} finally {
    // Đóng kết nối
    if (isset($stmtHoaDon)) {
        $stmtHoaDon->close();
    }
    if (isset($stmtChiTiet)) {
        $stmtChiTiet->close();
    }
    $conn->close();
}
?>