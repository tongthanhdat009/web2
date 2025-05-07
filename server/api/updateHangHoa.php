<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

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
        "message" => "Thiếu thông tin bắt buộc: " . implode(", ", $missing_fields)
    ]);
    exit();
}

// Escape các giá trị
$maHangHoa = $conn->real_escape_string($data['MaHangHoa']);
$tenHangHoa = $conn->real_escape_string($data['TenHangHoa']);
$maChungLoai = $conn->real_escape_string($data['MaChungLoai']);
$maHang = $conn->real_escape_string($data['MaHang']);
$trangThai = $conn->real_escape_string($data['TrangThai']);
$maKhuyenMai = !empty($data['MaKhuyenMai']) ? $conn->real_escape_string($data['MaKhuyenMai']) : null;
$moTa = isset($data['MoTa']) ? $conn->real_escape_string($data['MoTa']) : '';
$thoiGianBaoHanh = isset($data['ThoiGianBaoHanh']) ? $conn->real_escape_string($data['ThoiGianBaoHanh']) : '';

// Kiểm tra MaHangHoa có tồn tại
$checkProduct = $conn->query("SELECT MaHangHoa FROM hanghoa WHERE MaHangHoa = '$maHangHoa'");
if ($checkProduct->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Không tìm thấy hàng hóa"]);
    exit;
}

// Kiểm tra MaChungLoai có tồn tại
$checkCL = $conn->query("SELECT MaChungLoai FROM chungloai WHERE MaChungLoai = '$maChungLoai'");
if ($checkCL->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Mã chủng loại không tồn tại"]);
    exit;
}

// Kiểm tra MaHang có tồn tại
$checkHang = $conn->query("SELECT MaHang FROM hang WHERE MaHang = '$maHang'");
if ($checkHang->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Mã hãng không tồn tại"]);
    exit;
}

// Kiểm tra MaKhuyenMai nếu có
if ($maKhuyenMai !== null) {
    $checkKM = $conn->query("SELECT MaKhuyenMai FROM khuyenmai WHERE MaKhuyenMai = '$maKhuyenMai'");
    if ($checkKM->num_rows == 0) {
        echo json_encode(["success" => false, "message" => "Mã khuyến mãi không tồn tại"]);
        exit;
    }
}

// Xử lý upload ảnh
$anh = null;
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

// Chuẩn bị câu lệnh update
$sql = "UPDATE hanghoa SET 
            TenHangHoa = ?, 
            MaChungLoai = ?, 
            MaHang = ?, 
            MaKhuyenMai = ?, 
            MoTa = ?, 
            ThoiGianBaoHanh = ?, 
            TrangThai = ?";

// Thêm Anh vào câu lệnh update nếu có ảnh mới
if ($anh !== null) {
    $sql .= ", Anh = ?";
}

$sql .= " WHERE MaHangHoa = ?";

// Chuẩn bị statement
$stmt = $conn->prepare($sql);

// Bind parameters
if ($anh !== null) {
    $stmt->bind_param(
        "sssssssss",
        $tenHangHoa,
        $maChungLoai,
        $maHang,
        $maKhuyenMai,
        $moTa,
        $thoiGianBaoHanh,
        $trangThai,
        $anh,
        $maHangHoa
    );
} else {
    $stmt->bind_param(
        "ssssssss",
        $tenHangHoa,
        $maChungLoai,
        $maHang,
        $maKhuyenMai,
        $moTa,
        $thoiGianBaoHanh,
        $trangThai,
        $maHangHoa
    );
}

// Thực thi câu lệnh
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật hàng hóa thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Cập nhật hàng hóa thất bại", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>