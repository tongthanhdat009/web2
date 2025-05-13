<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$db = $database->getConnection();

// Assuming the table name is 'chucnang' and columns are 'IDChucNang', 'TenChucNang'
$query = "SELECT IDChucNang, TenChucNang FROM chucnang ORDER BY TenChucNang ASC";

$stmt = $db->prepare($query);

try {
    $stmt->execute();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $chucNangArr = array();
        $chucNangArr["data"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $chucNangItem = array(
                "IDChucNang" => $IDChucNang,
                "TenChucNang" => $TenChucNang
            );
            array_push($chucNangArr["data"], $chucNangItem);
        }

        http_response_code(200);
        echo json_encode($chucNangArr);
    } else {
        http_response_code(200); // Or 404 if preferred when no data found
        echo json_encode(
            array("data" => [], "message" => "Không tìm thấy chức năng nào.")
        );
    }
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode(
        array("message" => "Lỗi khi truy vấn dữ liệu chức năng: " . $exception->getMessage())
    );
}

?>
