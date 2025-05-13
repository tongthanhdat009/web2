<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Added OPTIONS for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true"); // Allow credentials

include_once '../../config/Database.php';

$database = new Database();
$db = $database->getConnection(); // Giả định là trả về MySQLi

// Kiểm tra kết nối
if ($db->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Kết nối thất bại: " . $db->connect_error]);
    exit();
}

// Truy vấn dữ liệu
$query = "
SELECT q.IDQuyen, q.TenQuyen, GROUP_CONCAT(
    CONCAT(cn.IDChucNang, ':', cn.TenChucNang, ':',
    COALESCE(pq.Them, 0), ':',
    COALESCE(pq.Xoa, 0), ':',
    COALESCE(pq.Sua, 0))
    SEPARATOR ';') AS ChucNang
FROM quyen q
LEFT JOIN phanquyen pq ON q.IDQuyen = pq.IDQuyen
LEFT JOIN chucnang cn ON pq.IDChucNang = cn.IDChucNang
GROUP BY q.IDQuyen, q.TenQuyen
";

$result = $db->query($query);

// Kiểm tra kết quả truy vấn
if ($result && $result->num_rows > 0) {
    $quyens = array();
    while ($row = $result->fetch_assoc()) {
        $quyen = array(
            "IDQuyen" => (int)$row['IDQuyen'],
            "TenQuyen" => $row['TenQuyen'],
            "ChucNang" => array()
        );

        if (!empty($row['ChucNang'])) {
            $chucnangs = explode(';', $row['ChucNang']);
            foreach ($chucnangs as $cn) {
                $parts = explode(':', $cn);
                if (count($parts) === 5) {
                    list($id, $ten, $them, $xoa, $sua) = $parts;
                    $quyen['ChucNang'][] = array(
                        "IDChucNang" => (int)$id,
                        "TenChucNang" => $ten,
                        "Them" => (bool)$them,
                        "Xoa" => (bool)$xoa,
                        "Sua" => (bool)$sua
                    );
                }
            }
        }

        $quyens[] = $quyen;
    }

    http_response_code(200);
    echo json_encode($quyens);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Không tìm thấy quyền nào."));
}

// Đóng kết nối
$db->close();
?>
