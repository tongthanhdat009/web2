<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình CORS và Content-Type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Chỉ chấp nhận phương thức GET"]);
    exit();
}

if (!isset($_GET['maTheLoai'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu tham số 'maTheLoai'"]);
    exit();
}
$maTheLoai = $_GET['maTheLoai'];

require_once "../../config/Database.php";

// Khởi tạo kết nối database
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra kết nối
if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi kết nối cơ sở dữ liệu"
    ]);
    exit();
}

// Sửa SQL: Chọn tất cả các cột từ các bảng liên quan.
// Sử dụng LEFT JOIN cho khuyenmai để vẫn lấy hàng hóa dù không có khuyến mãi.
// Chọn cột cụ thể với alias để tránh trùng tên nếu cần, hoặc dùng hh.*, cl.*, km.*
$sql = "SELECT hh.MaHangHoa, hh.TenHangHoa, hh.Anh, km.PhanTram, ctpn.GiaBan, pn.NgayNhap, cl.MaTheLoai,hh.MoTa
        FROM hanghoa hh 
        JOIN chitietphieunhap ctpn ON hh.MaHangHoa = ctpn.MaHangHoa 
        JOIN chungloai cl ON cl.MaChungLoai = hh.MaChungLoai
        LEFT JOIN khuyenmai km ON km.MaKhuyenMai = hh.MaKhuyenMai
        JOIN phieunhap pn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
        WHERE hh.TrangThai = 1 AND pn.TrangThai = N'Đã Duyệt' AND ctpn.SoLuongTon > 0 AND cl.MaTheLoai = ?
        GROUP BY hh.MaHangHoa";

$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $maTheLoai);
// Kiểm tra lỗi prepare
if ($stmt === false) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi chuẩn bị truy vấn: " . $conn->error
    ]);
    $conn->close();
    exit();
}

// Thực thi truy vấn
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $hangHoaList = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Chuyển đổi các giá trị số dạng chuỗi thành số thực tế
            foreach ($row as $key => $value) {
                if (is_numeric($value)) {
                    // Kiểm tra xem có phải số thực không
                    if (strpos($value, '.') !== false) {
                        $row[$key] = (float)$value;
                    } else {
                        // Kiểm tra xem có phải số nguyên lớn không (tùy chọn)
                        // Nếu không cần xử lý số nguyên lớn đặc biệt, có thể dùng (int)
                        $row[$key] = (int)$value; // Hoặc dùng float nếu giá trị có thể rất lớn
                    }
                }
                 // Xử lý giá trị NULL từ LEFT JOIN cho PhanTramKM
                 if ($key === 'PhanTramKM' && $value === null) {
                    $row[$key] = 0; // Gán giá trị mặc định là 0 nếu không có khuyến mãi
                }
            }
            // Thêm toàn bộ $row (đã xử lý kiểu dữ liệu) vào danh sách
            $hangHoaList[] = $row;
        }
        http_response_code(200); // OK
        echo json_encode([
            "success" => true,
            "data" => $hangHoaList
        ]);
    } else {
        http_response_code(200); // OK, nhưng không có dữ liệu
        echo json_encode([
            "success" => true,
            "data" => [], // Trả về mảng rỗng
            "message" => "Không tìm thấy hàng hóa nào cho thể loại này."
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi thực thi truy vấn: " . $stmt->error
    ]);
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>