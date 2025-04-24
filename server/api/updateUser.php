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

// Hàm xử lý tải lên ảnh đại diện
function uploadAvatar($file)
{
    $targetDir = "../uploads/avatars/";

    // Tạo thư mục nếu chưa tồn tại
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $fileName = time() . '_' . basename($file['name']);
    $targetFilePath = $targetDir . $fileName;
    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

    // Danh sách các định dạng file cho phép
    $allowTypes = array('jpg', 'jpeg', 'png', 'gif');

    if (in_array(strtolower($fileType), $allowTypes)) {
        // Tải file lên server
        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            return $fileName;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// Kiểm tra phương thức HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Lấy dữ liệu từ form data
        $data = $_POST;
        $avatar = null;

        // Xử lý file upload nếu có
        if (isset($_FILES['anh']) && $_FILES['anh']['error'] === UPLOAD_ERR_OK) {
            $avatar = uploadAvatar($_FILES['anh']);
            if ($avatar === false) {
                throw new Exception("Lỗi khi tải lên ảnh đại diện");
            }
        }

        // Kiểm tra dữ liệu bắt buộc
        if (!isset($data['maNguoiDung'], $data['hoTen'], $data['gioiTinh'], $data['email'], $data['soDienThoai'])) {
            throw new Exception("Thiếu dữ liệu đầu vào");
        }

        $maNguoiDung = $data['maNguoiDung'];
        $hoTen = trim($data['hoTen']);
        $gioiTinh = trim($data['gioiTinh']);
        $email = trim($data['email']);
        $soDienThoai = trim($data['soDienThoai']);

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Email không hợp lệ");
        }

        // Validate phone number format
        if (!preg_match('/^[0-9]{10,11}$/', $soDienThoai)) {
            throw new Exception("Số điện thoại không hợp lệ");
        }

        // Validate gender
        if (!in_array($gioiTinh, ['Nam', 'Nữ', 'Khác'])) {
            throw new Exception("Giới tính không hợp lệ");
        }

        // Bắt đầu transaction
        $conn->begin_transaction();

        // Kiểm tra trùng lặp email hoặc số điện thoại
        $checkDuplicateSql = "SELECT * FROM nguoidung WHERE (Email = ? OR SoDienThoai = ?) AND MaNguoiDung != ?";
        $checkDuplicateStmt = $conn->prepare($checkDuplicateSql);
        $checkDuplicateStmt->bind_param("ssi", $email, $soDienThoai, $maNguoiDung);
        $checkDuplicateStmt->execute();
        $checkDuplicateResult = $checkDuplicateStmt->get_result();

        if ($checkDuplicateResult->num_rows > 0) {
            throw new Exception("Email hoặc số điện thoại đã tồn tại");
        }
        $checkDuplicateStmt->close();

        // Kiểm tra ảnh hiện tại nếu không cập nhật ảnh mới
        if ($avatar === null) {
            // Lấy ảnh hiện tại
            $currentAvatarSql = "SELECT Anh FROM nguoidung WHERE MaNguoiDung = ?";
            $currentAvatarStmt = $conn->prepare($currentAvatarSql);
            $currentAvatarStmt->bind_param("i", $maNguoiDung);
            $currentAvatarStmt->execute();
            $currentAvatarResult = $currentAvatarStmt->get_result();
            $currentAvatar = $currentAvatarResult->fetch_assoc();
            $avatar = $currentAvatar['Anh'];
            $currentAvatarStmt->close();
        }

        // Cập nhật thông tin người dùng
        $sqlNguoiDung = "UPDATE nguoidung SET HoTen = ?, GioiTinh = ?, Email = ?, SoDienThoai = ?, Anh = ? WHERE MaNguoiDung = ?";
        $stmtNguoiDung = $conn->prepare($sqlNguoiDung);
        if (!$stmtNguoiDung) {
            throw new Exception("Lỗi chuẩn bị câu lệnh cập nhật: " . $conn->error);
        }
        $stmtNguoiDung->bind_param("sssssi", $hoTen, $gioiTinh, $email, $soDienThoai, $avatar, $maNguoiDung);
        if (!$stmtNguoiDung->execute()) {
            throw new Exception("Lỗi thực thi câu lệnh cập nhật: " . $stmtNguoiDung->error);
        }
        $stmtNguoiDung->close();

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Cập nhật thông tin thành công"
        ]);

    } catch (Exception $e) {
        // Rollback transaction nếu có lỗi
        if ($conn) {
            $conn->rollback();
        }
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    } finally {
        // Đóng kết nối
        if ($conn) {
            $conn->close();
        }
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Phương thức không được hỗ trợ"
    ]);
}
?>