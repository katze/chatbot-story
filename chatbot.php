<?php
header('Content-type:application/json;charset=utf-8');
$messages = json_decode(file_get_contents('story.json'), true);
$response = $messages[$_GET['id']];
$response['conversation_id'] = $_SESSION["conversation_id"];
echo json_encode($response);