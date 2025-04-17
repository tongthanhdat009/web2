<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->IDQuyen)) {
    try {
        $conn->beginTransaction();
        
        // Cập nhật tên quyền
        if(!empty($data->TenQuyen)) {
            $queryQuyen = "UPDATE quyen SET TenQuyen = :TenQuyen WHERE IDQuyen = :IDQuyen";
            $stmt = $conn->prepare($queryQuyen);
            $stmt->bindParam(":TenQuyen", $data->TenQuyen);
            $stmt->bindParam(":IDQuyen", $data->IDQuyen);
            $stmt->execute();
        }
        
        // Cập nhật phân quyền
        if(!empty($data->ChucNang)) {
            // Xóa phân quyền cũ
            $queryDelete = "DELETE FROM phanquyen WHERE IDQuyen = :IDQuyen";
            $stmt = $conn->prepare($queryDelete);
            $stmt->bindParam(":IDQuyen", $data->IDQuyen);
            $stmt->execute();
            
            // Thêm phân quyền mới
            $queryPhanQuyen = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Xoa, Sua) 
                             VALUES (:IDQuyen, :IDChucNang, :Them, :Xoa, :Sua)";
            $stmt = $conn->prepare($queryPhanQuyen);
            
            foreach($data->ChucNang as $chucnang) {
                $stmt->bindParam(":IDQuyen", $data->IDQuyen);
                $stmt->bindParam(":IDChucNang", $chucnang->IDChucNang);
                $stmt->bindParam(":Them", $chucnang->Them);
                $stmt->bindParam(":Xoa", $chucnang->Xoa);
                $stmt->bindParam(":Sua", $chucnang->Sua);
                $stmt->execute();
            }
        }
        
        $conn->commit();
        
        http_response_code(200);
        echo json_encode(array("message" => "Cập nhật quyền thành công."));
    } catch(Exception $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode(array(
            "message" => "Không thể cập nhật quyền.",
            "error" => $e->getMessage()
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dữ liệu không đầy đủ."));
}
?>