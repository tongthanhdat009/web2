<?php
// Bật hiển thị lỗi để debug
ini_set('display_errors', 0); // Không hiển thị lỗi ra trình duyệt
ini_set('log_errors', 1); // Ghi lỗi vào file log
ini_set('error_log', __DIR__ . '/error.log'); // Tạo file error.log cùng thư mục

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

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi kết nối cơ sở dữ liệu"
    ]);
    exit();
}

// Parse input data
$data = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'MaHangHoa' => isset($_POST['MaHangHoa']) ? $_POST['MaHangHoa'] : '',
        'TenHangHoa' => isset($_POST['TenHangHoa']) ? $_POST['TenHangHoa'] : '',
        'MaChungLoai' => isset($_POST['MaChungLoai']) ? $_POST['MaChungLoai'] : '',
        'MaHang' => isset($_POST['MaHang']) ? $_POST['MaHang'] : '',
        'MaKhuyenMai' => isset($_POST['MaKhuyenMai']) ? $_POST['MaKhuyenMai'] : '',
        'MoTa' => isset($_POST['MoTa']) ? $_POST['MoTa'] : '',
        'ThoiGianBaoHanh' => isset($_POST['ThoiGianBaoHanh']) ? $_POST['ThoiGianBaoHanh'] : '',
        'TrangThai' => isset($_POST['TrangThai']) ? $_POST['TrangThai'] : '1'
    ];
}

// Debug info
$debug_info = [
    "request_method" => $_SERVER['REQUEST_METHOD'],
    "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'Not set',
    "post_data" => $_POST,
    "files" => $_FILES,
    "headers" => getallheaders()
];

// Kiểm tra các trường bắt buộc
$required_fields = ["MaHangHoa", "TenHangHoa", "MaChungLoai", "MaHang"];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu thông tin bắt buộc: " . implode(", ", $missing_fields),
        "debug_info" => $debug_info
    ]);
    exit();
}

// Kiểm tra mã hàng hóa đã tồn tại
$check_query = "SELECT 1 FROM hanghoa WHERE MaHangHoa = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("s", $data['MaHangHoa']);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Mã hàng hóa đã tồn tại"
    ]);
    $check_stmt->close();
    $conn->close();
    exit();
}
$check_stmt->close();

// Kiểm tra tên hàng hóa đã tồn tại
$check_name_query = "SELECT 1 FROM hanghoa WHERE TenHangHoa = ?";
$check_name_stmt = $conn->prepare($check_name_query);
$check_name_stmt->bind_param("s", $data['TenHangHoa']);
$check_name_stmt->execute();
$check_name_stmt->store_result();

if ($check_name_stmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Tên hàng hóa đã tồn tại"
    ]);
    $check_name_stmt->close();
    $conn->close();
    exit();
}
$check_name_stmt->close();

// Kiểm tra chủng loại tồn tại
$check_cl_query = "SELECT 1 FROM chungloai WHERE MaChungLoai = ?";
$check_cl_stmt = $conn->prepare($check_cl_query);
$check_cl_stmt->bind_param("s", $data['MaChungLoai']);
$check_cl_stmt->execute();
$check_cl_stmt->store_result();

if ($check_cl_stmt->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Chủng loại không tồn tại"
    ]);
    $check_cl_stmt->close();
    $conn->close();
    exit();
}
$check_cl_stmt->close();

// Kiểm tra hãng tồn tại
$check_h_query = "SELECT 1 FROM hang WHERE MaHang = ?";
$check_h_stmt = $conn->prepare($check_h_query);
$check_h_stmt->bind_param("s", $data['MaHang']);
$check_h_stmt->execute();
$check_h_stmt->store_result();

if ($check_h_stmt->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Hãng không tồn tại"
    ]);
    $check_h_stmt->close();
    $conn->close();
    exit();
}
$check_h_stmt->close();

// Nếu có MaKhuyenMai thì kiểm tra
if (!empty($data['MaKhuyenMai'])) {
    $check_km_query = "SELECT 1 FROM khuyenmai WHERE MaKhuyenMai = ?";
    $check_km_stmt = $conn->prepare($check_km_query);
    $check_km_stmt->bind_param("s", $data['MaKhuyenMai']);
    $check_km_stmt->execute();
    $check_km_stmt->store_result();

    if ($check_km_stmt->num_rows == 0) {
        echo json_encode([
            "success" => false,
            "message" => "Khuyến mãi không tồn tại"
        ]);
        $check_km_stmt->close();
        $conn->close();
        exit();
    }
    $check_km_stmt->close();
}

// Thay thế các giá trị null bằng chuỗi trống nếu có
$maKhuyenMai = !empty($data['MaKhuyenMai']) ? $data['MaKhuyenMai'] : null;
$moTa = isset($data['MoTa']) ? $data['MoTa'] : '';
$thoiGianBaoHanh = isset($data['ThoiGianBaoHanh']) ? $data['ThoiGianBaoHanh'] : '';
$trangThai = isset($data['TrangThai']) ? $data['TrangThai'] : '1';

// Xử lý upload ảnh
$anh = '';
if (isset($_FILES['Anh']) && $_FILES['Anh']['error'] === UPLOAD_ERR_OK) {
    // Tạo thư mục nếu chưa tồn tại
    $upload_dir = "../../public/assets/AnhHangHoa/";
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Lấy thông tin file
    $file = $_FILES['Anh'];
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    // Kiểm tra định dạng file
    $allowed_extensions = array('jpg', 'jpeg', 'png', 'gif');
    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode([
            "success" => false,
            "message" => "Định dạng file không được hỗ trợ. Chỉ chấp nhận: " . implode(', ', $allowed_extensions)
        ]);
        exit();
    }

    // Tạo tên file duy nhất
    $file_name = $data['MaHangHoa'] . '_' . time() . '.' . $file_extension;
    $file_path = $upload_dir . $file_name;

    // Upload file
    if (move_uploaded_file($file['tmp_name'], $file_path)) {
        $anh = "/public/assets/AnhHangHoa/" . $file_name;
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi lưu ảnh"
        ]);
        exit();
    }
}

// Chuẩn bị câu lệnh insert
$query = "INSERT INTO hanghoa (MaHangHoa, TenHangHoa, MaChungLoai, MaHang, MaKhuyenMai, MoTa, ThoiGianBaoHanh, Anh, TrangThai) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);
$stmt->bind_param(
    "sssssssss",
    $data['MaHangHoa'],
    $data['TenHangHoa'],
    $data['MaChungLoai'],
    $data['MaHang'],
    $maKhuyenMai,
    $moTa,
    $thoiGianBaoHanh,
    $anh,
    $trangThai
);

// Thực thi truy vấn
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm hàng hóa thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi thêm hàng hóa: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>