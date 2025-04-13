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

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['MaHangHoa']) && isset($data['TenHangHoa']) && isset($data['MaChungLoai']) && isset($data['MaHang'])) {
    $maHangHoa = $conn->real_escape_string($data['MaHangHoa']);
    $tenHangHoa = $conn->real_escape_string($data['TenHangHoa']);
    $maChungLoai = $conn->real_escape_string($data['MaChungLoai']);
    $maHang = $conn->real_escape_string($data['MaHang']);
    $maKhuyenMai = isset($data['MaKhuyenMai']) ? $conn->real_escape_string($data['MaKhuyenMai']) : "NULL";
    $moTa = isset($data['MoTa']) ? $conn->real_escape_string($data['MoTa']) : "NULL";
    $thoiGianBaoHanh = isset($data['ThoiGianBaoHanh']) ? (int) $data['ThoiGianBaoHanh'] : "NULL";
    $anh = isset($data['Anh']) ? $conn->real_escape_string($data['Anh']) : "NULL";

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
    if ($maKhuyenMai !== "NULL") {
        $checkKM = $conn->query("SELECT MaKhuyenMai FROM khuyenmai WHERE MaKhuyenMai = '$maKhuyenMai'");
        if ($checkKM->num_rows == 0) {
            echo json_encode(["success" => false, "message" => "Mã khuyến mãi không tồn tại"]);
            exit;
        }
    }

    // Cập nhật thông tin hàng hóa
    $sql = "UPDATE hanghoa SET 
                TenHangHoa = '$tenHangHoa', 
                MaChungLoai = '$maChungLoai', 
                MaHang = '$maHang', 
                MaKhuyenMai = " . ($maKhuyenMai === "NULL" ? "NULL" : "'$maKhuyenMai'") . ", 
                MoTa = " . ($moTa === "NULL" ? "NULL" : "'$moTa'") . ", 
                ThoiGianBaoHanh = " . ($thoiGianBaoHanh === "NULL" ? "NULL" : $thoiGianBaoHanh) . ", 
                Anh = " . ($anh === "NULL" ? "NULL" : "'$anh'") . " 
            WHERE MaHangHoa = '$maHangHoa'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Cập nhật hàng hóa thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Cập nhật hàng hóa thất bại", "error" => $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
}

$conn->close();
?>