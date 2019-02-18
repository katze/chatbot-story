<?php
header('Content-type:application/json;charset=utf-8');
$messages = json_decode(file_get_contents('story.json'), true);
$response = $messages[$_GET['id']];
echo json_encode($response);