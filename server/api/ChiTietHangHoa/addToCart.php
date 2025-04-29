<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$host = "localhost";
$dbname = "ql_cuahangdungcu";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Lấy dữ liệu từ JSON
$payload = json_decode(file_get_contents("php://input"), true);
$IDTaiKhoan        = $payload["IDTaiKhoan"]        ?? null;
$MaHangHoa         = $payload["MaHangHoa"]         ?? null;
$SoLuong           = $payload["SoLuong"]           ?? null;
$IDKhoiLuongTa     = $payload["IDKhoiLuongTa"]     ?? 0;
$IDKichThuocQuanAo = $payload["IDKichThuocQuanAo"] ?? 0;
$IDKichThuocGiay   = $payload["IDKichThuocGiay"]   ?? 0;

// Kiểm tra dữ liệu bắt buộc
if ($IDTaiKhoan === null || $MaHangHoa === null || $SoLuong === null) {
    http_response_code(400);
    echo json_encode(["error" => "Thiếu IDTaiKhoan, MaHangHoa hoặc SoLuong"]);
    exit();
}

// Ép kiểu để an toàn
$vTaiKhoan  = (int)$IDTaiKhoan;
$vHangHoa   = (int)$MaHangHoa;
$vSoLuong   = (int)$SoLuong;
$vKhoiLuong = (int)$IDKhoiLuongTa;
$vKTQuanAo  = (int)$IDKichThuocQuanAo;
$vKTGiay    = (int)$IDKichThuocGiay;

// Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
$sqlCheck = "
    SELECT 1 FROM giohang
    WHERE IDTaiKhoan = ? AND MaHangHoa = ? AND IDKhoiLuongTa = ? 
      AND IDKichThuocQuanAo = ? AND IDKichThuocGiay = ?
";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("iiiii", $vTaiKhoan, $vHangHoa, $vKhoiLuong, $vKTQuanAo, $vKTGiay);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "error"   => "Sản phẩm này đã có trong giỏ hàng"
    ]);
    $stmtCheck->close();
    $conn->close();
    exit();
}
$stmtCheck->close();

// Thêm vào giỏ hàng
$sqlInsert = "
    INSERT INTO giohang (IDTaiKhoan, MaHangHoa, SoLuong, IDKhoiLuongTa, IDKichThuocQuanAo, IDKichThuocGiay)
    VALUES (?, ?, ?, ?, ?, ?)
";
$stmtInsert = $conn->prepare($sqlInsert);
if (!$stmtInsert) {
    echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
    $conn->close();
    exit();
}

$stmtInsert->bind_param("iiiiii", $vTaiKhoan, $vHangHoa, $vSoLuong, $vKhoiLuong, $vKTQuanAo, $vKTGiay);
if ($stmtInsert->execute()) {
    echo json_encode(["success" => true, "message" => "Đã thêm vào giỏ hàng"]);
} else {
    echo json_encode(["success" => false, "error" => $stmtInsert->error]);
}

$stmtInsert->close();
$conn->close();
?>
