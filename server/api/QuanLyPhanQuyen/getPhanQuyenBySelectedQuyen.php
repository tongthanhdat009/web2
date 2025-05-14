<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
include_once '../../config/Database.php';

// Decode the JSON input
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Chỉ chấp nhận phương thức GET"]);
    exit();
}

if (!isset($_GET['IDQuyen'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu tham số 'maQuyen'"]);
    exit();
}

$maQuyen = $_GET['IDQuyen'];

$database = new Database();
$conn = $database->getConnection();

// SQL query to fetch data
$query = "SELECT 
            q.IDQuyen, q.TenQuyen, 
            cn.IDChucNang, cn.TenChucNang,
            pq.Them, pq.Xoa, pq.Sua
          FROM phanquyen pq
          JOIN quyen q ON pq.IDQuyen = q.IDQuyen
          JOIN chucnang cn ON cn.IDChucNang = pq.IDChucNang
          WHERE q.IDQuyen = ?";
$stmt = $conn->prepare($query);

// Bind the parameter
$stmt->bind_param("s", $maQuyen);

if ($stmt->execute()) {
    // Fetch the result
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $phanQuyens = array();

        while ($row = $result->fetch_assoc()) {
            $phanQuyens[] = array(
                "IDQuyen" => $row['IDQuyen'],
                "TenQuyen" => $row['TenQuyen'],
                "ChucNang" => array(
                    "IDChucNang" => $row['IDChucNang'],
                    "TenChucNang" => $row['TenChucNang'],
                    "Them" => (bool)$row['Them'],
                    "Xoa" => (bool)$row['Xoa'],
                    "Sua" => (bool)$row['Sua']
                )
            );
        }

        http_response_code(200);
        echo json_encode($phanQuyens);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Không tìm thấy phân quyền nào."));
    }
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi khi thực hiện truy vấn."));
}

$stmt->close();
$conn->close();
?>