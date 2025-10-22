<?php
$host = "localhost";
$db_name = "system_integ";
$username = "root";
$password = "";
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "DB Connection failed."]));
}
?>
