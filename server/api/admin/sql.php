<?php
require __DIR__ . "/../../config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(array("ok" => false, "message" => "Method not allowed."), 405);
}

$adminToken = env_value("ADMIN_DASHBOARD_TOKEN", "");
if ($adminToken === "") {
    json_response(array("ok" => false, "message" => "Admin console disabled."), 403);
}

$requestToken = $_SERVER["HTTP_X_ADMIN_TOKEN"] ?? "";
if (!hash_equals($adminToken, $requestToken)) {
    json_response(array("ok" => false, "message" => "Unauthorized."), 401);
}

$data = request_data();
$sql = trim((string) ($data["sql"] ?? ""));
if ($sql === "") {
    json_response(array("ok" => false, "message" => "SQL is required."), 400);
}

$con = db_connect();
if (!$con) {
    json_response(array("ok" => false, "message" => "Database connection failed."), 500);
}

try {
    $result = mysqli_query($con, $sql);
} catch (mysqli_sql_exception) {
    $message = mysqli_error($con) ?: "SQL query failed.";
    mysqli_close($con);
    json_response(array("ok" => false, "message" => $message), 400);
}

if ($result === false) {
    $message = mysqli_error($con) ?: "SQL query failed.";
    mysqli_close($con);
    json_response(array("ok" => false, "message" => $message), 400);
}

if ($result instanceof mysqli_result) {
    $rows = array();
    $columns = array();

    while ($field = mysqli_fetch_field($result)) {
        $columns[] = $field->name;
    }

    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }

    mysqli_free_result($result);
    mysqli_close($con);
    json_response(array(
        "ok" => true,
        "type" => "select",
        "columns" => $columns,
        "rows" => array_slice($rows, 0, 200),
        "rowCount" => count($rows),
    ));
}

$affected = mysqli_affected_rows($con);
mysqli_close($con);
json_response(array("ok" => true, "type" => "mutation", "affectedRows" => $affected));
?>
