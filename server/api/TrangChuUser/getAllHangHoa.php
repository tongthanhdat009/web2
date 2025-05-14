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

// Initialize $tenSanPhamFromGet to null or an empty string
$tenSanPhamFromGet = null;

if (isset($_GET['tenSanPham']) && !empty(trim($_GET['tenSanPham']))) {
    $tenSanPhamFromGet = trim($_GET['tenSanPham']);
} else {
    // If tenSanPham is not provided or empty, you might want to fetch all products
    // or return an error/empty set. For now, let's assume it's optional.
    // If it's mandatory, you can exit here:
    // http_response_code(400);
    // echo json_encode(["success" => false, "message" => "Thiếu tham số 'tenSanPham' hoặc giá trị rỗng."]);
    // exit();
}


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

// Base SQL query
$sql = "SELECT hh.MaHangHoa, hh.TenHangHoa, cl.TenChungLoai, hh.MaChungLoai, hh.Anh, km.PhanTram, ctpn.GiaBan, pn.NgayNhap, cl.MaTheLoai, hh.MoTa, ctpn.IDKhoiLuongTa, ctpn.IDKichThuocQuanAo, ctpn.IDKichThuocGiay
        FROM hanghoa hh 
        JOIN chitietphieunhap ctpn ON hh.MaHangHoa = ctpn.MaHangHoa 
        JOIN chungloai cl ON cl.MaChungLoai = hh.MaChungLoai
        LEFT JOIN khuyenmai km ON km.MaKhuyenMai = hh.MaKhuyenMai
        JOIN phieunhap pn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
        WHERE hh.TrangThai = 1 AND pn.TrangThai = N'Đã Duyệt' AND ctpn.SoLuongTon > 0";

// Append LIKE clause if tenSanPham is provided
if ($tenSanPhamFromGet !== null) {
    $sql .= " AND hh.TenHangHoa LIKE ?";
}

// Add GROUP BY and ORDER BY
$sql .= " GROUP BY hh.MaHangHoa ORDER BY hh.MaHangHoa, ctpn.GiaBan ASC";


$stmt = $conn->prepare($sql);

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

// Bind parameter if tenSanPham was provided
if ($tenSanPhamFromGet !== null) {
    $searchTermWithWildcards = "%" . $tenSanPhamFromGet . "%";
    $stmt->bind_param("s", $searchTermWithWildcards);
}


// Thực thi truy vấn
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $hangHoaList = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if (isset($row['PhanTram']) && $row['PhanTram'] === null) {
                $row['PhanTram'] = 0; 
            }
            if (isset($row['GiaBan'])) {
                $row['GiaBan'] = (float)$row['GiaBan'];
            }
            if (isset($row['PhanTram'])) {
                $row['PhanTram'] = (float)$row['PhanTram'];
            }
            if (isset($row['MaHangHoa'])) $row['MaHangHoa'] = (int)$row['MaHangHoa'];
            if (isset($row['MaChungLoai'])) $row['MaChungLoai'] = (int)$row['MaChungLoai'];
            if (isset($row['MaTheLoai'])) $row['MaTheLoai'] = (int)$row['MaTheLoai'];


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
            "message" => "Không tìm thấy hàng hóa nào." // Generic message
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