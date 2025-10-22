<?php
header("Content-Type: application/json");
include_once("../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"];
$password = $data["password"];

$query = $conn->prepare("SELECT * FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
  $user = $result->fetch_assoc();
  if (password_verify($password, $user["password"])) {
    echo json_encode(["success" => true, "message" => "Login successful"]);
  } else {
    echo json_encode(["success" => false, "message" => "Invalid password"]);
  }
} else {
  echo json_encode(["success" => false, "message" => "User not found"]);
}
?>
