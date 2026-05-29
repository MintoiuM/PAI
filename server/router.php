<?php
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if (str_starts_with($path, "/api/")) {
    $apiFile = __DIR__ . $path . ".php";
    if (file_exists($apiFile)) {
        require $apiFile;
        return true;
    }

    http_response_code(404);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(array("ok" => false, "message" => "API-ul cerut nu exista."));
    return true;
}

$staticFile = dirname(__DIR__) . "/dist" . $path;
if ($path !== "/" && file_exists($staticFile) && !is_dir($staticFile)) {
    return false;
}

require dirname(__DIR__) . "/dist/index.html";
return true;
?>
