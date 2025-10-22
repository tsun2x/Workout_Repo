<?php
header("Content-Type: application/json");
include_once("../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"];
$email = $data["email"];
$password = password_hash($data["password"], PASSWORD_DEFAULT);

$query = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$query->bind_param("sss", $name, $email, $password);

if ($query->execute()) {
  echo json_encode(["success" => true, "message" => "Signup successful"]);
} else {
  echo json_encode(["success" => false, "message" => "Error during signup"]);
}
?>
