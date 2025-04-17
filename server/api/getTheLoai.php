<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ql_cuahangdungcu";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]);
    exit();
}

try {
    // Query to get all thể loại
    $sql = "SELECT MaTheLoai, TenTheLoai FROM theloai";
    $result = $conn->query($sql);

    if ($result) {
        $theLoais = [];
        while ($row = $result->fetch_assoc()) {
            $theLoais[] = [
                'MaTheLoai' => $row['MaTheLoai'],
                'TenTheLoai' => $row['TenTheLoai']
            ];
        }

        echo json_encode([
            'success' => true,
            'data' => $theLoais
        ]);
    } else {
        throw new Exception("Error executing query: " . $conn->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>