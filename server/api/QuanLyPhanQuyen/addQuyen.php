<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->TenQuyen)) {
    try {
        $conn->beginTransaction();
        
        // Thêm quyền mới
        $queryQuyen = "INSERT INTO quyen (TenQuyen) VALUES (:TenQuyen)";
        $stmt = $conn->prepare($queryQuyen);
        $stmt->bindParam(":TenQuyen", $data->TenQuyen);
        $stmt->execute();
        
        $IDQuyen = $conn->lastInsertId();
        
        // Thêm phân quyền cho các chức năng
        if(!empty($data->ChucNang)) {
            $queryPhanQuyen = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Xoa, Sua) 
                             VALUES (:IDQuyen, :IDChucNang, :Them, :Xoa, :Sua)";
            $stmt = $conn->prepare($queryPhanQuyen);
            
            foreach($data->ChucNang as $chucnang) {
                $stmt->bindParam(":IDQuyen", $IDQuyen);
                $stmt->bindParam(":IDChucNang", $chucnang->IDChucNang);
                $stmt->bindParam(":Them", $chucnang->Them);
                $stmt->bindParam(":Xoa", $chucnang->Xoa);
                $stmt->bindParam(":Sua", $chucnang->Sua);
                $stmt->execute();
            }
        }
        
        $conn->commit();
        
        http_response_code(201);
        echo json_encode(array(
            "message" => "Thêm quyền thành công.",
            "IDQuyen" => $IDQuyen
        ));
    } catch(Exception $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode(array(
            "message" => "Không thể thêm quyền.",
            "error" => $e->getMessage()
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dữ liệu không đầy đủ."));
}
?>