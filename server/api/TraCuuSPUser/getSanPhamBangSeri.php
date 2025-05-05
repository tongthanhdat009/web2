<?php
// filepath: f:\xampp\htdocs\web2\server\api\TraCuuSPUser\getSanPhamBangSeri.php

// Headers for CORS and JSON response
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (adjust for production)
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database configuration
require_once "../../config/Database.php";

// Instantiate Database and connect
$database = new Database();
$conn = $database->getConnection();

// Check connection
if (!$conn) {
    // Service unavailable
    http_response_code(503);
    echo json_encode(["success" => false, "message" => "Không thể kết nối đến cơ sở dữ liệu."]);
    exit();
}

// Get the Seri from the query parameter
$seri = isset($_GET['seri']) ? trim($_GET['seri']) : null;

// Validate input
if (empty($seri)) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Vui lòng cung cấp số Seri."]);
    exit();
}

// Prepare the SQL query
$sql = "SELECT
            hd.NgayXuatHoaDon,
            DATE_ADD(hd.NgayXuatHoaDon, INTERVAL hh.ThoiGianBaoHanh MONTH) AS KetThucBaoHanh,
            hh.TenHangHoa,
            hh.ThoiGianBaoHanh
        FROM khohang kh
        JOIN chitietphieunhap ctpn ON kh.IDChiTietPhieuNhap = ctpn.IDChiTietPhieuNhap
        JOIN hanghoa hh ON hh.MaHangHoa = ctpn.MaHangHoa
        JOIN chitiethoadon cthd ON cthd.Seri = kh.Seri
        JOIN hoadon hd ON hd.MaHoaDon = cthd.MaHoaDon
        WHERE kh.Seri = ?"; // Use placeholder

$stmt = $conn->prepare($sql);

// Check if prepare() failed
if ($stmt === false) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "success" => false,
        "message" => "Lỗi chuẩn bị truy vấn: " . $conn->error
    ]);
    $conn->close();
    exit();
}

// Bind the parameter
// Assuming Seri is a string, use "s". If it's an integer, use "i". Adjust if needed.
$stmt->bind_param("s", $seri);

// Execute the query
if ($stmt->execute()) {
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Fetch the data
        $sanPhamInfo = $result->fetch_assoc();

        // Format dates if needed (optional, depends on client needs)
        // Example: $sanPhamInfo['NgayXuatHoaDon'] = date('d/m/Y', strtotime($sanPhamInfo['NgayXuatHoaDon']));
        // Example: $sanPhamInfo['KetThucBaoHanh'] = date('d/m/Y', strtotime($sanPhamInfo['KetThucBaoHanh']));

        http_response_code(200); // OK
        echo json_encode([
            "success" => true,
            "data" => $sanPhamInfo
        ]);
    } else {
        // No product found with that Seri
        http_response_code(404); // Not Found
        echo json_encode([
            "success" => false,
            "message" => "Không tìm thấy thông tin sản phẩm hoặc bảo hành cho số Seri này."
        ]);
    }
} else {
    // Error executing query
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi thực thi truy vấn: " . $stmt->error
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();

?>