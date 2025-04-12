<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$query = "SELECT q.IDQuyen, q.TenQuyen, GROUP_CONCAT(
    CONCAT(cn.IDChucNang, ':', cn.TenChucNang, ':', 
    COALESCE(pq.Them, 0), ':', 
    COALESCE(pq.Xoa, 0), ':', 
    COALESCE(pq.Sua, 0))
    SEPARATOR ';') as ChucNang
FROM quyen q
LEFT JOIN phanquyen pq ON q.IDQuyen = pq.IDQuyen
LEFT JOIN chucnang cn ON pq.IDChucNang = cn.IDChucNang
GROUP BY q.IDQuyen, q.TenQuyen";

$stmt = $conn->prepare($query);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $quyens = array();
    
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $quyen = array(
            "IDQuyen" => $row['IDQuyen'],
            "TenQuyen" => $row['TenQuyen'],
            "ChucNang" => array()
        );
        
        if($row['ChucNang']) {
            $chucnangs = explode(';', $row['ChucNang']);
            foreach($chucnangs as $cn) {
                list($id, $ten, $them, $xoa, $sua) = explode(':', $cn);
                $quyen['ChucNang'][] = array(
                    "IDChucNang" => $id,
                    "TenChucNang" => $ten,
                    "Them" => (bool)$them,
                    "Xoa" => (bool)$xoa,
                    "Sua" => (bool)$sua
                );
            }
        }
        
        $quyens[] = $quyen;
    }
    
    http_response_code(200);
    echo json_encode($quyens);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Không tìm thấy quyền nào."));
}
?>