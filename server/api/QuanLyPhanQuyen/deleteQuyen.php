<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->IDQuyen)) {
    try {
        $conn->beginTransaction();
        
        // Kiểm tra xem có tài khoản nào đang sử dụng quyền này không
        $queryCheck = "SELECT COUNT(*) as count FROM taikhoan WHERE IDQuyen = :IDQuyen";
        $stmt = $conn->prepare($queryCheck);
        $stmt->bindParam(":IDQuyen", $data->IDQuyen);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row['count'] > 0) {
            throw new Exception("Không thể xóa quyền đang được sử dụng bởi tài khoản.");
        }
        
        // Xóa các phân quyền liên quan
        $queryDeletePhanQuyen = "DELETE FROM phanquyen WHERE IDQuyen = :IDQuyen";
        $stmt = $conn->prepare($queryDeletePhanQuyen);
        $stmt->bindParam(":IDQuyen", $data->IDQuyen);
        $stmt->execute();
        
        // Xóa quyền
        $queryDeleteQuyen = "DELETE FROM quyen WHERE IDQuyen = :IDQuyen";
        $stmt = $conn->prepare($queryDeleteQuyen);
        $stmt->bindParam(":IDQuyen", $data->IDQuyen);
        $stmt->execute();
        
        $conn->commit();
        
        http_response_code(200);
        echo json_encode(array("message" => "Xóa quyền thành công."));
    } catch(Exception $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode(array(
            "message" => "Không thể xóa quyền.",
            "error" => $e->getMessage()
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dữ liệu không đầy đủ."));
}
?>