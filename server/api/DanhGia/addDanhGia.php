<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Allow POST method for adding data
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL
$host = "localhost";
$dbname = "ql_cuahangdungcu";
$username = "root";
$password = ""; // Mật khẩu của bạn, nếu có

$conn = new mysqli($host, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Kết nối CSDL thất bại: " . $conn->connect_error, "details" => $conn->connect_error]);
    exit();
}

// Thiết lập charset cho kết nối
if (!$conn->set_charset("utf8mb4")) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi thiết lập charset: " . $conn->error, "details" => $conn->error]);
    $conn->close();
    exit();
}

// Chỉ chấp nhận phương thức POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "error" => "Phương thức không được phép. Chỉ chấp nhận POST."]);
    exit();
}

// Lấy dữ liệu JSON từ request body
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra dữ liệu đầu vào
if (
    !isset($data->IDTaiKhoan) ||
    !isset($data->MaHangHoa) ||
    !isset($data->SoSao) ||
    !isset($data->BinhLuan)
) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "Dữ liệu không hợp lệ. Thiếu các trường bắt buộc: IDTaiKhoan, MaHangHoa, SoSao, BinhLuan."]);
    exit();
}

// Gán giá trị từ dữ liệu đầu vào
$idTaiKhoan = $data->IDTaiKhoan;
$maHangHoa = $data->MaHangHoa;
$soSao = (int)$data->SoSao; // Đảm bảo SoSao là số nguyên
$binhLuan = trim($data->BinhLuan); // Loại bỏ khoảng trắng thừa
$trangThai = "Chưa duyệt"; // Mặc định trạng thái

// Kiểm tra SoSao hợp lệ (1-5)
if ($soSao < 1 || $soSao > 5) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Số sao không hợp lệ. Phải từ 1 đến 5."]);
    exit();
}

// Kiểm tra độ dài BinhLuan
if (mb_strlen($binhLuan, 'UTF-8') > 255) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Bình luận không được vượt quá 255 ký tự."]);
    exit();
}
if (empty($binhLuan)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Bình luận không được để trống."]);
    exit();
}


// Chuẩn bị câu lệnh SQL để chèn dữ liệu
// ThoiGian sẽ được tự động đặt là NOW() trong MySQL
$stmt = $conn->prepare("INSERT INTO DanhGia (IDTaiKhoan, MaHangHoa, SoSao, BinhLuan, ThoiGian, TrangThai) VALUES (?, ?, ?, ?, NOW(), ?)");

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Lỗi khi chuẩn bị câu lệnh SQL (prepare): " . $conn->error, "details" => $conn->error]);
    $conn->close();
    exit();
}

// Gán tham số và thực thi
$stmt->bind_param("isiss", $idTaiKhoan, $maHangHoa, $soSao, $binhLuan, $trangThai);

if ($stmt->execute()) {
    $insertedId = $stmt->insert_id; // Lấy ID của bản ghi vừa chèn

    // Lấy lại bản ghi vừa chèn để trả về cho client (bao gồm ThoiGian được tạo tự động)
    $resultStmt = $conn->prepare("SELECT IDDanhGia, IDTaiKhoan, MaHangHoa, SoSao, BinhLuan, DATE_FORMAT(ThoiGian, '%Y-%m-%d %H:%i:%s') as ThoiGian, TrangThai, (SELECT TaiKhoan FROM TaiKhoan WHERE IDTaiKhoan = dg.IDTaiKhoan) as TaiKhoan FROM DanhGia dg WHERE IDDanhGia = ?");
    if ($resultStmt) {
        $resultStmt->bind_param("i", $insertedId);
        $resultStmt->execute();
        $result = $resultStmt->get_result();
        $newReview = $result->fetch_assoc();
        $resultStmt->close();

        if ($newReview) {
            http_response_code(201); // Created
            echo json_encode(["success" => true, "message" => "Đánh giá đã được thêm thành công và đang chờ duyệt.", "data" => $newReview]);
        } else {
            // Trường hợp hiếm gặp: không lấy lại được bản ghi vừa chèn
            http_response_code(200); // Vẫn thành công nhưng không có data chi tiết
            echo json_encode(["success" => true, "message" => "Đánh giá đã được thêm thành công (ID: $insertedId) nhưng không thể lấy lại chi tiết."]);
        }
    } else {
        // Lỗi khi chuẩn bị câu lệnh lấy lại bản ghi
        http_response_code(200); // Vẫn thành công nhưng không có data chi tiết
        echo json_encode(["success" => true, "message" => "Đánh giá đã được thêm thành công (ID: $insertedId) nhưng có lỗi khi lấy lại chi tiết: " . $conn->error]);
    }

} else {
    http_response_code(500);
    // Kiểm tra lỗi cụ thể, ví dụ: duplicate entry, foreign key constraint
    if ($conn->errno == 1062) { // Duplicate entry
        echo json_encode(["success" => false, "error" => "Lỗi khi thêm đánh giá: Có thể bạn đã đánh giá sản phẩm này rồi.", "details" => $stmt->error]);
    } elseif ($conn->errno == 1452) { // Foreign key constraint fails
         echo json_encode(["success" => false, "error" => "Lỗi khi thêm đánh giá: ID Tài Khoản hoặc Mã Hàng Hóa không tồn tại.", "details" => $stmt->error]);
    }
    else {
        echo json_encode(["success" => false, "error" => "Lỗi khi thêm đánh giá: " . $stmt->error, "details" => $stmt->error]);
    }
}

// Đóng statement và kết nối
$stmt->close();
$conn->close();
?>