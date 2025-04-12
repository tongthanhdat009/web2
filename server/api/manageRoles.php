<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý các yêu cầu OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

require_once "../config/Database.php";
require_once "auth/checkSession.php"; // Giả định đã có file xác thực phiên

$database = new Database();
$conn = $database->getConnection();

// Tăng giới hạn độ dài GROUP_CONCAT
$conn->query("SET SESSION group_concat_max_len = 1000000");

// Kiểm tra quyền của người dùng hiện tại
function checkCurrentUserPermission($conn, $requiredPermission) {
    // Giả định thông tin người dùng hiện tại được lưu trong session
    if (!isset($_SESSION['user_id'])) {
        return false;
    }
    
    $userId = $_SESSION['user_id'];
    $sql = "SELECT q.TenQuyen FROM taikhoan tk 
            JOIN quyen q ON tk.IDQuyen = q.IDQuyen 
            WHERE tk.IDTaiKhoan = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    // Admin có tất cả quyền
    if ($result && $result['TenQuyen'] === 'Admin') {
        return true;
    }
    
    // Kiểm tra quyền cụ thể (them, xoa, sua)
    $sql = "SELECT pq.$requiredPermission FROM taikhoan tk 
            JOIN phanquyen pq ON tk.IDQuyen = pq.IDQuyen 
            JOIN chucnang cn ON pq.IDChucNang = cn.IDChucNang
            WHERE tk.IDTaiKhoan = ? AND cn.MaChucNang = 'ROLE_MANAGEMENT'";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    return $result && $result[$requiredPermission] == 1;
}

// Ghi nhật ký hoạt động
function logActivity($conn, $userId, $action, $details) {
    $sql = "INSERT INTO nhat_ky_hoat_dong (IDTaiKhoan, HanhDong, ChiTiet, ThoiGian) VALUES (?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iss", $userId, $action, $details);
    $stmt->execute();
}

$method = $_SERVER['REQUEST_METHOD'];
$userId = $_SESSION['user_id'] ?? 0; // ID người dùng hiện tại

