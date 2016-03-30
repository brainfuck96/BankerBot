module.exports = ControllerPayBank;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerPayBank() {

    this.payBank = function (idUser, name, message) {
        var player = new Player();
        player.obtainCurrentGame(idUser, name, message);

    }

    this.payAmount = function (idUser,amount,name, message) {

        var player = new Player();
        player.obtainCurrentGame5(idUser,amount,name, message);

    }

    //testing it out
    this.callBackGameExists = function (idUser, name, message, idGame) {
        var sender = new messageSender();
        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
        }

        else {
            var sender = new messageSender();
            var messageToSend = "How much money do you want to send to the bank? (200k,1.5m,etc)";
            //var arrayResponses = [["5M", "1M", "500K"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];
            var replymarkup = { force_reply : true, selective : true };
            sender.sendResponse(message, messageToSend, replymarkup);
        }
    }

    this.callBackGotBalance = function (idUser, amount, name, message, idGame, balance) {
        var sender = new messageSender();
        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
        }

        else {
            amount = Number(amount);
            balance = Number(balance)
            var balanceAfterSending = balance - amount;
            if (balanceAfterSending < 0) {
                var typeOfAmount = "M";
                if (amount < 1.0) {
                    amount *= 1000;
                    typeOfAmount = "K";
                }

                var typeOfBalance = "M";
                if (balance < 1.0) {
                    balance *= 1000;
                    typeOfBalance = "K";
                }

                var messageToSend = "Sorry, you don't have enough money. You need: " + amount + typeOfAmount + " and you only have " + balance.toFixed(1) + "" + typeOfBalance;
            }
            //COMMENT
            else {
                var player = new Player();
                player.decreaseMoney(idGame, amount, idUser);

                var typeOfBalance = "M";
                if (balanceAfterSending < 1.0) {
                    balanceAfterSending *= 1000;
                    typeOfBalance = "K";
                }

                var typeOfAmount = "M";
                if (amount < 1.0) {

                    amount *= 1000;
                    typeOfAmount = "K";
                }
                var messageToSend = "The bank removed " + amount + typeOfAmount + " from your account and now your balance is: " + balanceAfterSending.toFixed(1) + "" + typeOfBalance;
                var sentMoney = String(amount) + typeOfAmount;
                player.obtainPlayersInGame4(idUser, name, idGame, sentMoney);


            }
            sender.sendResponse(message, messageToSend);


        }
    }

    this.callBackAlertPlayers = function (players,sentMoney,name) {
        var sender = new messageSender();
        for (var i = 0; i < players.length; i++) {
            var messageToSend = "The bank removed " + sentMoney + " from " + name;
            sender.sendMessage(Number(players[i]._id), messageToSend);
        }
        players.length = 0;
    }
}






