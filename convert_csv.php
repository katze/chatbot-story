<?php
header('Content-type:application/json;charset=utf-8');

function cleanStr($str){
	$str = str_replace("'", "’", $str);
	$str = str_replace("\xE2\x80\xA8", "\n", $str);
	//$str = preg_replace('/[\xE2\x80\xA8]/', 'lapin', $str);

	//$str = preg_replace('/\r\n?/', "\n", $str);
	return $str;
}

$messages = array();

if (($handle = fopen("story.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
    	if($data[1] == "Processus"){
			$messages[$data[0]] = array('message' => cleanStr($data[10]), 'reponses' => array());
    	}
    }
    fclose($handle);
}

if (($handle = fopen("demo_chatbot.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
    	if($data[1] == "Ligne"){
			$messages[$data[6]]['reponses'][] = array('message' => cleanStr($data[10]), 'id' => $data[7]);
    	}
    }
    fclose($handle);
}
echo json_encode($messages);
?>