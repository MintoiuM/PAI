<?php
require __DIR__ . "/config.php";

function start_app_session()
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

/**
 * Simple "encryption": letters become numbers (a=01, b=02, …, Z=52),
 * digits become D0–D9, other chars become X + ASCII code. Parts joined with dots.
 */
function simple_encrypt_password($password)
{
    $parts = array();
    $length = strlen($password);

    for ($i = 0; $i < $length; $i++) {
        $char = $password[$i];
        $code = ord($char);

        if ($char >= "a" && $char <= "z") {
            $parts[] = str_pad((string) ($code - ord("a") + 1), 2, "0", STR_PAD_LEFT);
        } elseif ($char >= "A" && $char <= "Z") {
            $parts[] = str_pad((string) ($code - ord("A") + 27), 2, "0", STR_PAD_LEFT);
        } elseif ($char >= "0" && $char <= "9") {
            $parts[] = "D" . $char;
        } else {
            $parts[] = "X" . $code;
        }
    }

    return implode(".", $parts);
}

function simple_password_matches($password, $encoded)
{
    return hash_equals(simple_encrypt_password($password), $encoded);
}

function find_user_by_username($username)
{
    $con = db_connect();
    if (!$con) {
        return null;
    }

    try {
        $stmt = mysqli_prepare(
            $con,
            "SELECT ID, Username, Email, PasswordEncoded FROM Users WHERE Username = ? LIMIT 1"
        );
        if ($stmt === false) {
            mysqli_close($con);
            return null;
        }

        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($result) ?: null;
        mysqli_stmt_close($stmt);
        mysqli_close($con);
        return $user;
    } catch (mysqli_sql_exception) {
        return null;
    }
}

function create_user($username, $email, $password)
{
    $con = db_connect();
    if (!$con) {
        return array("ok" => false, "message" => "Database connection failed.");
    }

    $encoded = simple_encrypt_password($password);

    try {
        $stmt = mysqli_prepare(
            $con,
            "INSERT INTO Users (Username, Email, PasswordEncoded) VALUES (?, ?, ?)"
        );
        if ($stmt === false) {
            mysqli_close($con);
            return array("ok" => false, "message" => "Could not create account.");
        }

        mysqli_stmt_bind_param($stmt, "sss", $username, $email, $encoded);
        $ok = mysqli_stmt_execute($stmt);
        $userId = mysqli_insert_id($con);
        mysqli_stmt_close($stmt);
        mysqli_close($con);

        if (!$ok) {
            return array("ok" => false, "message" => "Username or email already exists.");
        }

        return array(
            "ok" => true,
            "user" => array(
                "id" => (int) $userId,
                "username" => $username,
                "email" => $email,
            ),
        );
    } catch (mysqli_sql_exception) {
        mysqli_close($con);
        return array("ok" => false, "message" => "Username or email already exists.");
    }
}

function public_user($row)
{
    return array(
        "id" => (int) $row["ID"],
        "username" => $row["Username"],
        "email" => $row["Email"],
    );
}
?>
