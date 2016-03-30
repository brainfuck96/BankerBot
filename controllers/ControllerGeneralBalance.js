module.exports = ControllerGeneralBalance;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerGeneralBalance() {

    //Metodo para crear nuevo juego
    this.generalBalance = function (idUser, name, message) {


        var player = new Player();
        player.obtainCurrentGame(idUser, name, message);


    }

    this.callBackGameExists = function (idUser, name, message, idGame) {
        var sender = new messageSender();

        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend, { hide_keyboard: true });

        }

        else {
            var player = new Player();
            player.obtainPlayersInGame(idGame, message, name);
        }


    }

    this.callBackPlayersInGame = function (players, message, idGame) {
        var sender = new messageSender();
        var user = message.from;
        var idUser = user.id;

        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend, { hide_keyboard: true });

        }

        else {
            if (players.length == 0) {
                var messageToSend = "You don't have any player in your game yet! They'll have to /joingame with the Game ID!"
                sender.sendResponse(message, messageToSend, { hide_keyboard: true });
            }
            else {
                for (var i = 0; i < players.length; i++) {
                    var balance = Number(players[i].balance);
                    var type = "M";
                    if (balance < 1.0) {
                        type = "K";
                        balance=balance*1000;
                    }

                    if (type == "M") {
                        balance = balance.toFixed(2);
                    }
                    else {
                        balance = balance.toFixed(1);
                    }

                    if (Number(players[i]._id) == idUser) {



                        var yourBalance = "Your balance is: " + balance +type;
                        sender.sendResponse(message, yourBalance);
                    }

                    else {
                        var stringOfBalance;
                        stringOfBalance = players[i].name + "'s balance is: " +balance+type;
                        sender.sendResponse(message, stringOfBalance, { hide_keyboard: true });
                    }


                }

            }

        }
        players.length = 0;
    }

}





