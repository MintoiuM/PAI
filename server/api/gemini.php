<?php
require __DIR__ . "/../config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(array("ok" => false, "message" => "Method not allowed."), 405);
}

$data = request_data();
$apiKey = env_value("GEMINI_API_KEY", env_value("VITE_GEMINI_API_KEY", ""));
$systemPrompt = trim($data["systemPrompt"] ?? "");
$userPrompt = trim($data["userPrompt"] ?? "");

if ($apiKey === "") {
    json_response(array("ok" => false, "message" => "Service unavailable."), 500);
}

if ($userPrompt === "") {
    json_response(array("ok" => false, "message" => "User prompt is required."), 400);
}

$payload = array(
    "contents" => array(
        array(
            "role" => "user",
            "parts" => array(array("text" => $userPrompt)),
        ),
    ),
);

if ($systemPrompt !== "") {
    $payload["systemInstruction"] = array(
        "parts" => array(array("text" => $systemPrompt)),
    );
}

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);
$context = stream_context_create(array(
    "http" => array(
        "method" => "POST",
        "header" => "Content-Type: application/json\r\n",
        "content" => json_encode($payload),
        "ignore_errors" => true,
    ),
));

$response = file_get_contents($url, false, $context);
if ($response === false) {
    json_response(array("ok" => false, "message" => "Provider request failed."), 502);
}

$decoded = json_decode($response, true);
if (isset($decoded["error"])) {
    json_response(array("ok" => false, "message" => "Provider request failed."), 502);
}

$text = "";
if (isset($decoded["candidates"][0]["content"]["parts"])) {
    foreach ($decoded["candidates"][0]["content"]["parts"] as $part) {
        $text .= $part["text"] ?? "";
    }
}

$text = trim($text);
if ($text === "") {
    $text = "(Empty response.)";
}

save_prompt_history($systemPrompt, $userPrompt, $text);

json_response(array("ok" => true, "text" => $text));
?>
