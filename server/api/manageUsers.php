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
function hashPassword($password)
{
    return password_hash($password, PASSWORD_DEFAULT);
}

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

switch ($method) {
    case 'GET':
        try {
            // Tìm kiếm người dùng nếu có từ khóa
            if (isset($_GET['keyword'])) {
                $keyword = '%' . trim($_GET['keyword']) . '%';
                $sql = "SELECT n.*, t.TaiKhoan, t.IDQuyen, t.TrangThai, t.HoatDong, Q.TenQuyen
                        FROM nguoidung n 
                        INNER JOIN taikhoan t ON n.IDTaiKhoan = t.IDTaiKhoan 
                        INNER JOIN quyen q ON t.IDQuyen = q.IDQuyen
                        WHERE n.HoTen LIKE ? OR n.Email LIKE ? OR n.SoDienThoai LIKE ? OR t.TaiKhoan LIKE ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    throw new Exception("Lỗi chuẩn bị câu lệnh tìm kiếm: " . $conn->error);
                }
                $stmt->bind_param("ssss", $keyword, $keyword, $keyword, $keyword);
                if (!$stmt->execute()) {
                    throw new Exception("Lỗi thực thi câu lệnh tìm kiếm: " . $stmt->error);
                }
                $result = $stmt->get_result();
                $users = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode(["success" => true, "data" => $users], JSON_UNESCAPED_UNICODE);
                $stmt->close();
                exit;
            }

            // Lấy danh sách người dùng
            $sql = "SELECT n.MaNguoiDung, n.HoTen, n.GioiTinh, n.Email, n.SoDienThoai, n.Anh, 
                           t.IDTaiKhoan, t.TaiKhoan, t.IDQuyen, t.TrangThai, t.HoatDong
                    FROM nguoidung n 
                    LEFT JOIN taikhoan t ON n.IDTaiKhoan = t.IDTaiKhoan";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Lỗi chuẩn bị câu lệnh: " . $conn->error);
            }
            if (!$stmt->execute()) {
                throw new Exception("Lỗi thực thi câu lệnh: " . $stmt->error);
            }
            $result = $stmt->get_result();
            if (!$result) {
                throw new Exception("Lỗi lấy kết quả: " . $conn->error);
            }
            $users = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode(["success" => true, "data" => $users], JSON_UNESCAPED_UNICODE);
            $stmt->close();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
        break;

    case 'POST':
        try {
            // Đọc dữ liệu JSON từ request body
            $jsonData = file_get_contents("php://input");
            if (empty($jsonData)) {
                throw new Exception("Không có dữ liệu được gửi đến");
            }

            $data = json_decode($jsonData);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Dữ liệu JSON không hợp lệ: " . json_last_error_msg());
            }

            // Kiểm tra các trường bắt buộc
            $requiredFields = ['hoTen', 'gioiTinh', 'email', 'soDienThoai', 'tenDangNhap', 'matKhau'];
            foreach ($requiredFields as $field) {
                if (!isset($data->$field) || empty(trim($data->$field))) {
                    throw new Exception("Trường " . $field . " là bắt buộc");
                }
            }

            $hoTen = trim($data->hoTen);
            $gioiTinh = trim($data->gioiTinh);
            $email = trim($data->email);
            $soDienThoai = trim($data->soDienThoai);
            $tenDangNhap = trim($data->tenDangNhap);
            $matKhau = trim($data->matKhau);
            $idQuyen = isset($data->idQuyen) ? (int) $data->idQuyen : 2;

            // Validate email format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Email không hợp lệ");
            }

            // Validate phone number format (basic check)
            if (!preg_match('/^[0-9]{10,11}$/', $soDienThoai)) {
                throw new Exception("Số điện thoại không hợp lệ");
            }

            // Validate username format
            if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $tenDangNhap)) {
                throw new Exception("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới, độ dài từ 3-20 ký tự");
            }

            // Validate password strength
            if (strlen($matKhau) < 6) {
                throw new Exception("Mật khẩu phải có ít nhất 6 ký tự");
            }

            // Validate gender
            if (!in_array($gioiTinh, ['Nam', 'Nữ', 'Khác'])) {
                throw new Exception("Giới tính không hợp lệ");
            }

            // Validate role
            if (!in_array($idQuyen, [1, 2, 3])) {
                throw new Exception("Quyền không hợp lệ");
            }

            // Bắt đầu transaction
            $conn->begin_transaction();

            // Kiểm tra trùng lặp email
            $checkEmailSql = "SELECT MaNguoiDung FROM nguoidung WHERE Email = ?";
            $stmtCheckEmail = $conn->prepare($checkEmailSql);
            if (!$stmtCheckEmail) {
                throw new Exception("Lỗi chuẩn bị câu lệnh kiểm tra email: " . $conn->error);
            }
            $stmtCheckEmail->bind_param("s", $email);
            if (!$stmtCheckEmail->execute()) {
                throw new Exception("Lỗi thực thi câu lệnh kiểm tra email: " . $stmtCheckEmail->error);
            }
            if ($stmtCheckEmail->get_result()->num_rows > 0) {
                throw new Exception("Email đã tồn tại");
            }
            $stmtCheckEmail->close();

            // Kiểm tra trùng lặp số điện thoại
            $checkPhoneSql = "SELECT MaNguoiDung FROM nguoidung WHERE SoDienThoai = ?";
            $stmtCheckPhone = $conn->prepare($checkPhoneSql);
            if (!$stmtCheckPhone) {
                throw new Exception("Lỗi chuẩn bị câu lệnh kiểm tra số điện thoại: " . $conn->error);
            }
            $stmtCheckPhone->bind_param("s", $soDienThoai);
            if (!$stmtCheckPhone->execute()) {
                throw new Exception("Lỗi thực thi câu lệnh kiểm tra số điện thoại: " . $stmtCheckPhone->error);
            }
            if ($stmtCheckPhone->get_result()->num_rows > 0) {
                throw new Exception("Số điện thoại đã tồn tại");
            }
            $stmtCheckPhone->close();

            // Kiểm tra trùng lặp tên đăng nhập (sử dụng TaiKhoan)
            $checkUsernameSql = "SELECT IDTaiKhoan FROM taikhoan WHERE TaiKhoan = ?";
            $stmtCheckUsername = $conn->prepare($checkUsernameSql);
            if (!$stmtCheckUsername) {
                throw new Exception("Lỗi chuẩn bị câu lệnh kiểm tra tên đăng nhập: " . $conn->error);
            }
            $stmtCheckUsername->bind_param("s", $tenDangNhap);
            if (!$stmtCheckUsername->execute()) {
                throw new Exception("Lỗi thực thi câu lệnh kiểm tra tên đăng nhập: " . $stmtCheckUsername->error);
            }
            if ($stmtCheckUsername->get_result()->num_rows > 0) {
                throw new Exception("Tên đăng nhập đã tồn tại");
            }
            $stmtCheckUsername->close();

            // --- Bước 1: Thêm tài khoản --- 
            $hashedPassword = password_hash($matKhau, PASSWORD_DEFAULT);
            // Bỏ cột MaNguoiDung khỏi câu lệnh INSERT
            $sqlTaiKhoan = "INSERT INTO taikhoan (TaiKhoan, MatKhau, IDQuyen, HoatDong, TrangThai) VALUES (?, ?, ?, 0, 1)";
            $stmtTaiKhoan = $conn->prepare($sqlTaiKhoan);
            if (!$stmtTaiKhoan) {
                throw new Exception("Lỗi chuẩn bị câu lệnh thêm tài khoản: " . $conn->error);
            }
            // Cập nhật bind_param: bỏ maNguoiDung
            $stmtTaiKhoan->bind_param("ssi", $tenDangNhap, $hashedPassword, $idQuyen);
            if (!$stmtTaiKhoan->execute()) {
                throw new Exception("Lỗi thực thi câu lệnh thêm tài khoản: " . $stmtTaiKhoan->error);
            }
            // Lấy IDTaiKhoan vừa được tạo
            $idTaiKhoan = $conn->insert_id;
            $stmtTaiKhoan->close();

            // --- Bước 2: Thêm người dùng --- 
            // Thêm cột IDTaiKhoan vào câu lệnh INSERT và bind_param
            $sqlNguoiDung = "INSERT INTO nguoidung (HoTen, GioiTinh, Email, SoDienThoai, IDTaiKhoan) VALUES (?, ?, ?, ?, ?)";
            $stmtNguoiDung = $conn->prepare($sqlNguoiDung);
            if (!$stmtNguoiDung) {
                throw new Exception("Lỗi chuẩn bị câu lệnh thêm người dùng: " . $conn->error);
            }
            // Cập nhật bind_param: thêm idTaiKhoan
            $stmtNguoiDung->bind_param("ssssi", $hoTen, $gioiTinh, $email, $soDienThoai, $idTaiKhoan);
            if (!$stmtNguoiDung->execute()) {
                throw new Exception("Lỗi thực thi câu lệnh thêm người dùng: " . $stmtNguoiDung->error);
            }
            $maNguoiDung = $conn->insert_id;
            $stmtNguoiDung->close();

            // --- Bước 3: Không cần cập nhật nguoidung nữa --- 
            // Bỏ phần cập nhật IDTaiKhoan trong bảng nguoidung vì đã thêm ở Bước 2
            /*
            $sqlNguoiDungUpdate = "UPDATE nguoidung SET IDTaiKhoan = ? WHERE MaNguoiDung = ?";
            $stmtNguoiDungUpdate = $conn->prepare($sqlNguoiDungUpdate);
            if (!$stmtNguoiDungUpdate) {
                throw new Exception("Lỗi chuẩn bị câu lệnh cập nhật người dùng: " . $conn->error);
            }
            $stmtNguoiDungUpdate->bind_param("ii", $idTaiKhoan, $maNguoiDung);
            if (!$stmtNguoiDungUpdate->execute()) {
                throw new Exception("Lỗi thực thi câu lệnh cập nhật người dùng: " . $stmtNguoiDungUpdate->error);
            }
            $stmtNguoiDungUpdate->close();
            */

            // Commit transaction
            $conn->commit();
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Đăng ký thành công",
                "data" => [
                    "maNguoiDung" => $maNguoiDung,
                    "idTaiKhoan" => $idTaiKhoan
                ]
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

        // Kiểm tra nếu cập nhật tài khoản
        $updateAccount = isset($data['idTaiKhoan']) && !empty($data['idTaiKhoan']);
        if ($updateAccount) {
            $idTaiKhoan = $data['idTaiKhoan'];
            $tenDangNhapUpdate = isset($data['tenDangNhap']) ? trim($data['tenDangNhap']) : null;
            $updatePassword = isset($data['matKhau']) && !empty(trim($data['matKhau']));
            $idQuyenUpdate = isset($data['idQuyen']) ? $data['idQuyen'] : null;

            // Kiểm tra quyền hợp lệ nếu có cập nhật quyền
            if ($idQuyenUpdate !== null) {
                $validRoles = [1, 2, 3]; // Giả sử 1: Admin, 2: Nhân viên, 3: Khách hàng
                if (!in_array((int) $idQuyenUpdate, $validRoles)) {
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
            $checkUsernameSql = "SELECT * FROM taikhoan WHERE TaiKhoan = ? AND IDTaiKhoan != ?";
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
                    $sqlFields[] = "TaiKhoan = ?";
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
                    $sqlFields[] = "IDQuyen = ?";
                    $sqlParams[] = $idQuyenUpdate;
                    $sqlTypes .= "i";
                }

                if (!empty($sqlFields)) {
                    $sqlTaiKhoan = "UPDATE taikhoan SET " . implode(", ", $sqlFields) . " WHERE IDTaiKhoan = ?";
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

// Đóng kết nối nếu chưa đóng (trong trường hợp GET thành công)
if ($method === 'GET' && $conn) {
    $conn->close();
}

?>