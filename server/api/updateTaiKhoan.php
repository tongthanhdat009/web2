<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

// Hỗ trợ cả JSON và form-data
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], "application/json") !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
} else {
    $data = $_POST;
}

$idTaiKhoan = isset($data['IDTaiKhoan']) ? intval($data['IDTaiKhoan']) : 0;
$hoTen = isset($data['HoTen']) ? trim($data['HoTen']) : null;
$gioiTinh = isset($data['GioiTinh']) ? trim($data['GioiTinh']) : null;
$email = isset($data['Email']) ? trim($data['Email']) : null;
$soDienThoai = isset($data['SoDienThoai']) ? trim($data['SoDienThoai']) : null;
$idQuyen = isset($data['IDQuyen']) ? intval($data['IDQuyen']) : null;
$matKhau = isset($data['MatKhau']) ? $data['MatKhau'] : null;

if ($idTaiKhoan === 0) {
    echo json_encode(["success" => false, "message" => "Thiếu ID tài khoản"]);
    exit;
}

// Cập nhật bảng nguoidung
$sqlNguoiDung = "UPDATE nguoidung SET HoTen=?, GioiTinh=?, Email=?, SoDienThoai=? WHERE IDTaiKhoan=?";
$stmt1 = $conn->prepare($sqlNguoiDung);
$stmt1->bind_param("ssssi", $hoTen, $gioiTinh, $email, $soDienThoai, $idTaiKhoan);
$success1 = $stmt1->execute();
$stmt1->close();

// Cập nhật bảng taikhoan (IDQuyen, MatKhau nếu có)
$success2 = true;
if ($idQuyen !== null || ($matKhau !== null && $matKhau !== "")) {
    $fields = [];
    $params = [];
    $types = "";

    if ($idQuyen !== null) {
        $fields[] = "IDQuyen=?";
        $params[] = $idQuyen;
        $types .= "i";
    }
    if ($matKhau !== null && $matKhau !== "") {
        $hashedPassword = password_hash($matKhau, PASSWORD_DEFAULT);
        $fields[] = "MatKhau=?";
        $params[] = $hashedPassword;
        $types .= "s";
    }
    $params[] = $idTaiKhoan;
    $types .= "i";

    $sqlTaiKhoan = "UPDATE taikhoan SET " . implode(", ", $fields) . " WHERE IDTaiKhoan=?";
    $stmt2 = $conn->prepare($sqlTaiKhoan);
    $stmt2->bind_param($types, ...$params);
    $success2 = $stmt2->execute();
    $stmt2->close();
}

if ($success1 && $success2) {
    echo json_encode(["success" => true, "message" => "Cập nhật tài khoản thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Cập nhật thất bại"]);
}

$conn->close();
?>