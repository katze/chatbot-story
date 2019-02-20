function pause(duration=2) {
	return new Promise(resolve => setTimeout(resolve, duration*1000));
}


function enableEntry(state){
	if(state){
		$( "#entry" ).slideDown();
		$('#response').removeAttr("disabled");
		$('#send').removeAttr("disabled");
	}else{
		$( "#entry" ).slideUp();
		$('#response').val("");
		$('#response').attr("disabled", "disabled");
		$('#send').attr("disabled", "disabled");
	}
}

async function validateAnwer(message, id) {
	answer(message, id, 'validate');
}


async function quickAnswer(message, id) {
	answer(message, id, 'quick');
}

async function answer(message, id, type) {	
	$( "#entry" ).slideUp();
	var template_human = Handlebars.compile(document.getElementById("human-template").innerHTML);
	var template_bot = Handlebars.compile(document.getElementById("bot-template").innerHTML);
	var template_image_bot = Handlebars.compile(document.getElementById("bot-image-template").innerHTML);
	var template_answers = Handlebars.compile(document.getElementById("answers-template").innerHTML);
	
	if(type == 'validate'){
		data = { 'message': message, 'id': id };
	}else{
		data = { 'id': id };
	}

	$.ajax({
	  url: "chatbot.php",
	  data: data,
	  error: function() {
	  	$('#messages').append('<div class="message system"><p>Connexion internet interrompue<br>Vérifiez votre connexion puis recommencez</p></div>');
		window.scrollTo(0,document.body.scrollHeight);
	  },
	  success: async function( result ) {
	  	$('#message_id').val(id);
		$('.quickAnswers').remove();
		if(message){
			$('#messages').append(template_human({'message': message}));
		}

	  	messages = result.message.split("\n");
			for(i=0 ; i < $(messages).length; i++){
				element = $(messages)[i];
					if(element.indexOf('.jpg') > -1){
						$('#messages').append(template_image_bot({'message': element}));
						window.scrollTo(0,document.body.scrollHeight);
					}else if(element.indexOf('(Pause=') > -1){
						var x = await pause(1);
						$('#messages').append('<div class="message system"><p>Votre correspondant est occupé</p></div>');
						window.scrollTo(0,document.body.scrollHeight);
						var x = await pause(5);
					}else if(element.indexOf('(Restart)') > -1){
						var x = await pause(1);
						$('#messages').append('<div class="message system"><p><a href="./">Recommencer</a></p></div>');
						window.scrollTo(0,document.body.scrollHeight);
					
					}else{
						if(i != $(messages).length)
							var x = await pause(1); // Pause d'une seconde avant d'afficher le message
						$('#messages').append(template_bot({'message': element}));
						window.scrollTo(0,document.body.scrollHeight);
					}
					window.scrollTo(0,document.body.scrollHeight);
			}

			if(result['reponses'].length > 0 && result['reponses'][0]['message'] == ""){
				var x = await pause(1); // Pause d'une seconde avant de charger la réponse suivante
				quickAnswer(null, result['reponses'][0]['id']);
			}else{
				var x = await pause(1); // Pause d'une seconde avant d'afficher les bulles
				$('#messages').append(template_answers(result));
				window.scrollTo(0,document.body.scrollHeight);

			}
		  	enableEntry(result.freeEntry);

	  }
	});		

}