<?php
require __DIR__ . "/../../auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    json_response(array("ok" => false, "message" => "Method not allowed."), 405);
}

start_app_session();

$userId = (int) ($_SESSION["user_id"] ?? 0);
$username = trim((string) ($_SESSION["username"] ?? ""));

if ($userId <= 0 || $username === "") {
    json_response(array("ok" => true, "user" => null));
}

$user = find_user_by_username($username);
if ($user === null) {
    json_response(array("ok" => true, "user" => null));
}

json_response(array("ok" => true, "user" => public_user($user)));
?>
