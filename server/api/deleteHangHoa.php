<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình CORS và Content-Type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kiểm tra phương thức request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Chỉ chấp nhận phương thức POST"]);
    exit();
}

require_once "../config/Database.php";

// Khởi tạo kết nối database
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi kết nối cơ sở dữ liệu"
    ]);
    exit();
}

// Lấy dữ liệu từ request
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra mã hãng
if (!isset($data['MaHangHoa'])) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu mã hàng hóa"
    ]);
    exit();
}

$maHangHoa = trim($data['MaHangHoa']);

// Kiểm tra xem hàng hóa có sản phẩm nào không
$checkChiTietPhieuNhapSql = "SELECT COUNT(*) as count FROM chitietphieunhap WHERE MaHangHoa = ?";
$checkChiTietPhieuNhapStmt = $conn->prepare($checkChiTietPhieuNhapSql);
$checkChiTietPhieuNhapStmt->bind_param("s", $maHangHoa);
$checkChiTietPhieuNhapStmt->execute();
$chiTietPhieuNhapResult = $checkChiTietPhieuNhapStmt->get_result();
$chiTietPhieuNhapCount = $chiTietPhieuNhapResult->fetch_assoc()['count'];
$checkChiTietPhieuNhapStmt->close();

if ($chiTietPhieuNhapCount > 0) {
    // Thay vì từ chối xóa, cập nhật TrangThai thành -1 (soft delete)
    $updateSql = "UPDATE hanghoa SET TrangThai = -1 WHERE MaHangHoa = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("s", $maHangHoa);

    if ($updateStmt->execute()) {
        if ($updateStmt->affected_rows > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Hàng hóa đã được đánh dấu xóa thành công (soft delete)",
                "type" => "soft_delete"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Không tìm thấy hàng hóa để đánh dấu xóa"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi cập nhật trạng thái hàng hóa: " . $updateStmt->error
        ]);
    }

    $updateStmt->close();
    $conn->close();
    exit();
}

// Tạo truy vấn SQL sử dụng prepared statement
$sql = "DELETE FROM hanghoa WHERE MaHangHoa = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $maHangHoa);

// Thực hiện truy vấn và kiểm tra lỗi
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Xóa hàng hóa thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy hàng hóa để xóa"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi xóa hàng hóa: " . $stmt->error]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>