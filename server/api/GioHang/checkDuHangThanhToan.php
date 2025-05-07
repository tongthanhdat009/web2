<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header('Content-Type: application/json; charset=utf-8'); // Thông báo trả về định dạng JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối tới cơ sở dữ liệu
$servername = "localhost";  // Địa chỉ máy chủ cơ sở dữ liệu
$username = "root";         // Tên người dùng
$password = "";             // Mật khẩu
$dbname = "ql_cuahangdungcu";  // Tên cơ sở dữ liệu

// Tạo kết nối
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Lấy dữ liệu từ request (post method)
$data = json_decode(file_get_contents("php://input"), true);
$soLuong = isset($data['SoLuong']) ? $data['SoLuong'] : 0;
$idChiTietPhieuNhap = isset($data['IDChiTietPhieuNhap']) ? $data['IDChiTietPhieuNhap'] : 0;

if ($soLuong && $idChiTietPhieuNhap) {
    // Truy vấn lấy SoLuongTon từ cơ sở dữ liệu
    $sql = "SELECT SoLuongTon FROM chitietphieunhap WHERE IDChiTietPhieuNhap = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idChiTietPhieuNhap);  // "i" cho kiểu dữ liệu int
    $stmt->execute();
    $stmt->bind_result($soLuongTon);
    
    if ($stmt->fetch()) {
        // Kiểm tra SoLuongTon
        if ($soLuongTon >= $soLuong) {
            echo json_encode(["result" => true]); // Nếu SoLuongTon >= SoLuong, trả về true (đủ số lượng)
        } else {
            echo json_encode(["result" => false]);  // Nếu SoLuongTon < SoLuong, trả về false (không đủ số lượng)
        }
    } else {
        echo json_encode(["result" => false, "message" => "Không tìm thấy sản phẩm."]); // Nếu không tìm thấy sản phẩm
    }

    $stmt->close();
} else {
    echo json_encode(["result" => false, "message" => "Dữ liệu không hợp lệ."]); // Nếu thiếu SoLuong hoặc IDChiTietPhieuNhap
}

$conn->close();
?>
