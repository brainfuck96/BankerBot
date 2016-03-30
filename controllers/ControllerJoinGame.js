module.exports = ControllerJoinGame;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerJoinGame() {

    //Metodo para crear nuevo juego
    this.joinGame = function (idUser, name, message) {

        var player = new Player();
        player.obtainCurrentGame(idUser,name,message);

    }

    this.callBackJoinGame = function (idUser, name, message, idGame) {
        var sender = new messageSender();

        //Si el jugador no tiene partida registrada, entonces se le manda el mensaje que se una a juego
        if (idGame == null || idGame == -1) {

            var messageToSend = "Alright, enter the game's ID (I recommend you to copy-paste it!)"
            //var arrayResponses = [["5M", "1M", "500K"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];
            var replymarkup = {force_reply : true, selective : true };
            sender.sendResponse(message, messageToSend,replymarkup);

        }
        //Tiene partida!
        else {
            var messageToSend = "Sorry, you are already in a game! You have to /leavegame to join a new one!"
            sender.sendResponse(message, messageToSend);
        }
    }



    //Metodo para crear nuevo juego
    this.gameExists = function (idGame, idUser, completeName, message) {

        var game = new Game();
        game.searchGame(idGame, idUser, completeName, message);

    }

    this.callBackExistGame = function (idGame, idUser, name, message){

        var sender = new messageSender();
        //Ese juego no existe!
        if (idGame == null || idGame == -1) {

            var messageToSend = "Sorry, the game " + message.text + " does not exist, please enter another one";
            //var arrayResponses = [["5M", "1M", "500K"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];
            var replymarkup = { force_reply : true, selective : true };
            sender.sendResponse(message, messageToSend, replymarkup);

        }
        //Si existe, se consigue el nombre del jugador
        else {
            var player = new Player();
            player.createNewPlayer(idUser, name, idGame);
            player.obtainName(idGame, message);
        }

    }

    this.callBackGameOwner = function (name, message) {
        var user = message.from;
        //El id del usuario es unico
        var idUser = user.id;
        var idGame = Number(message.text);
        var sender = new messageSender();
        var player = new Player();
        var firstName = user.first_name;
        var lastName = user.last_name;

        if (lastName == null || lastName == "" || lastName == " ") {
            lastName = "\u00A0";
        }

        var completeName = firstName + " " + lastName;

        if (name == completeName) {
            var messageToSend = "You just joined your own game! Welcome back!"
        }
        else {
            var messageToSend = "You joined " + name + "'s game successfully!"
        }

        sender.sendResponse(message, messageToSend);
        message.text = "/join";
        player.obtainPlayersInGame(idGame, message, " ");


    }

    this.callBackPlayersInGame = function (players, message) {
        var user = message.from;
        //El id del usuario es unico
        var idUser = user.id;
        var firstName = user.first_name;
        var lastName = user.last_name;

        if (lastName == null || lastName == "" || lastName == " ") {
            lastName = "\u00A0";
        }

        var completeName = firstName +" "+ lastName;
        var sender = new messageSender();

        for (var i = 0; i < players.length; i++) {

            if (Number(players[i]._id) != Number(idUser)) {
                var messageToSend = completeName + " joined your game!"
                sender.sendMessage(Number(players[i]._id), messageToSend);
            }

        }
        players.length = 0;





    }







}
