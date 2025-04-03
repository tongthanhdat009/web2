<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Lấy danh sách người dùng
        $sql = "SELECT * FROM nguoidung";
        $result = $conn->query($sql);
        $users = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["success" => true, "data" => $users], JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        // Thêm người dùng mới
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['hoTen'], $data['gioiTinh'], $data['email'], $data['soDienThoai'])) {
            echo json_encode(["success" => false, "message" => "Thiếu dữ liệu đầu vào"]);
            exit;
        }

        $hoTen = trim($data['hoTen']);
        $gioiTinh = trim($data['gioiTinh']);
        $email = trim($data['email']);
        $soDienThoai = trim($data['soDienThoai']);

        if (empty($hoTen) || empty($gioiTinh) || empty($email) || empty($soDienThoai)) {
            echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ thông tin"]);
            exit;
        }

        // Kiểm tra trùng lặp email hoặc số điện thoại
        $checkDuplicateSql = "SELECT * FROM nguoidung WHERE Email = ? OR SoDienThoai = ?";
        $checkDuplicateStmt = $conn->prepare($checkDuplicateSql);
        $checkDuplicateStmt->bind_param("ss", $email, $soDienThoai);
        $checkDuplicateStmt->execute();
        $checkDuplicateResult = $checkDuplicateStmt->get_result();

        if ($checkDuplicateResult->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email hoặc số điện thoại đã tồn tại."]);
            exit;
        }
        $checkDuplicateStmt->close();

        // Chèn dữ liệu mới
        $sql = "INSERT INTO nguoidung (HoTen, GioiTinh, Email, SoDienThoai) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $hoTen, $gioiTinh, $email, $soDienThoai);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Thêm người dùng thành công."]);
        } else {
            echo json_encode(["success" => false, "message" => "Thêm người dùng thất bại: " . $conn->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Sửa thông tin người dùng
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['maNguoiDung'], $data['hoTen'], $data['gioiTinh'], $data['email'], $data['soDienThoai'])) {
            echo json_encode(["success" => false, "message" => "Thiếu dữ liệu đầu vào"]);
            exit;
        }

        $maNguoiDung = $data['maNguoiDung'];
        $hoTen = trim($data['hoTen']);
        $gioiTinh = trim($data['gioiTinh']);
        $email = trim($data['email']);
        $soDienThoai = trim($data['soDienThoai']);

        // Kiểm tra trùng lặp email hoặc số điện thoại
        $checkDuplicateSql = "SELECT * FROM nguoidung WHERE (Email = ? OR SoDienThoai = ?) AND MaNguoiDung != ?";
        $checkDuplicateStmt = $conn->prepare($checkDuplicateSql);
        $checkDuplicateStmt->bind_param("ssi", $email, $soDienThoai, $maNguoiDung);
        $checkDuplicateStmt->execute();
        $checkDuplicateResult = $checkDuplicateStmt->get_result();

        if ($checkDuplicateResult->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email hoặc số điện thoại đã tồn tại."]);
            exit;
        }
        $checkDuplicateStmt->close();

        $sql = "UPDATE nguoidung SET HoTen = ?, GioiTinh = ?, Email = ?, SoDienThoai = ? WHERE MaNguoiDung = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssi", $hoTen, $gioiTinh, $email, $soDienThoai, $maNguoiDung);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Cập nhật người dùng thành công."]);
        } else {
            echo json_encode(["success" => false, "message" => "Cập nhật người dùng thất bại: " . $conn->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // Xóa người dùng
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['maNguoiDung'])) {
            echo json_encode(["success" => false, "message" => "Thiếu mã người dùng"]);
            exit;
        }

        $maNguoiDung = $data['maNguoiDung'];

        $sql = "DELETE FROM nguoidung WHERE MaNguoiDung = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $maNguoiDung);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Xóa người dùng thành công."]);
        } else {
            echo json_encode(["success" => false, "message" => "Xóa người dùng thất bại: " . $conn->error]);
        }
        $stmt->close();
        break;
}

// Đóng kết nối
$conn->close();
?>
