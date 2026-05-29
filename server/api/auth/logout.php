<?php
require __DIR__ . "/../../auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(array("ok" => false, "message" => "Method not allowed."), 405);
}

start_app_session();
$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        "",
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}
session_destroy();

json_response(array("ok" => true));
?>
