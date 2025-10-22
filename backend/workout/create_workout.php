<?php
header("Content-Type: application/json");
include_once("../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data["user_id"];
$exercise = $data["exercise"];
$equipment = $data["equipment"];
$muscles = $data["muscles"];
$bmi = $data["bmi"];
$weight = $data["weight"];
$height = $data["height"];
$age = $data["age"];

$stmt = $conn->prepare("INSERT INTO workouts (user_id, exercise, equipment, muscles, bmi, weight, height, age)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssdddd", $user_id, $exercise, $equipment, $muscles, $bmi, $weight, $height, $age);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Workout saved"]);
} else {
  echo json_encode(["success" => false, "message" => "Failed to save workout"]);
}
?>
