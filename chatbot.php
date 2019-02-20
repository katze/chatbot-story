<?php
header('Content-type:application/json;charset=utf-8');
$messages = json_decode(file_get_contents('story.json'), true);

$message = $messages[$_GET['id']];


function cleanResponse($message){
	$reponses = array();
	foreach ($message['reponses'] as $key => $value) {
		if($value['regExp']){
			// on ne garde pas les réponses contenant des expressions regulières
			// car en observant les requetes AJAX le joueur aurait lesréponses
		}else{
			$reponses[] = $value;
		}
	}
	$message['reponses'] = $reponses;
	return $message;
}

// La réponse contient un message à valider
if($_GET['message'] && $message['freeEntry'] == true){

	// pour chaque réponse on regarde si le message envoyé par l'utilisateur match une expression régulière
	foreach ($message['reponses'] as $reponse) {
		if($reponse['regExp']){
			preg_match_all($reponse['regExp'], $_GET['message'], $matches, PREG_SET_ORDER, 0);
			if($matches){
				$out = $messages[$reponse['id']];
 			}else{
 			}
			
		}
	}
	// si aucune réponse ne match, on renvoi la question d'origine
	if(!$out){
		$out = $message; // nettoyer les réponses regexp
	}
	echo json_encode(cleanResponse($out));	

// La réponse ne contient pas de message à valider
}else{
	$out = $message; // nettoyer les réponses regexp
	echo json_encode(cleanResponse($out));	
}

