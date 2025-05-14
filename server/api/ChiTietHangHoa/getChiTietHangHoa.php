<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header('Content-Type: application/json; charset=utf-8'); // thêm dòng này để báo đây là JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
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

// Đọc MaHangHoa từ input
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['MaHangHoa'])) {
    http_response_code(400);
    echo json_encode(["error" => "Thiếu tham số MaHangHoa"]);
    exit();
}
$maHangHoa = intval($input['MaHangHoa']);

// Viết SQL
$sql = "
SELECT hh.*, ctpn.*, pn.*, klt.*, kq.*, kg.*, km.*
FROM hanghoa hh
JOIN chitietphieunhap ctpn ON ctpn.MaHangHoa = hh.MaHangHoa
JOIN phieunhap pn ON pn.MaPhieuNhap = ctpn.MaPhieuNhap
LEFT JOIN KhoiLuongTa klt ON ctpn.IDKhoiLuongTa = klt.IDKhoiLuongTa
LEFT JOIN KichThuocQuanAo kq ON ctpn.IDKichThuocQuanAo = kq.IDKichThuocQuanAo
LEFT JOIN KichThuocGiay kg ON ctpn.IDKichThuocGiay = kg.IDKichThuocGiay
LEFT JOIN khuyenmai km ON hh.MaKhuyenMai = km.MaKhuyenMai
WHERE hh.MaHangHoa = ?  AND hh.TrangThai = 1
  AND ctpn.SoLuongTon > 0 
  AND pn.TrangThai = 'Đã duyệt'
  AND pn.NgayNhap = (
    SELECT MIN(pn2.NgayNhap)
    FROM chitietphieunhap ctpn2
    JOIN phieunhap pn2 ON pn2.MaPhieuNhap = ctpn2.MaPhieuNhap
    WHERE ctpn2.MaHangHoa = ctpn.MaHangHoa
      AND (ctpn.IDKhoiLuongTa = ctpn2.IDKhoiLuongTa OR (ctpn.IDKhoiLuongTa IS NULL AND ctpn2.IDKhoiLuongTa IS NULL))
      AND (ctpn.IDKichThuocQuanAo = ctpn2.IDKichThuocQuanAo OR (ctpn.IDKichThuocQuanAo IS NULL AND ctpn2.IDKichThuocQuanAo IS NULL))
      AND (ctpn.IDKichThuocGiay = ctpn2.IDKichThuocGiay OR (ctpn.IDKichThuocGiay IS NULL AND ctpn2.IDKichThuocGiay IS NULL))
      AND ctpn2.SoLuongTon > 0
  )
";

// Chuẩn bị câu lệnh
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Lỗi prepare: " . $conn->error]);
    exit();
}

// Gán tham số
$stmt->bind_param('i', $maHangHoa);

// Thực thi
$stmt->execute();
$result = $stmt->get_result();

// Xử lý kết quả
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
if (empty($data)) {
    // Nếu không còn hàng, lấy thông tin cơ bản của sản phẩm
    $sql_hh = "
    SELECT hh.*, km.*
    FROM hanghoa hh
    LEFT JOIN khuyenmai km ON hh.MaKhuyenMai = km.MaKhuyenMai
    WHERE hh.MaHangHoa = ? 
    ";
    $stmt_hh = $conn->prepare($sql_hh);
    if ($stmt_hh) {
        $stmt_hh->bind_param('i', $maHangHoa);
        $stmt_hh->execute();
        $result_hh = $stmt_hh->get_result();
        if ($row_hh = $result_hh->fetch_assoc()) {
            $row_hh['TinhTrang'] = "Hết hàng"; // thêm trường tự gán
            $row_hh['SoLuongTon'] = 0;
            $data[] = $row_hh;
        }
        $stmt_hh->close();
    }
}


echo json_encode($data);

// Đóng kết nối
$stmt->close();
$conn->close();
?>
