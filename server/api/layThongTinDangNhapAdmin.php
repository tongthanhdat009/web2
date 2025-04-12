<?php
require_once "../config/Database.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if ($conn->connect_error) {
        throw new Exception("Kết nối thất bại: " . $conn->connect_error);
    }

    // Đọc dữ liệu từ body request
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData);

    // Kiểm tra nếu không có dữ liệu được gửi hoặc tên tài khoản không hợp lệ
    if (json_last_error() !== JSON_ERROR_NONE || !isset($data->idTaiKhoan)) {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Dữ liệu không hợp lệ"]);
        exit;
    }

    $idTaiKhoan = $data->idTaiKhoan;

    // Truy vấn SQL với điều kiện WHERE
    $sql = "SELECT tk.IDTaiKhoan, tk.IDQuyen, tk.TrangThai, nd.HoTen, nd.MaNguoiDung,nd.GioiTinh, nd.Email, nd.SoDienThoai,nd.Anh, q.IDQuyen, q.TenQuyen, cn.IDChucNang, cn.TenChucNang
    FROM taikhoan tk
    JOIN nguoidung nd ON tk.IDTaiKhoan = nd.IDTaiKhoan
    JOIN phanquyen pq ON tk.IDQuyen = pq.IDQuyen
    JOIN quyen q ON pq.IDQuyen = q.IDQuyen
    JOIN chucnang cn ON pq.IDChucNang = cn.IDChucNang
    LEFT JOIN nhanvien nv ON nv.MaNguoiDung = nd.MaNguoiDung
    WHERE tk.IDTaiKhoan = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Lỗi chuẩn bị truy vấn SQL: " . $conn->error);
    }

    $stmt->bind_param("i", $idTaiKhoan);

    if (!$stmt->execute()) {
        throw new Exception("Lỗi thực thi truy vấn SQL: " . $stmt->error);
    }

    $result = $stmt->get_result();

    // Kiểm tra kết quả
    if ($result && $result->num_rows > 0) { // Ensure $result is valid
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        http_response_code(200); // OK
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["message" => "Không tìm thấy dữ liệu hoặc kết quả rỗng"]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => $e->getMessage()]);
    error_log($e->getMessage()); // Log the error for debugging
    exit;
}
?>
