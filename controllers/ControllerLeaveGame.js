module.exports = ControllerLeaveGame;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerLeaveGame() {

    //Metodo para crear nuevo juego
    this.leaveGame = function (idUser, name, message) {


        var player = new Player();
        player.obtainCurrentGame(idUser, name, message);

    }
    //Callback 2
    this.callBackLeaveGame = function (idUser, name, message, idGame) {

        var sender = new messageSender();
        if (idGame == null || idGame == -1) {

            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);

        }
        //Tiene partida!
        else {
            var player = new Player();
            player.leaveGame(idUser, name, message);
            player.obtainPlayersInGame(idGame, message, name);
        }



    }

    this.callBackPlayersInGame = function (names, message, leavingName, idGame){



        for (var i = 0; i < names.length; i++) {
            var sender = new messageSender();
            var messageToSend = leavingName + " left the game";

            sender.sendMessage(Number(names[i]._id), messageToSend);
        }

        //Si ya no hay jugadores, se borra el juego
        if (names.length == 0) {
            var game = new Game();
            game.deleteGame(idGame);
            var sender = new messageSender();
            var messageToSend = "Oh, you were the last one in the game! The game has now been deleted. You can now create a new game!";
            sender.sendResponse(message, messageToSend, { hide_keyboard: true });
        }
        else {
            var sender = new messageSender();
            var messageToSend = "You left the game, you can now create a /newgame or /joingame";
            sender.sendResponse(message, messageToSend, { hide_keyboard: true });
        }

        names.length = 0;
    }





}
