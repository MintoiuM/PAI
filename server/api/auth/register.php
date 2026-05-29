<?php
require __DIR__ . "/../../auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(array("ok" => false, "message" => "Method not allowed."), 405);
}

$data = request_data();
$username = trim((string) ($data["username"] ?? ""));
$email = trim((string) ($data["email"] ?? ""));
$password = (string) ($data["password"] ?? "");

if ($username === "" || $email === "" || $password === "") {
    json_response(array("ok" => false, "message" => "Username, email, and password are required."), 400);
}

if (strlen($username) < 3) {
    json_response(array("ok" => false, "message" => "Username must be at least 3 characters."), 400);
}

if (strlen($password) < 4) {
    json_response(array("ok" => false, "message" => "Password must be at least 4 characters."), 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(array("ok" => false, "message" => "Invalid email address."), 400);
}

if (find_user_by_username($username) !== null) {
    json_response(array("ok" => false, "message" => "Username already taken."), 409);
}

$result = create_user($username, $email, $password);
if ($result["ok"] !== true) {
    json_response(array("ok" => false, "message" => $result["message"]), 400);
}

start_app_session();
$_SESSION["user_id"] = $result["user"]["id"];
$_SESSION["username"] = $result["user"]["username"];

json_response(array("ok" => true, "user" => $result["user"]));
?>
