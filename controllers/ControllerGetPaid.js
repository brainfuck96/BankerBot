module.exports = ControllerGetPaid;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerGetPaid() {

    this.getPaid = function (idUser, name, message) {


        var player = new Player();
        player.obtainCurrentGame(idUser, name, message);

    }

    this.getPaidAmount = function (idUser, amount, name, message) {
        var player = new Player();
        player.obtainCurrentGame6(idUser, amount, name, message);

    }


    this.callBackExistsGame = function (idUser, name, message, idGame) {

        var sender = new messageSender();
        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
        }

        else {
            var sender = new messageSender();
            var messageToSend = "How much money do you want to receive from the bank? (200k,1.5m,etc)";
            //var arrayResponses = [["5M", "1M", "500K"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];
            var replymarkup = { force_reply : true, selective : true };
            sender.sendResponse(message, messageToSend, replymarkup);
        }
    }

    this.callBackExistsGame2 = function (idUser, amount, name, message, idGame,balance){
        var sender = new messageSender();
        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
        }
        else {
            amount = Number(amount);
            balance = Number(balance);
            var balanceAfterAmount = balance + amount;
            var player = new Player();

            player.increaseMoney(idGame, amount, idUser);
            var typeIncrease = "M";
            if (amount < 1.0) {

                amount *= 1000;
                typeIncrease = "K"
            }

            var moneyReceived = String(amount) + typeIncrease;

            var balanceAfter = "M";
            if (balanceAfterAmount < 1.0) {
                balanceAfter = "K";
                balanceAfterAmount *= 1000;
            }

            var messageToSend = "You received " + amount + typeIncrease + " from the bank and now your balance is: " + balanceAfterAmount.toFixed(2) + balanceAfter;
            sender.sendResponse(message, messageToSend);
            player.obtainPlayersInGame5(idUser, name, idGame, moneyReceived);
        }
    }



     this.callBackAlertPlayers = function (players, sentMoney, name) {
        var sender = new messageSender();

        for (var i = 0; i < players.length; i++) {
            var messageToSend = name + " received " + sentMoney + " from the bank!";
            sender.sendMessage(Number(players[i]._id), messageToSend);
        }
        players.length = 0;
    }

 }


