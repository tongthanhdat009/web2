<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data["name"]) && !empty($data["email"])) {
    $name = $data["name"];
    $email = $data["email"];

    // Sử dụng câu lệnh chuẩn bị để tránh SQL Injection
    $stmt = $conn->prepare("INSERT INTO nguoidung (HoTen, Email) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $email);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Thêm user thành công!", "userId" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Lỗi: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Dữ liệu không hợp lệ"]);
}

$conn->close();
?>