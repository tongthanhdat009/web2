<?php
// Disable error display in output
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

require_once '../config/Database.php';

// Function to send JSON response
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Kết nối database
    $db = new Database();
    $conn = $db->connect();

    // Kiểm tra kết nối
    if ($conn->connect_error) {
        throw new Exception("Lỗi kết nối cơ sở dữ liệu: " . $conn->connect_error);
    }

    // Kiểm tra session và quyền
    session_start();
    if (!isset($_SESSION['IDTaiKhoan'])) {
        sendJsonResponse([
            "success" => false,
            "message" => "Vui lòng đăng nhập để tiếp tục",
            "code" => "NO_SESSION"
        ], 401);
    }

    // Hàm kiểm tra quyền của người dùng hiện tại
    function checkCurrentUserPermission($conn, $action) {
        $userId = $_SESSION['IDTaiKhoan'];
        
        // Lấy quyền của người dùng
        $sql = "SELECT q.IDQuyen, q.TenQuyen, pq.Them, pq.Sua, pq.Xoa 
                FROM taikhoan tk 
                JOIN quyen q ON tk.IDQuyen = q.IDQuyen 
                LEFT JOIN phanquyen pq ON q.IDQuyen = pq.IDQuyen AND pq.IDChucNang = 2
                WHERE tk.IDTaiKhoan = ?";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Lỗi chuẩn bị truy vấn: " . $conn->error);
        }
        
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $userRole = $result->fetch_assoc();

        // Nếu là Admin, cho phép tất cả
        if ($userRole && $userRole['TenQuyen'] === 'Admin') {
            return true;
        }

        // Kiểm tra quyền cụ thể
        if ($userRole) {
            switch ($action) {
                case 'Xem':
                    return true; // Mọi người đều có quyền xem
                case 'Them':
                    return (bool)$userRole['Them'];
                case 'Sua':
                    return (bool)$userRole['Sua'];
                case 'Xoa':
                    return (bool)$userRole['Xoa'];
                default:
                    return false;
            }
        }
        
        return false;
    }

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            // Kiểm tra quyền xem
            if (!checkCurrentUserPermission($conn, 'Xem')) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "NO_PERMISSION"
                ], 403);
            }

            // Get parameters
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
            $showSystem = isset($_GET['system']) ? filter_var($_GET['system'], FILTER_VALIDATE_BOOLEAN) : false;

            // Calculate offset
            $offset = ($page - 1) * $limit;

            // Build WHERE clause
            $whereClause = [];
            if (!empty($search)) {
                $whereClause[] = "q.TenQuyen LIKE '%$search%'";
            }
            if (!$showSystem) {
                $whereClause[] = "q.HeTHong != 1";
            }
            $where = !empty($whereClause) ? "WHERE " . implode(" AND ", $whereClause) : "";

            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM quyen q $where";
            $totalResult = $conn->query($countSql);
            $total = $totalResult->fetch_assoc()['total'];
            $totalPages = ceil($total / $limit);

            // Get roles with permissions
            $sql = "SELECT q.*, 
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'IDChucNang', c.IDChucNang,
                            'TenChucNang', c.TenChucNang,
                            'Them', IFNULL(pq.Them, 0),
                            'Sua', IFNULL(pq.Sua, 0),
                            'Xoa', IFNULL(pq.Xoa, 0)
                        )
                    ) as ChucNang
                    FROM quyen q
                    LEFT JOIN phanquyen pq ON q.IDQuyen = pq.IDQuyen
                    LEFT JOIN chucnang c ON pq.IDChucNang = c.IDChucNang
                    $where
                    GROUP BY q.IDQuyen
                    ORDER BY q.IDQuyen 
                    LIMIT ? OFFSET ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $limit, $offset);
            $stmt->execute();
            $result = $stmt->get_result();

            $roles = [];
            while ($row = $result->fetch_assoc()) {
                $chucNangJson = $row['ChucNang'];
                $row['ChucNang'] = $chucNangJson ? json_decode("[$chucNangJson]", true) : [];
                $roles[] = $row;
            }

            sendJsonResponse([
                "success" => true,
                "data" => $roles,
                "pagination" => [
                    "currentPage" => $page,
                    "totalPages" => $totalPages,
                    "totalRecords" => $total,
                    "limit" => $limit
                ]
            ]);
            break;

        case 'POST':
            // Kiểm tra quyền thêm
            if (!checkCurrentUserPermission($conn, 'Them')) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "NO_CREATE_PERMISSION"
                ], 403);
            }

            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validate dữ liệu
            if (empty($data['tenQuyen'])) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "EMPTY_NAME"
                ], 400);
            }

            // Kiểm tra tên quyền đã tồn tại
            $checkSql = "SELECT COUNT(*) as count FROM quyen WHERE TenQuyen = ?";
            $stmt = $conn->prepare($checkSql);
            $stmt->bind_param("s", $data['tenQuyen']);
            $stmt->execute();
            if ($stmt->get_result()->fetch_assoc()['count'] > 0) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "NAME_EXISTS"
                ], 400);
            }

            // Bắt đầu transaction
            $conn->begin_transaction();

            try {
                // Thêm quyền mới
                $sql = "INSERT INTO quyen (TenQuyen, MoTa, TrangThai, HeTHong) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssii", 
                    $data['tenQuyen'],
                    $data['moTa'],
                    $data['trangThai'],
                    $data['heThong']
                );
                $stmt->execute();
                $newRoleId = $conn->insert_id;

                // Xử lý phân quyền
                if (!empty($data['phanQuyen'])) {
                    $sql = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Sua, Xoa) VALUES (?, ?, ?, ?, ?)";
                    $stmt = $conn->prepare($sql);
                    
                    foreach ($data['phanQuyen'] as $phanQuyen) {
                        $stmt->bind_param("iiiii",
                            $newRoleId,
                            $phanQuyen['IDChucNang'],
                            $phanQuyen['Them'],
                            $phanQuyen['Sua'],
                            $phanQuyen['Xoa']
                        );
                        $stmt->execute();
                    }
                }

                $conn->commit();
                sendJsonResponse([
                    "success" => true,
                    "data" => ["IDQuyen" => $newRoleId]
                ]);

            } catch (Exception $e) {
                $conn->rollback();
                throw $e;
            }
            break;

        case 'PUT':
            // Kiểm tra quyền sửa
            if (!checkCurrentUserPermission($conn, 'Sua')) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "NO_UPDATE_PERMISSION"
                ], 403);
            }

            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validate dữ liệu
            if (!isset($data['idQuyen'])) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "INVALID_ID"
                ], 400);
            }

            // Kiểm tra quyền hệ thống
            $checkSystemSql = "SELECT HeTHong FROM quyen WHERE IDQuyen = ?";
            $stmt = $conn->prepare($checkSystemSql);
            $stmt->bind_param("i", $data['idQuyen']);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->fetch_assoc()['HeTHong'] == 1) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "SYSTEM_ROLE"
                ], 400);
            }

            // Kiểm tra tên quyền trùng
            if (!empty($data['tenQuyen'])) {
                $checkSql = "SELECT COUNT(*) as count FROM quyen WHERE TenQuyen = ? AND IDQuyen != ?";
                $stmt = $conn->prepare($checkSql);
                $stmt->bind_param("si", $data['tenQuyen'], $data['idQuyen']);
                $stmt->execute();
                if ($stmt->get_result()->fetch_assoc()['count'] > 0) {
                    sendJsonResponse([
                        "success" => false,
                        "code" => "NAME_EXISTS"
                    ], 400);
                }
            }

            // Bắt đầu transaction
            $conn->begin_transaction();

            try {
                // Cập nhật thông tin quyền
                $sql = "UPDATE quyen SET TenQuyen = ?, MoTa = ?, TrangThai = ?, HeTHong = ? WHERE IDQuyen = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssiii", 
                    $data['tenQuyen'],
                    $data['moTa'],
                    $data['trangThai'],
                    $data['heThong'],
                    $data['idQuyen']
                );
                $stmt->execute();

                // Xóa phân quyền cũ
                $sql = "DELETE FROM phanquyen WHERE IDQuyen = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $data['idQuyen']);
                $stmt->execute();

                // Thêm phân quyền mới
                if (!empty($data['phanQuyen'])) {
                    $sql = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Sua, Xoa) VALUES (?, ?, ?, ?, ?)";
                    $stmt = $conn->prepare($sql);
                    
                    foreach ($data['phanQuyen'] as $phanQuyen) {
                        $stmt->bind_param("iiiii",
                            $data['idQuyen'],
                            $phanQuyen['IDChucNang'],
                            $phanQuyen['Them'],
                            $phanQuyen['Sua'],
                            $phanQuyen['Xoa']
                        );
                        $stmt->execute();
                    }
                }

                $conn->commit();
                sendJsonResponse([
                    "success" => true
                ]);

            } catch (Exception $e) {
                $conn->rollback();
                throw $e;
            }
            break;

        case 'DELETE':
            // Kiểm tra quyền xóa
            if (!checkCurrentUserPermission($conn, 'Xoa')) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "NO_DELETE_PERMISSION"
                ], 403);
            }

            $idQuyen = isset($_GET['IDQuyen']) ? (int)$_GET['IDQuyen'] : null;
            if (!$idQuyen) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "INVALID_ID"
                ], 400);
            }

            // Kiểm tra quyền hệ thống
            $checkSystemSql = "SELECT HeTHong FROM quyen WHERE IDQuyen = ?";
            $stmt = $conn->prepare($checkSystemSql);
            $stmt->bind_param("i", $idQuyen);
            $stmt->execute();
            $result = $stmt->get_result();
            $role = $result->fetch_assoc();

            if (!$role) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "ROLE_NOT_FOUND"
                ], 404);
            }

            if ($role['HeTHong'] == 1) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "SYSTEM_ROLE"
                ], 400);
            }

            // Kiểm tra quyền đang được sử dụng
            $checkUsageSql = "SELECT COUNT(*) as count FROM taikhoan WHERE IDQuyen = ?";
            $stmt = $conn->prepare($checkUsageSql);
            $stmt->bind_param("i", $idQuyen);
            $stmt->execute();
            if ($stmt->get_result()->fetch_assoc()['count'] > 0) {
                sendJsonResponse([
                    "success" => false,
                    "code" => "ROLE_IN_USE"
                ], 400);
            }

            // Bắt đầu transaction
            $conn->begin_transaction();

            try {
                // Xóa phân quyền
                $sql = "DELETE FROM phanquyen WHERE IDQuyen = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $idQuyen);
                $stmt->execute();

                // Xóa quyền
                $sql = "DELETE FROM quyen WHERE IDQuyen = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $idQuyen);
                $stmt->execute();

                $conn->commit();
                sendJsonResponse([
                    "success" => true
                ]);

            } catch (Exception $e) {
                $conn->rollback();
                throw $e;
            }
            break;

        default:
            sendJsonResponse([
                "success" => false,
                "code" => "METHOD_NOT_ALLOWED"
            ], 405);
    }
} catch (Exception $e) {
    // Log error to file instead of displaying it
    error_log($e->getMessage());
    
    sendJsonResponse([
        "success" => false,
        "message" => "Lỗi server: " . $e->getMessage(),
        "code" => "SERVER_ERROR"
    ], 500);
}

$conn->close();