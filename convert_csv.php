<?php
header('Content-type:application/json;charset=utf-8');


$filename = "story.csv";

function cleanStr($str){
	$str = str_replace("'", "’", $str);
	$str = str_replace("\xE2\x80\xA8", "\n", $str);
    $str = str_replace("RegExp=", "", $str);
	return $str;
}

$messages = array();

if (($handle = fopen($filename, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
    	if($data[1] == "Processus"){
			$messages[$data[0]] = array('message' => cleanStr($data[10]), 'freeEntry' => false, 'reponses' => array());
    	}
    }
    fclose($handle);
}

if (($handle = fopen($filename, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
    	if($data[1] == "Ligne"){

            if(strpos($data[10], 'RegExp') > -1){
                $messages[$data[6]]['freeEntry'] = true;
                $messages[$data[6]]['reponses'][] = array('regExp' => cleanStr($data[10]), 'id' => $data[7]);    

            }else{
                $messages[$data[6]]['reponses'][] = array('message' => cleanStr($data[10]), 'id' => $data[7]);    
            }
    	}
    }
    fclose($handle);
}
echo json_encode($messages);
?>