<?php
function env_value($key, $default = "")
{
    $value = getenv($key);
    if ($value !== false && $value !== "") {
        return $value;
    }

    $envFile = dirname(__DIR__) . "/.env";
    if (!file_exists($envFile)) {
        return $default;
    }

    $file = fopen($envFile, "r");
    if (!$file) {
        return $default;
    }

    while (!feof($file)) {
        $line = trim(fgets($file));
        if ($line === "" || str_starts_with($line, "#") || !str_contains($line, "=")) {
            continue;
        }

        $parts = explode("=", $line, 2);
        if (trim($parts[0]) === $key) {
            fclose($file);
            return trim($parts[1], " \t\n\r\0\x0B\"'");
        }
    }

    fclose($file);
    return $default;
}

function json_response($payload, $statusCode = 200)
{
    http_response_code($statusCode);
    header("Content-Type: application/json; charset=utf-8");
    header("X-Content-Type-Options: nosniff");
    echo json_encode($payload);
    exit;
}

function request_data()
{
    $raw = file_get_contents("php://input");
    $json = json_decode($raw, true);
    if (is_array($json)) {
        return $json;
    }

    return $_POST;
}

function db_settings()
{
    return array(
        "host" => env_value("MYSQL_HOST", "localhost"),
        "user" => env_value("MYSQL_USER", "root"),
        "password" => env_value("MYSQL_PASSWORD", ""),
        "database" => env_value("MYSQL_DATABASE", "pai_prompt_agents"),
    );
}

function db_connect()
{
    if (!function_exists("mysqli_connect")) {
        return null;
    }

    $settings = db_settings();

    try {
        $con = mysqli_connect(
            $settings["host"],
            $settings["user"],
            $settings["password"],
            $settings["database"]
        );
    } catch (mysqli_sql_exception) {
        return null;
    }

    if (!$con) {
        return null;
    }

    mysqli_set_charset($con, "utf8mb4");
    return $con;
}

function save_prompt_history($systemPrompt, $userPrompt, $modelReply)
{
    $con = db_connect();
    if (!$con) {
        return false;
    }

    try {
        $stmt = mysqli_prepare(
            $con,
            "INSERT INTO PromptHistory (SystemPrompt, UserPrompt, ModelReply) VALUES (?, ?, ?)"
        );
        if ($stmt === false) {
            mysqli_close($con);
            return false;
        }

        mysqli_stmt_bind_param($stmt, "sss", $systemPrompt, $userPrompt, $modelReply);
        $ok = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        mysqli_close($con);
        return $ok;
    } catch (mysqli_sql_exception) {
        return false;
    }
}
?>
