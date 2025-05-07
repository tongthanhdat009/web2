<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

try {
    if ($conn->connect_error) {
        throw new Exception("Kết nối thất bại: " . $conn->connect_error);
    }

    // Đọc dữ liệu từ body request
    $rawData = file_get_contents("php://input");
    error_log("Raw data received: " . $rawData); // Log dữ liệu nhận được
    $data = json_decode($rawData);

    // Kiểm tra nếu không có dữ liệu được gửi hoặc idTaiKhoan không hợp lệ
    if (json_last_error() !== JSON_ERROR_NONE || !isset($data->idTaiKhoan)) {
        error_log("Invalid data received or missing idTaiKhoan"); // Log lỗi
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Dữ liệu không hợp lệ"]);
        exit;
    }

    $idTaiKhoan = $data->idTaiKhoan;
    error_log("Processing request for idTaiKhoan: " . $idTaiKhoan); // Log ID đang xử lý

    // Đơn giản hóa truy vấn SQL
    $sql = "SELECT tk.IDTaiKhoan, tk.IDQuyen, tk.TrangThai, 
            nd.MaNguoiDung, nd.HoTen, nd.GioiTinh, nd.Email, nd.SoDienThoai, nd.Anh
            FROM taikhoan tk
            JOIN nguoidung nd ON tk.IDTaiKhoan = nd.IDTaiKhoan
            WHERE tk.IDTaiKhoan = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("SQL preparation error: " . $conn->error); // Log lỗi SQL
        throw new Exception("Lỗi chuẩn bị truy vấn SQL: " . $conn->error);
    }

    $stmt->bind_param("i", $idTaiKhoan);

    if (!$stmt->execute()) {
        error_log("SQL execution error: " . $stmt->error); // Log lỗi thực thi
        throw new Exception("Lỗi thực thi truy vấn SQL: " . $stmt->error);
    }

    $result = $stmt->get_result();
    
    // Kiểm tra kết quả
    if ($result && $result->num_rows > 0) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        error_log("Found user data: " . json_encode($data)); // Log dữ liệu tìm thấy
        http_response_code(200); // OK
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    } else {
        error_log("No data found for idTaiKhoan: " . $idTaiKhoan); // Log không tìm thấy dữ liệu
        http_response_code(404); // Not Found
        echo json_encode(["message" => "Không tìm thấy dữ liệu hoặc kết quả rỗng"]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    error_log("Error in layThongTinDangNhapAdmin.php: " . $e->getMessage()); // Log lỗi exception
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => $e->getMessage()]);
    exit;
}
?>
