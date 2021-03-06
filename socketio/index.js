var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var pseudos = [];
var reponses = 0;
var quizz_nom = "";
var quizz_id = "";
var partie_on = false;

server.listen(3000);

io.on('connection', function (socket) {
	if (partie_on) {
		io.emit('partieOn')
	}else {
		var pseudo = "";
		var tabjson;
		io.emit('saveQuizz',quizz_nom)
		io.emit('savePseudo',pseudos)

		fs.readFile('themes.json', 'utf8', function (err, data) {
			if (err) throw err;
			io.emit('saveThemes',data)
		});

		//accueil
		socket.on('savefile',function(data){
			var json = JSON.stringify(data);
			fs.appendFile('themes.json', json, function (err) {
  			if (err) throw err;
  				console.log('Saved!');
			});
		});

		socket.on('nouveau_joueur',function(p){
			pseudo = p
			pseudos.push(pseudo)
			io.emit('savePseudo',pseudos)
			console.log(pseudos)
		});

		socket.on('commencer',function(id){
			quizz_id = id;
			io.emit('demarrer');
			partie_on=true;
		});

		socket.on('nomQuizz',function(nom){
			quizz_nom = nom
			io.emit('saveQuizz',nom)
		});

		socket.on('finPartie',function(p){
			console.log('Reseting Server ! Game over !');
			reponses = 0;
			quizz_nom = "";
			quizz_id = "";
			partie_on = false;
			socket.disconnect();
		});

		socket.on('disconnect', function(reason){
			var i = pseudos.indexOf(pseudo);
			pseudos.splice(i, 1);
			io.emit('savePseudo',pseudos)
			console.log(pseudos)
			if (pseudos.length == 0) {
				console.log('Reseting Server ! All clients left !');
				reponses = 0;
				quizz_nom = "";
				quizz_id = "";
				partie_on = false;
			}
		});

		//question
		socket.on('recupId',function(){
			io.emit('saveId',{ quizz_id , pseudos, pseudo })
		});

		socket.on('suivant',function(){
			reponses = 0
			io.emit('questionSuivant')
		});

		socket.on('nombreReponse',function(){
			reponses = reponses + 1;
			io.emit('nbReponses',reponses)
		});
	}
});
