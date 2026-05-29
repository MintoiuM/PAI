<?php
require __DIR__ . "/../../auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(array("ok" => false, "message" => "Method not allowed."), 405);
}

$data = request_data();
$username = trim((string) ($data["username"] ?? ""));
$password = (string) ($data["password"] ?? "");

if ($username === "" || $password === "") {
    json_response(array("ok" => false, "message" => "Username and password are required."), 400);
}

$user = find_user_by_username($username);
if ($user === null || !simple_password_matches($password, $user["PasswordEncoded"])) {
    json_response(array("ok" => false, "message" => "Invalid username or password."), 401);
}

start_app_session();
$_SESSION["user_id"] = (int) $user["ID"];
$_SESSION["username"] = $user["Username"];

json_response(array("ok" => true, "user" => public_user($user)));
?>
