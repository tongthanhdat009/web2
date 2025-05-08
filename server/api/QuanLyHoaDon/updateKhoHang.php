<?php
// filepath: f:\xampp\htdocs\web2\server\api\QuanLyHoaDon\getChiTietHoaDon.php

// Thiết lập headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Bật báo lỗi để dễ debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Kết nối database
require_once "../../config/Database.php";
$database = new Database();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit; 
}

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

// Kiểm tra tham số TrangThai
if(!isset($_GET['trangThai'])) {
    http_response_code(400);
    echo json_encode(
        array(
            "success" => false,
            "message" => "Thiếu tham số trạng thái"
        ),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}
$trangThai = $_GET['trangThai'];

try {
    // Lấy chi tiết hóa đơn
    $queryChiTiet = "SELECT c.*, ctpn.IDChiTietPhieuNhap
                    FROM chitiethoadon c
                    JOIN khohang k ON c.Seri = k.Seri
                    JOIN chitietphieunhap ctpn ON ctpn.IDChiTietPhieuNhap = k.IDChiTietPhieuNhap
                    JOIN hanghoa h ON h.MaHangHoa = ctpn.MaHangHoa
                    WHERE c.MaHoaDon = ?";
    
    $stmtChiTiet = $conn->prepare($queryChiTiet);
    
    $stmtChiTiet->bind_param("s", $maHoaDon);
    $stmtChiTiet->execute();
    $resultChiTiet = $stmtChiTiet->get_result();
    
    $chiTietHoaDon = array();
    while ($row = $resultChiTiet->fetch_assoc()) {
        $chiTietHoaDon[] = $row;
    }
    
    if($trangThai == "Huy"){
       $tinhTrang = "Chưa bán";
       $canRestoreSoLuongTon = true;
    }
    else{
        $tinhTrang = "Đã bán";
    }

    // Thay đổi tình trạng hàng hoá trong kho hàng
    $stmtUpdateKhoHang = $conn->prepare("UPDATE khohang SET TinhTrang = ? WHERE Seri = ?");
    foreach ($chiTietHoaDon as $item) {
        $stmtUpdateKhoHang->bind_param("ss", $tinhTrang, $item['Seri']);
        $stmtUpdateKhoHang->execute();
    }    
    if ($canRestoreSoLuongTon) {
        // Tổng hợp số lượng cần khôi phục cho mỗi IDChiTietPhieuNhap
        $quantitiesToRestore = array();
        foreach ($chiTietHoaDon as $item) { 
            $idCTPN = $item['IDChiTietPhieuNhap']; // Đảm bảo $item['IDChiTietPhieuNhap'] tồn tại từ câu query
            if (!isset($quantitiesToRestore[$idCTPN])) {
                $quantitiesToRestore[$idCTPN] = 0;
            }
            $quantitiesToRestore[$idCTPN]++; // Mỗi Seri tương ứng 1 đơn vị sản phẩm
        }

        if (!empty($quantitiesToRestore)) {
            $stmtUpdateSoLuongTon = $conn->prepare("UPDATE chitietphieunhap SET SoLuongTon = SoLuongTon + ? WHERE IDChiTietPhieuNhap = ?");
            if ($stmtUpdateSoLuongTon === false) {
                throw new Exception("Lỗi chuẩn bị câu lệnh cập nhật số lượng tồn: " . $conn->error);
            }

            foreach ($quantitiesToRestore as $idCTPN => $quantity) {
                $stmtUpdateSoLuongTon->bind_param("is", $quantity, $idCTPN); // quantity là integer, idCTPN là string (hoặc integer tùy schema)
                if (!$stmtUpdateSoLuongTon->execute()) {
                    throw new Exception("Lỗi cập nhật số lượng tồn cho IDChiTietPhieuNhap " . $idCTPN . ": " . $stmtUpdateSoLuongTon->error);
                }
            }
            $stmtUpdateSoLuongTon->close();
            $stmtUpdateSoLuongTon = null;
        }
    }
    
    // Trả về kết quả
    echo json_encode(
        array(
            "success" => true,
            "chiTietHoaDon" => $chiTietHoaDon,
            "thongTin" => "Thay đổi thành công"
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
    if (isset($stmtUpdateKhoHang)) {
        $stmtUpdateKhoHang->close();
    }
    if (isset($stmtChiTiet)) {
        $stmtChiTiet->close();
    }
    $conn->close();
}
?>