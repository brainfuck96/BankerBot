module.exports = ControllerMyBalance;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerMyBalance() {

    //Metodo para crear nuevo juego
    this.myBalance = function (idUser, name, message) {
        var player = new Player();
        player.obtainCurrentGame(idUser, name, message);

    }

    this.callBackGameExists = function (idUser, name, message, idGame,balancePlayer) {
        var sender = new messageSender();

        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend, { hide_keyboard: true });
        }

        else {
            var balance = Number(balancePlayer);
            var type = "M";
            if (balance < 1.0) {
                type = "K";
                balance = balance * 1000;
            }

            var yourBalance = "Your balance is: " + balance.toFixed(2) + type;
            sender.sendResponse(message, yourBalance);

        }
    }

}





