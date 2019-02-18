function quickAnswer(message, id) {
	var template_human = Handlebars.compile(document.getElementById("human-template").innerHTML);
	var template_bot = Handlebars.compile(document.getElementById("bot-template").innerHTML);
	var template_image_bot = Handlebars.compile(document.getElementById("bot-image-template").innerHTML);
	var template_answers = Handlebars.compile(document.getElementById("answers-template").innerHTML);
	
	$.ajax({
	  url: "chatbot.php",
	  data: { id: id },
	  error: function() {
	  	$('#messages').append('<div class="message system"><p>Connexion internet interrompue<br>Vérifiez votre connexion puis recommencez</p></div>');
		window.scrollTo(0,document.body.scrollHeight);
	  },	  
	  success: function( result ) {
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
						// Do nothing, Pause are not supported on old browsers
					}else if(element.indexOf('(Restart)') > -1){
						$('#messages').append('<div class="message system"><p><a href="./">Recommencer</a></p></div>');
						window.scrollTo(0,document.body.scrollHeight);
					
					}else{
						if(i != $(messages).length)
						$('#messages').append(template_bot({'message': element}));
						window.scrollTo(0,document.body.scrollHeight);
					}
					window.scrollTo(0,document.body.scrollHeight);
			}

			if(result['reponses'][0]['message'] == ""){
				quickAnswer(null, result['reponses'][0]['id']);
			}else{
				$('#messages').append(template_answers(result));
				window.scrollTo(0,document.body.scrollHeight);
			}
	  }
	});		

}