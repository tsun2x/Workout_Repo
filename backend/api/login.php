<?php
header("Content-Type: application/json");
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$password = $data['password'];

if ($email == "test@example.com" && $password == "123456") {
    echo json_encode(["message" => "Login successful"]);
} else {
    echo json_encode(["message" => "Invalid credentials"]);
}
?>
