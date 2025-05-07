<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/Database.php";

$database = new Database();
$conn = $database->getConnection();

if (!isset($_GET['IDTaiKhoan'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu IDTaiKhoan"]);
    exit();
}

$IDTaiKhoan = $_GET['IDTaiKhoan'];

$query = "
    SELECT q.*, chucnang.TenChucNang, pq.*
    FROM taikhoan tk 
    JOIN quyen q ON q.IDQuyen = tk.IDQuyen 
    JOIN phanquyen pq ON pq.IDQuyen = q.IDQuyen 
    JOIN chucnang ON pq.IDChucNang = chucnang.IDChucNang
    WHERE tk.IDTaiKhoan = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $IDTaiKhoan); // "i" là kiểu số nguyên (integer)
$stmt->execute();

$result = $stmt->get_result();

$chucNangList = [];

while ($row = $result->fetch_assoc()) {
    $chucNangList[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $chucNangList
]);
