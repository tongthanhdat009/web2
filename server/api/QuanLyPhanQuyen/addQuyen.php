<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/Database.php';

$database = new Database();
$conn = $database->getConnection(); // mysqli connection

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->TenQuyen)) {
    // Bắt đầu transaction
    mysqli_begin_transaction($conn);

    try {
        // 1. Thêm quyền mới
        $queryQuyen = "INSERT INTO quyen (TenQuyen) VALUES (?)";
        $stmtQuyen = mysqli_prepare($conn, $queryQuyen);
        mysqli_stmt_bind_param($stmtQuyen, "s", $data->TenQuyen);
        mysqli_stmt_execute($stmtQuyen);

        if (mysqli_stmt_affected_rows($stmtQuyen) <= 0) {
            throw new Exception("Không thể thêm quyền.");
        }

        $IDQuyen = mysqli_insert_id($conn);
        mysqli_stmt_close($stmtQuyen);

        // 2. Thêm phân quyền cho các chức năng nếu có
        if (!empty($data->ChucNang)) {
            $queryPhanQuyen = "INSERT INTO phanquyen (IDQuyen, IDChucNang, Them, Xoa, Sua) 
                               VALUES (?, ?, ?, ?, ?)";
            $stmtPhanQuyen = mysqli_prepare($conn, $queryPhanQuyen);

            foreach ($data->ChucNang as $chucnang) {
                mysqli_stmt_bind_param(
                    $stmtPhanQuyen,
                    "iiiii",
                    $IDQuyen,
                    $chucnang->IDChucNang,
                    $chucnang->Them,
                    $chucnang->Xoa,
                    $chucnang->Sua
                );
                mysqli_stmt_execute($stmtPhanQuyen);

                if (mysqli_stmt_errno($stmtPhanQuyen)) {
                    throw new Exception("Lỗi khi thêm phân quyền: " . mysqli_stmt_error($stmtPhanQuyen));
                }
            }

            mysqli_stmt_close($stmtPhanQuyen);
        }

        // Commit transaction
        mysqli_commit($conn);

        http_response_code(201);
        echo json_encode(array(
            "message" => "Thêm quyền thành công.",
            "IDQuyen" => $IDQuyen
        ));
    } catch (Exception $e) {
        mysqli_rollback($conn);
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
