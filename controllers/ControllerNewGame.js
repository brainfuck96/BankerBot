module.exports = ControllerNewGame;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerNewGame() {

    //Metodo para crear nuevo juego
    this.createNewGame = function(idUser,name,message){


        var player = new Player();
        player.obtainCurrentGame(idUser,name,message);


    }

    this.callBackGameCreated = function (idUser, name, message, idGame) {
        var sender = new messageSender();

        if (idGame != -1) {
            var player = new Player();
            player.createNewPlayer(idUser, name, idGame);
            var messageToSend = "Game created. Everyone's balance will start at 15M (if you don't like this, you can change this by adding/removing money to each player before starting the game, with /getpaid and /paybank). Now you have to invite your friends to the game with the following id: "
            sender.sendResponse(message, messageToSend, { hide_keyboard: true });
            sender.sendResponse(message, idGame);

        }

        else {

            var messageToSend = "Sorry, there are people in your game! The game's ID is: " +idUser+ ". Try joining your own game! /joingame"
            sender.sendResponse(message, messageToSend, { hide_keyboard: true });
        }


    }

    this.callBackNewGame = function (idUser, name, message, idGame) {
        var sender = new messageSender();

        //Si el jugador no tiene partida registrada, entonces se crea el nuevo juego
        if (idGame == null || idGame == -1) {
            var game = new Game();
            //Se obtiene el id del juego creado
            game.createNewGame(idUser, name, message);




        }
        //Tiene partida!
        else {
            var messageToSend = "Sorry, you are already in a game! You have to /leavegame to create a new one!"

            sender.sendResponse(message, messageToSend);
        }
    }





}
