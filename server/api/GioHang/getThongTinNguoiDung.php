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

// Lấy IDTaiKhoan từ tham số GET
$IDTaiKhoan = isset($_GET['IDTaiKhoan']) ? $_GET['IDTaiKhoan'] : null;


if ($IDTaiKhoan === null) {
    echo json_encode(["message" => "Thiếu IDTaiKhoan."]);
    exit;
}

// Truy vấn SQL để lấy thông tin người dùng
$sql = "SELECT taikhoan.IDTaiKhoan, nguoidung.HoTen, nguoidung.SoDienThoai
        FROM taikhoan 
        JOIN nguoidung ON nguoidung.IDTaiKhoan = taikhoan.IDTaiKhoan 
        WHERE taikhoan.IDTaiKhoan = ?";

// Chuẩn bị và thực thi truy vấn
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $IDTaiKhoan); // "i" là kiểu dữ liệu integer
$stmt->execute();
$result = $stmt->get_result();

// Kiểm tra nếu có kết quả trả về
if ($result->num_rows > 0) {
    // Lấy dữ liệu và trả về dạng JSON
    $data = $result->fetch_assoc();
    echo json_encode($data);
} else {
    echo json_encode(["message" => "Không tìm thấy dữ liệu."]);
}

// Đóng kết nối
$stmt->close();
$conn->close();
?>