try {
    switch ($method) {
        case 'GET':
            // Lấy danh sách vai trò và quyền hạn chi tiết
            // Thêm phân trang và tìm kiếm
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $offset = ($page - 1) * $limit;
            $search = isset($_GET['search']) ? "%" . $_GET['search'] . "%" : "%";
            $includeSystemRoles = isset($_GET['system']) && $_GET['system'] === "true";
            
            // Lấy tổng số quyền để phân trang
            $countSql = "SELECT COUNT(*) as total FROM quyen WHERE TenQuyen LIKE ?";
            if (!$includeSystemRoles) {
                $countSql .= " AND HeTHong = 0";
            }
            
            $stmt = $conn->prepare($countSql);
            $stmt->bind_param("s", $search);
            $stmt->execute();
            $totalResult = $stmt->get_result()->fetch_assoc();
            $total = $totalResult['total'];
            
            // Câu truy vấn chính có phân trang và tìm kiếm
            $sql = "SELECT q.IDQuyen, q.TenQuyen, q.HeTHong, q.TrangThai, q.MoTa, q.NgayTao,
                    (SELECT COUNT(*) FROM taikhoan WHERE IDQuyen = q.IDQuyen) as SoLuongTaiKhoan,
                    GROUP_CONCAT(DISTINCT CONCAT(cn.IDChucNang, ':', cn.TenChucNang, ':', cn.MaChucNang, ':', cn.NhomChucNang)) as ChucNang,
                    GROUP_CONCAT(DISTINCT CONCAT(pq.IDChucNang, ':', COALESCE(pq.Them, 0), ':', COALESCE(pq.Xoa, 0), ':', COALESCE(pq.Sua, 0))) as PhanQuyen
                    FROM quyen q
                    LEFT JOIN phanquyen pq ON q.IDQuyen = pq.IDQuyen 
                    LEFT JOIN chucnang cn ON pq.IDChucNang = cn.IDChucNang
                    WHERE q.TenQuyen LIKE ?";
            
            if (!$includeSystemRoles) {
                $sql .= " AND q.HeTHong = 0";
            }
            
            $sql .= " GROUP BY q.IDQuyen ORDER BY q.NgayTao DESC LIMIT ? OFFSET ?";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sii", $search, $limit, $offset);
            $stmt->execute();
            $result = $stmt->get_result();
            $roles = array();
            
            while($row = $result->fetch_assoc()) {
                $role = array(
                    'IDQuyen' => $row['IDQuyen'],
                    'TenQuyen' => $row['TenQuyen'],
                    'HeTHong' => (bool)$row['HeTHong'],
                    'TrangThai' => (bool)$row['TrangThai'],
                    'MoTa' => $row['MoTa'],
                    'NgayTao' => $row['NgayTao'],
                    'SoLuongTaiKhoan' => $row['SoLuongTaiKhoan'],
                    'ChucNang' => array()
                );
                
                if($row['ChucNang']) {
                    $chucNangArray = explode(',', $row['ChucNang']);
                    $phanQuyenArray = explode(',', $row['PhanQuyen']);
                    
                    $chucNangGrouped = []; // Nhóm chức năng theo nhóm
                    
                    foreach($chucNangArray as $index => $cn) {
                        $cnParts = explode(':', $cn);
                        if (count($cnParts) >= 4) {
                            $idChucNang = $cnParts[0];
                            $tenChucNang = $cnParts[1];
                            $maChucNang = $cnParts[2];
                            $nhomChucNang = $cnParts[3];
                            
                            $pqParts = explode(':', $phanQuyenArray[$index] ?? '');
                            
                            $chucNangData = array(
                                'IDChucNang' => $idChucNang,
                                'TenChucNang' => $tenChucNang,
                                'MaChucNang' => $maChucNang,
                                'Them' => isset($pqParts[1]) ? (int)$pqParts[1] : 0,
                                'Xoa' => isset($pqParts[2]) ? (int)$pqParts[2] : 0, 
                                'Sua' => isset($pqParts[3]) ? (int)$pqParts[3] : 0
                            );
                            
                            // Nhóm chức năng theo nhóm
                            if (!isset($chucNangGrouped[$nhomChucNang])) {
                                $chucNangGrouped[$nhomChucNang] = [];
                            }
                            $chucNangGrouped[$nhomChucNang][] = $chucNangData;
                        }
                    }
                    
                    // Chuyển đổi nhóm thành mảng cho JSON
                    foreach ($chucNangGrouped as $nhom => $danhSachChucNang) {
                        $role['ChucNang'][] = [
                            'TenNhom' => $nhom,
                            'DanhSachChucNang' => $danhSachChucNang
                        ];
                    }
                }
                
                $roles[] = $role;
            }
            
            echo json_encode([
                'success' => true,
                'data' => $roles,
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'limit' => $limit,
                    'totalPages' => ceil($total / $limit)
                ]
            ]);
            break;

        case 'POST':
            // Kiểm tra quyền thêm
            if (!checkCurrentUserPermission($conn, 'Them')) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Bạn không có quyền thực hiện thao tác này.",
                    "code" => "NO_PERMISSION"
                ]);
                exit;
            }
            
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validate dữ liệu đầu vào
            if (empty($data['tenQuyen'])) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Tên quyền không được để trống.",
                    "code" => "EMPTY_NAME"
                ]);
                exit;
            }
            
            $tenQuyen = trim($data['tenQuyen']);
            $moTa = trim($data['moTa'] ?? '');
            $phanQuyen = $data['phanQuyen'] ?? array();
            $copyFromId = $data['copyFromId'] ?? null; // ID quyền để sao chép
            
            // Kiểm tra tên quyền tồn tại (case-insensitive)
            $checkRoleSql = "SELECT * FROM quyen WHERE LOWER(TenQuyen) = LOWER(?)";
            $stmt = $conn->prepare($checkRoleSql);
            $stmt->bind_param("s", $tenQuyen);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Tên quyền đã tồn tại.",
                    "code" => "NAME_EXISTS"
                ]);
                exit;
            }

            // Bắt đầu transaction
            $conn->begin_transaction();
            try {
                // Thêm quyền mới
                $insertRoleSql = "INSERT INTO quyen (TenQuyen, MoTa, HeTHong, TrangThai, NgayTao) VALUES (?, ?, 0, 1, NOW())";
                $stmt = $conn->prepare($insertRoleSql);
                $stmt->bind_param("ss", $tenQuyen, $moTa);
                $stmt->execute();
                $idQuyen = $conn->insert_id;
                
                // Sao chép quyền từ một quyền có sẵn
                if ($copyFromId) {
                    $copyPermSql = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Xoa, Sua) 
                                    SELECT ?, IDChucNang, Them, Xoa, Sua FROM phanquyen WHERE IDQuyen = ?";
                    $stmt = $conn->prepare($copyPermSql);
                    $stmt->bind_param("ii", $idQuyen, $copyFromId);
                    $stmt->execute();
                }
                // Hoặc thêm phân quyền chi tiết từ form
                else if (!empty($phanQuyen)) {
                    $insertPermSql = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Xoa, Sua) VALUES (?, ?, ?, ?, ?)";
                    $stmt = $conn->prepare($insertPermSql);
                    
                    foreach ($phanQuyen as $pq) {
                        $idChucNang = $pq['idChucNang'];
                        $them = $pq['them'] ?? 0;
                        $xoa = $pq['xoa'] ?? 0;
                        $sua = $pq['sua'] ?? 0;
                        
                        $stmt->bind_param("iiiii", $idQuyen, $idChucNang, $them, $xoa, $sua);
                        $stmt->execute();
                    }
                }

                // Ghi log
                logActivity($conn, $userId, 'CREATE_ROLE', "Tạo quyền mới: {$tenQuyen} (ID: {$idQuyen})");

                $conn->commit();
                echo json_encode([
                    "success" => true, 
                    "message" => "Thêm quyền thành công",
                    "data" => ["idQuyen" => $idQuyen]
                ]);
            } catch (Exception $e) {
                $conn->rollback();
                error_log($e->getMessage());
                echo json_encode([
                    "success" => false, 
                    "message" => "Lỗi hệ thống: " . $e->getMessage(),
                    "code" => "SYSTEM_ERROR"
                ]);
            }
            break;

        case 'PUT':
            // Kiểm tra quyền sửa
            if (!checkCurrentUserPermission($conn, 'Sua')) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Bạn không có quyền thực hiện thao tác này.",
                    "code" => "NO_PERMISSION"
                ]);
                exit;
            }
            
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validate dữ liệu đầu vào
            if (empty($data['idQuyen'])) {
                echo json_encode([
                    "success" => false, 
                    "message" => "ID quyền không hợp lệ.",
                    "code" => "INVALID_ID"
                ]);
                exit;
            }
            
            if (empty($data['tenQuyen'])) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Tên quyền không được để trống.",
                    "code" => "EMPTY_NAME"
                ]);
                exit;
            }
            
            $idQuyen = $data['idQuyen'];
            $tenQuyen = trim($data['tenQuyen']);
            $moTa = trim($data['moTa'] ?? '');
            $trangThai = isset($data['trangThai']) ? (int)$data['trangThai'] : 1;
            $phanQuyen = $data['phanQuyen'] ?? array();

            // Kiểm tra quyền hệ thống
            $checkSystemSql = "SELECT HeTHong FROM quyen WHERE IDQuyen = ?";
            $stmt = $conn->prepare($checkSystemSql);
            $stmt->bind_param("i", $idQuyen);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            if (!$result) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Không tìm thấy quyền.",
                    "code" => "NOT_FOUND"
                ]);
                exit;
            }
            
            if ($result['HeTHong'] == 1) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Không thể sửa quyền hệ thống.",
                    "code" => "SYSTEM_ROLE"
                ]);
                exit;
            }

            // Kiểm tra tên quyền tồn tại (case-insensitive)
            $checkRoleSql = "SELECT * FROM quyen WHERE LOWER(TenQuyen) = LOWER(?) AND IDQuyen != ?";
            $stmt = $conn->prepare($checkRoleSql);
            $stmt->bind_param("si", $tenQuyen, $idQuyen);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Tên quyền đã tồn tại.",
                    "code" => "NAME_EXISTS"
                ]);
                exit;
            }

            // Bắt đầu transaction
            $conn->begin_transaction();
            try {
                // Cập nhật tên quyền
                $updateRoleSql = "UPDATE quyen SET TenQuyen = ?, MoTa = ?, TrangThai = ? WHERE IDQuyen = ?";
                $stmt = $conn->prepare($updateRoleSql);
                $stmt->bind_param("ssii", $tenQuyen, $moTa, $trangThai, $idQuyen);
                $stmt->execute();

                // Xóa phân quyền cũ
                $deletePermSql = "DELETE FROM phanquyen WHERE IDQuyen = ?";
                $stmt = $conn->prepare($deletePermSql);
                $stmt->bind_param("i", $idQuyen);
                $stmt->execute();

                // Thêm phân quyền mới
                if (!empty($phanQuyen)) {
                    $insertPermSql = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Xoa, Sua) VALUES (?, ?, ?, ?, ?)";
                    $stmt = $conn->prepare($insertPermSql);
                    
                    foreach ($phanQuyen as $pq) {
                        $idChucNang = $pq['idChucNang'];
                        $them = $pq['them'] ?? 0;
                        $xoa = $pq['xoa'] ?? 0;
                        $sua = $pq['sua'] ?? 0;
                        
                        $stmt->bind_param("iiiii", $idQuyen, $idChucNang, $them, $xoa, $sua);
                        $stmt->execute();
                    }
                }
                
                // Ghi log
                logActivity($conn, $userId, 'UPDATE_ROLE', "Cập nhật quyền: {$tenQuyen} (ID: {$idQuyen})");

                $conn->commit();
                echo json_encode([
                    "success" => true, 
                    "message" => "Cập nhật quyền thành công"
                ]);
            } catch (Exception $e) {
                $conn->rollback();
                error_log($e->getMessage());
                echo json_encode([
                    "success" => false, 
                    "message" => "Lỗi hệ thống: " . $e->getMessage(),
                    "code" => "SYSTEM_ERROR"
                ]);
            }
            break;

        case 'DELETE':
            // Kiểm tra quyền xóa
            if (!checkCurrentUserPermission($conn, 'Xoa')) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Bạn không có quyền thực hiện thao tác này.",
                    "code" => "NO_PERMISSION"
                ]);
                exit;
            }
            
            $idQuyen = $_GET['IDQuyen'] ?? 0;
            
            if (!$idQuyen) {
                echo json_encode([
                    "success" => false, 
                    "message" => "ID quyền không hợp lệ.",
                    "code" => "INVALID_ID"
                ]);
                exit;
            }

            // Kiểm tra quyền hệ thống
            $checkSystemSql = "SELECT HeTHong, TenQuyen FROM quyen WHERE IDQuyen = ?";
            $stmt = $conn->prepare($checkSystemSql);
            $stmt->bind_param("i", $idQuyen);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            if (!$result) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Không tìm thấy quyền.",
                    "code" => "NOT_FOUND"
                ]);
                exit;
            }
            
            if ($result['HeTHong'] == 1) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Không thể xóa quyền hệ thống.",
                    "code" => "SYSTEM_ROLE"
                ]);
                exit;
            }
            
            $tenQuyen = $result['TenQuyen'];

            // Kiểm tra tài khoản đang sử dụng quyền
            $checkAccountSql = "SELECT COUNT(*) as count FROM taikhoan WHERE IDQuyen = ?";
            $stmt = $conn->prepare($checkAccountSql);
            $stmt->bind_param("i", $idQuyen);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            if ($result['count'] > 0) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Không thể xóa quyền đang được sử dụng bởi {$result['count']} tài khoản.",
                    "code" => "ROLE_IN_USE"
                ]);
                exit;
            }

            // Bắt đầu transaction
            $conn->begin_transaction();
            try {
                // Xóa phân quyền
                $deletePermSql = "DELETE FROM phanquyen WHERE IDQuyen = ?";
                $stmt = $conn->prepare($deletePermSql);
                $stmt->bind_param("i", $idQuyen);
                $stmt->execute();

                // Xóa quyền
                $deleteRoleSql = "DELETE FROM quyen WHERE IDQuyen = ?";
                $stmt = $conn->prepare($deleteRoleSql);
                $stmt->bind_param("i", $idQuyen);
                $stmt->execute();
                
                // Ghi log
                logActivity($conn, $userId, 'DELETE_ROLE', "Xóa quyền: {$tenQuyen} (ID: {$idQuyen})");

                $conn->commit();
                echo json_encode([
                    "success" => true, 
                    "message" => "Xóa quyền thành công"
                ]);
            } catch (Exception $e) {
                $conn->rollback();
                error_log($e->getMessage());
                echo json_encode([
                    "success" => false, 
                    "message" => "Lỗi hệ thống: " . $e->getMessage(),
                    "code" => "SYSTEM_ERROR"
                ]);
            }
            break;
            
        default:
            echo json_encode([
                "success" => false, 
                "message" => "Phương thức không được hỗ trợ.",
                "code" => "METHOD_NOT_SUPPORTED"
            ]);
            break;
    }
} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Lỗi hệ thống: " . $e->getMessage(),
        "code" => "SYSTEM_ERROR"
    ]);
}
?>