<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ql_cuahangdungcu";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối thất bại: " . $conn->connect_error]);
    exit();
}

// Nhận dữ liệu từ client (POST dạng JSON)
$data = json_decode(file_get_contents("php://input"), true);
$IDChiTietPhieuNhap = $data['IDChiTietPhieuNhap'] ?? null;
$SoLuong = $data['SoLuong'] ?? null;

if ($IDChiTietPhieuNhap === null || $SoLuong === null) {
    echo json_encode(["success" => false, "message" => "Thiếu tham số IDChiTietPhieuNhap hoặc SoLuong"]);
    $conn->close();
    exit();
}

// 1. Lấy danh sách Seri
$sql = "SELECT Seri FROM khohang WHERE IDChiTietPhieuNhap = ? AND TinhTrang = 'Chưa bán' LIMIT ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $IDChiTietPhieuNhap, $SoLuong);
$stmt->execute();
$result = $stmt->get_result();

$seriArr = [];
while ($row = $result->fetch_assoc()) {
    $seriArr[] = $row['Seri'];
}
$stmt->close();

if (count($seriArr) === 0) {
    echo json_encode(["success" => false, "message" => "Không tìm thấy Seri phù hợp"]);
    $conn->close();
    exit();
}

// 2. Cập nhật lại trạng thái TinhTrang = 'Chờ duyệt đơn' cho các Seri vừa lấy
$seriPlaceholders = implode(',', array_fill(0, count($seriArr), '?'));
$types = str_repeat('s', count($seriArr));
$sqlUpdate = "UPDATE khohang SET TinhTrang = 'Chờ duyệt đơn' WHERE Seri IN ($seriPlaceholders)";
$stmtUpdate = $conn->prepare($sqlUpdate);
$stmtUpdate->bind_param($types, ...$seriArr);

$updateSuccess = $stmtUpdate->execute();
$stmtUpdate->close();

// 3. Cập nhật lại SoLuongTon trong chitietphieunhap
$sqlUpdateSL = "UPDATE chitietphieunhap SET SoLuongTon = SoLuongTon - ? WHERE IDChiTietPhieuNhap = ?";
$stmtSL = $conn->prepare($sqlUpdateSL);
$stmtSL->bind_param("ii", $SoLuong, $IDChiTietPhieuNhap);

$updateSLSuccess = $stmtSL->execute();
$stmtSL->close();

if ($updateSuccess && $updateSLSuccess) {
    echo json_encode([
        "success" => true,
        "seri" => $seriArr,
        "message" => "Đã cập nhật trạng thái Seri và số lượng tồn"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi cập nhật dữ liệu kho hoặc số lượng tồn"
    ]);
}

$conn->close();
?>