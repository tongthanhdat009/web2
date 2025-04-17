<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Hàm mã hóa mật khẩu
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Hàm xử lý tải lên ảnh đại diện
function uploadAvatar($file) {
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

switch ($method) {
    case 'GET':
        // Tìm kiếm người dùng nếu có từ khóa
        if (isset($_GET['keyword'])) {
            $keyword = '%' . trim($_GET['keyword']) . '%';
            $sql = "SELECT nguoidung.*, taikhoan.TenDangNhap, taikhoan.IdQuyen FROM nguoidung 
                    INNER JOIN taikhoan ON nguoidung.MaNguoiDung = taikhoan.MaNguoiDung 
                    WHERE HoTen LIKE ? OR Email LIKE ? OR SoDienThoai LIKE ? OR TenDangNhap LIKE ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $keyword, $keyword, $keyword, $keyword);
            $stmt->execute();
            $result = $stmt->get_result();
            $users = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode(["success" => true, "data" => $users], JSON_UNESCAPED_UNICODE);
            exit;
        }
        // Lấy danh sách người dùng
        $sql = "SELECT n.MaNguoiDung, n.HoTen, n.GioiTinh, n.Email, n.SoDienThoai, n.Anh, t.IdTaiKhoan, t.TenDangNhap, t.IdQuyen 
                FROM nguoidung n 
                LEFT JOIN taikhoan t ON n.MaNguoiDung = t.MaNguoiDung";
        $result = $conn->query($sql);
        $users = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["success" => true, "data" => $users], JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        // Thêm người dùng mới và tài khoản
        // Kiểm tra nếu là form data (khi có file tải lên)
        if (!empty($_FILES['anh']['name'])) {
            $data = $_POST;
            $avatar = uploadAvatar($_FILES['anh']);
        } else {
            // Nếu không có file, đọc JSON
            $data = json_decode(file_get_contents("php://input"), true);
            $avatar = null;
        }

        // Kiểm tra dữ liệu đầu vào
        if (!isset($data['hoTen'], $data['gioiTinh'], $data['email'], $data['soDienThoai'], 
                  $data['tenDangNhap'], $data['matKhau'], $data['idQuyen'])) {
            echo json_encode(["success" => false, "message" => "Thiếu dữ liệu đầu vào"]);
            exit;
        }

        $hoTen = trim($data['hoTen']);
        $gioiTinh = trim($data['gioiTinh']);
        $email = trim($data['email']);
        $soDienThoai = trim($data['soDienThoai']);
        $tenDangNhap = trim($data['tenDangNhap']);
        $matKhau = trim($data['matKhau']);
        $idQuyen = trim($data['idQuyen']);

        if (empty($hoTen) || empty($gioiTinh) || empty($email) || empty($soDienThoai) || 
            empty($tenDangNhap) || empty($matKhau)) {
            echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ thông tin"]);
            exit;
        }

        // Kiểm tra quyền hợp lệ
        $validRoles = [1, 2, 3]; // Giả sử 1: Admin, 2: Nhân viên, 3: Khách hàng
        if (!in_array((int)$idQuyen, $validRoles)) {
            echo json_encode(["success" => false, "message" => "Quyền không hợp lệ"]);
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

        // Kiểm tra trùng lặp tên đăng nhập
        $checkUsernameSql = "SELECT * FROM taikhoan WHERE TenDangNhap = ?";
        $checkUsernameStmt = $conn->prepare($checkUsernameSql);
        $checkUsernameStmt->bind_param("s", $tenDangNhap);
        $checkUsernameStmt->execute();
        $checkUsernameResult = $checkUsernameStmt->get_result();

        if ($checkUsernameResult->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Tên đăng nhập đã tồn tại."]);
            exit;
        }
        $checkUsernameStmt->close();

        // Bắt đầu transaction
        $conn->begin_transaction();

        try {
            // Chèn thông tin người dùng
            $sqlNguoiDung = "INSERT INTO nguoidung (HoTen, GioiTinh, Email, SoDienThoai, Anh) VALUES (?, ?, ?, ?, ?)";
            $stmtNguoiDung = $conn->prepare($sqlNguoiDung);
            $stmtNguoiDung->bind_param("sssss", $hoTen, $gioiTinh, $email, $soDienThoai, $avatar);
            $stmtNguoiDung->execute();
            $maNguoiDung = $conn->insert_id;
            $stmtNguoiDung->close();

            // Mã hóa mật khẩu
            $hashedPassword = hashPassword($matKhau);

            // Chèn thông tin tài khoản
            $sqlTaiKhoan = "INSERT INTO taikhoan (MaNguoiDung, TenDangNhap, MatKhau, IdQuyen) VALUES (?, ?, ?, ?)";
            $stmtTaiKhoan = $conn->prepare($sqlTaiKhoan);
            $stmtTaiKhoan->bind_param("issi", $maNguoiDung, $tenDangNhap, $hashedPassword, $idQuyen);
            $stmtTaiKhoan->execute();
            $stmtTaiKhoan->close();

            // Commit transaction
            $conn->commit();
            echo json_encode(["success" => true, "message" => "Thêm người dùng và tài khoản thành công."]);
        } catch (Exception $e) {
            // Rollback transaction nếu có lỗi
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Thêm người dùng thất bại: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Sửa thông tin người dùng và tài khoản
        // Kiểm tra nếu là form data (khi có file tải lên)
        if (!empty($_FILES['anh']['name'])) {
            $data = $_POST;
            $avatar = uploadAvatar($_FILES['anh']);
        } else {
            // Nếu không có file, đọc JSON
            $data = json_decode(file_get_contents("php://input"), true);
            $avatar = null;
        }

        if (!isset($data['maNguoiDung'], $data['hoTen'], $data['gioiTinh'], $data['email'], $data['soDienThoai'])) {
            echo json_encode(["success" => false, "message" => "Thiếu dữ liệu đầu vào"]);
            exit;
        }

        $maNguoiDung = $data['maNguoiDung'];
        $hoTen = trim($data['hoTen']);
        $gioiTinh = trim($data['gioiTinh']);
        $email = trim($data['email']);
        $soDienThoai = trim($data['soDienThoai']);

        // Kiểm tra nếu có cập nhật tài khoản
        $updateAccount = isset($data['idTaiKhoan']) && !empty($data['idTaiKhoan']);
        if ($updateAccount) {
            $idTaiKhoan = $data['idTaiKhoan'];
            $tenDangNhapUpdate = isset($data['tenDangNhap']) ? trim($data['tenDangNhap']) : null;
            $updatePassword = isset($data['matKhau']) && !empty(trim($data['matKhau']));
            $idQuyenUpdate = isset($data['idQuyen']) ? $data['idQuyen'] : null;
            
            // Kiểm tra quyền hợp lệ nếu có cập nhật quyền
            if ($idQuyenUpdate !== null) {
                $validRoles = [1, 2, 3]; // Giả sử 1: Admin, 2: Nhân viên, 3: Khách hàng
                if (!in_array((int)$idQuyenUpdate, $validRoles)) {
                    echo json_encode(["success" => false, "message" => "Quyền không hợp lệ"]);
                    exit;
                }
            }
        }

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

        // Kiểm tra trùng lặp tên đăng nhập nếu cập nhật tài khoản
        if ($updateAccount && $tenDangNhapUpdate) {
            $checkUsernameSql = "SELECT * FROM taikhoan WHERE TenDangNhap = ? AND IdTaiKhoan != ?";
            $checkUsernameStmt = $conn->prepare($checkUsernameSql);
            $checkUsernameStmt->bind_param("si", $tenDangNhapUpdate, $idTaiKhoan);
            $checkUsernameStmt->execute();
            $checkUsernameResult = $checkUsernameStmt->get_result();

            if ($checkUsernameResult->num_rows > 0) {
                echo json_encode(["success" => false, "message" => "Tên đăng nhập đã tồn tại."]);
                exit;
            }
            $checkUsernameStmt->close();
        }

        // Bắt đầu transaction
        $conn->begin_transaction();

        try {
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
            $stmtNguoiDung->bind_param("sssssi", $hoTen, $gioiTinh, $email, $soDienThoai, $avatar, $maNguoiDung);
            $stmtNguoiDung->execute();
            $stmtNguoiDung->close();

            // Cập nhật thông tin tài khoản nếu được yêu cầu
            if ($updateAccount) {
                // Xây dựng SQL động dựa trên các trường cần cập nhật
                $sqlFields = [];
                $sqlParams = [];
                $sqlTypes = "";
                
                if ($tenDangNhapUpdate) {
                    $sqlFields[] = "TenDangNhap = ?";
                    $sqlParams[] = $tenDangNhapUpdate;
                    $sqlTypes .= "s";
                }
                
                if ($updatePassword) {
                    $matKhau = trim($data['matKhau']);
                    $hashedPassword = hashPassword($matKhau);
                    $sqlFields[] = "MatKhau = ?";
                    $sqlParams[] = $hashedPassword;
                    $sqlTypes .= "s";
                }
                
                if ($idQuyenUpdate !== null) {
                    $sqlFields[] = "IdQuyen = ?";
                    $sqlParams[] = $idQuyenUpdate;
                    $sqlTypes .= "i";
                }
                
                if (!empty($sqlFields)) {
                    $sqlTaiKhoan = "UPDATE taikhoan SET " . implode(", ", $sqlFields) . " WHERE IdTaiKhoan = ?";
                    $sqlParams[] = $idTaiKhoan;
                    $sqlTypes .= "i";
                    
                    $stmtTaiKhoan = $conn->prepare($sqlTaiKhoan);
                    $stmtTaiKhoan->bind_param($sqlTypes, ...$sqlParams);
                    $stmtTaiKhoan->execute();
                    $stmtTaiKhoan->close();
                }
            }

            // Commit transaction
            $conn->commit();
            echo json_encode(["success" => true, "message" => "Cập nhật thông tin thành công."]);
        } catch (Exception $e) {
            // Rollback transaction nếu có lỗi
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Cập nhật thông tin thất bại: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Xóa người dùng và tài khoản liên quan
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['maNguoiDung'])) {
            echo json_encode(["success" => false, "message" => "Thiếu mã người dùng"]);
            exit;
        }

        $maNguoiDung = $data['maNguoiDung'];

        // Bắt đầu transaction
        $conn->begin_transaction();

        try {
            // Xóa avatar file nếu có
            $avatarSql = "SELECT Anh FROM nguoidung WHERE MaNguoiDung = ?";
            $avatarStmt = $conn->prepare($avatarSql);
            $avatarStmt->bind_param("i", $maNguoiDung);
            $avatarStmt->execute();
            $avatarResult = $avatarStmt->get_result();
            $avatar = $avatarResult->fetch_assoc();
            $avatarStmt->close();
            
            if ($avatar && !empty($avatar['Anh'])) {
                $avatarPath = "../uploads/avatars/" . $avatar['Anh'];
                if (file_exists($avatarPath)) {
                    unlink($avatarPath);
                }
            }

            // Xóa tài khoản trước
            $sqlTaiKhoan = "DELETE FROM taikhoan WHERE MaNguoiDung = ?";
            $stmtTaiKhoan = $conn->prepare($sqlTaiKhoan);
            $stmtTaiKhoan->bind_param("i", $maNguoiDung);
            $stmtTaiKhoan->execute();
            $stmtTaiKhoan->close();

            // Sau đó xóa người dùng
            $sqlNguoiDung = "DELETE FROM nguoidung WHERE MaNguoiDung = ?";
            $stmtNguoiDung = $conn->prepare($sqlNguoiDung);
            $stmtNguoiDung->bind_param("i", $maNguoiDung);
            $stmtNguoiDung->execute();
            $stmtNguoiDung->close();

            // Commit transaction
            $conn->commit();
            echo json_encode(["success" => true, "message" => "Xóa người dùng và tài khoản thành công."]);
        } catch (Exception $e) {
            // Rollback transaction nếu có lỗi
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Xóa người dùng thất bại: " . $e->getMessage()]);
        }
        break;
}

// Đóng kết nối
$conn->close();
?>