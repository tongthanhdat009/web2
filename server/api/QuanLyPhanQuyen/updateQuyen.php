<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection(); // Assumes this now returns a MySQLi connection

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->IDQuyen)) {
    // Initialize $stmt to null to potentially check in a finally block if needed, though current structure closes it within try.
    $stmt = null; 
    try {
        $conn->begin_transaction(); // Changed from beginTransaction to MySQLi OOP style
        
        // Cập nhật tên quyền
        if(!empty($data->TenQuyen)) {
            $queryQuyen = "UPDATE quyen SET TenQuyen = ? WHERE IDQuyen = ?";
            $stmt = $conn->prepare($queryQuyen);
            if ($stmt === false) {
                throw new Exception("Prepare failed for quyen update: " . $conn->error);
            }
            // Assuming TenQuyen is string (s) and IDQuyen is integer (i)
            $stmt->bind_param("si", $data->TenQuyen, $data->IDQuyen);
            if (!$stmt->execute()) {
                throw new Exception("Error updating TenQuyen: " . $stmt->error);
            }
            $stmt->close(); 
        }
        
        // Cập nhật phân quyền
        if(!empty($data->ChucNang)) {
            // Xóa phân quyền cũ
            $queryDelete = "DELETE FROM phanquyen WHERE IDQuyen = ?";
            $stmt = $conn->prepare($queryDelete);
            if ($stmt === false) {
                throw new Exception("Prepare failed for phanquyen delete: " . $conn->error);
            }
            // Assuming IDQuyen is integer (i)
            $stmt->bind_param("i", $data->IDQuyen);
            if (!$stmt->execute()) {
                throw new Exception("Error deleting old phanquyen: " . $stmt->error);
            }
            $stmt->close(); 
            
            // Thêm phân quyền mới
            $queryPhanQuyen = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Xoa, Sua) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($queryPhanQuyen); 
            if ($stmt === false) {
                throw new Exception("Prepare failed for phanquyen insert: " . $conn->error);
            }
            
            foreach($data->ChucNang as $chucnang) {
                // Ensure ChucNang properties exist and cast boolean-like values to int
                $idChucNang = isset($chucnang->IDChucNang) ? (int)$chucnang->IDChucNang : null;
                if ($idChucNang === null) {
                    throw new Exception("IDChucNang is missing for a phanquyen entry.");
                }
                $them = isset($chucnang->Them) ? (int)(bool)$chucnang->Them : 0;
                $xoa = isset($chucnang->Xoa) ? (int)(bool)$chucnang->Xoa : 0;
                $sua = isset($chucnang->Sua) ? (int)(bool)$chucnang->Sua : 0;
                
                $stmt->bind_param("iiiii", $data->IDQuyen, $idChucNang, $them, $xoa, $sua);
                if (!$stmt->execute()) {
                    throw new Exception("Error inserting new phanquyen for IDChucNang {$idChucNang}: " . $stmt->error);
                }
            }
            $stmt->close(); 
        }
        
        $conn->commit(); // MySQLi OOP style (commit() is correct)
        
        http_response_code(200);
        echo json_encode(array("message" => "Cập nhật quyền thành công."));

    } catch(Exception $e) {
        if ($conn->connect_errno === 0) { // Check if connection is still valid before rollback
             $conn->rollback(); // Changed from rollBack to MySQLi OOP style
        }
        http_response_code(503);
        echo json_encode(array(
            "message" => "Không thể cập nhật quyền.",
            "error" => $e->getMessage()
        ));
    } finally {
        // Ensure statement is closed if it was prepared and an exception occurred before explicit close
        if ($stmt instanceof mysqli_stmt) {
            $stmt->close();
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dữ liệu không đầy đủ. Vui lòng cung cấp IDQuyen."));
}
?>