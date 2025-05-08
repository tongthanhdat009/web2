<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Kết nối CSDL bằng MySQLi
$servername = "localhost";
$username = "root";
$password = "";
$database = "ql_cuahangdungcu";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Kết nối thất bại: " . $conn->connect_error]);
    exit();
}

// Câu truy vấn
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

// Thực thi truy vấn
$result = $conn->query($query);

// Kiểm tra kết quả
if ($result && $result->num_rows > 0) {
    $quyens = array();
    while ($row = $result->fetch_assoc()) {
        $quyen = array(
            "IDQuyen" => $row['IDQuyen'],
            "TenQuyen" => $row['TenQuyen'],
            "ChucNang" => array()
        );

        if ($row['ChucNang']) {
            $chucnangs = explode(';', $row['ChucNang']);
            foreach ($chucnangs as $cn) {
                list($id, $ten, $them, $xoa, $sua) = explode(':', $cn);
                $quyen['ChucNang'][] = array(
                    "IDChucNang" => $id,
                    "TenChucNang" => $ten,
                    "Them" => (bool)$them,
                    "Xoa" => (bool)$xoa,
                    "Sua" => (bool)$sua
                );
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
$conn->close();
?>
