module.exports = ControllerSendEveryone;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerSendEveryone() {

    this.sendEveryoneMoney = function (idUser, name, message) {


        var player = new Player();
        player.obtainCurrentGame(idUser, name, message);


    }

    this.sendMoneyToEveryone = function (idUser, amount, name, message){

        var player = new Player();
        player.obtainCurrentGame4(idUser,amount,name, message);

    }

    this.callBackSendEveryone = function(idUser, name, message, idGame) {
        var sender = new messageSender();
        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
        }

        else {
            var sender = new messageSender();
            var messageToSend = "How much money do you want to send to each player? (200k,1.5m,etc)";
            //var arrayResponses = [["5M", "1M", "500K"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];
            var replymarkup = { force_reply : true, selective : true };
            sender.sendResponse(message, messageToSend, replymarkup);
        }
    }

    this.callBackGotGame = function (idUser, amount, name, message, idGame){
        var sender = new messageSender();
        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
        }

        else {
            var player = new Player();
            player.obtainPlayersInGame3(idUser, amount, name, message, idGame);
        }
    }


    this.finalizeTransactions = function (idUser,amount,name, message, idGame, players) {
        var sender = new messageSender();



        if (idGame == -1) {
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
        }

        else {

            if (players == null || players.length == 0) {
                var messageToSend = "Whoops, it seems that you are the only one here! You still have your money tho!"
                sender.sendResponse(message, messageToSend);
            }

            else {
                var mainMessage = message.text;
                var typeOfTransaction = mainMessage.substring(mainMessage.length - 1, mainMessage.length)


                var balanceSender = 0;
                var transactionSuccessful = false;
                var amountToSend = 0;
                var balanceAfter = 0;
                var numberOfPlayers = players.length - 1;



                for (var i = 0; i < players.length; i++) {



                    if (Number(players[i]._id) == Number(idUser)) {

                        balanceSender = Number(players[i].balance);
                        amountToSend = (Number(amount) * numberOfPlayers);

                        balanceAfter = balanceSender - amountToSend;

                        if (balanceAfter < 0) {


                            typeToSend = "M";
                            if (amountToSend < 1.0) {
                                amountToSend *= 1000;
                                typeToSend = "K";
                            }

                            var typeSender = "M"
                            if (balanceSender < 1.0) {
                                typeSender = "K";
                                balanceSender *= 1000;
                            }

                            var messageToSend = "Sorry, you don't have enough money. You need: " + amountToSend +typeToSend  + " and you only have " + balanceSender.toFixed(2)+""+typeSender;
                            sender.sendResponse(message, messageToSend);

                        }
                        else {
                            var player = new Player();
                            player.addMoneyToEveryone(idGame, amount, idUser);
                            player.decreaseMoney(idGame, Number(amount)* numberOfPlayers, idUser);
                            transactionSuccessful = true;
                        }
                        break;
                    }

                }

                if (transactionSuccessful) {


                    var totalAmount = Number(amount) * (players.length - 1);

                    var totalType = "M"
                    if (totalAmount < 1.0) {
                        totalType = "K";
                        totalAmount *= 1000;
                    }

                    if (typeOfTransaction == "K" || typeOfTransaction == "k") {

                        amount *= 1000;

                    }

                    if (balanceAfter < 1.0) {
                        balanceAfter *= 1000;
                        typeSender = "K"
                    }
                    else {
                        typeSender = "M";
                    }


                    for (var j = 0; j < players.length; j++) {

                        if (Number(players[j]._id) == idUser) {

                            var messageToSend = "You sent " + amount + typeOfTransaction+" to everyone (Total: "+totalAmount+totalType+") and now your balance is: " + balanceAfter.toFixed(2) + "" + typeSender;
                            sender.sendResponse(message, messageToSend);

                        }
                        else {
                            var balanceReceiver = Number(Number(players[j].balance));


                            var amountAux = amount;
                            if (typeOfTransaction == "K" || typeOfTransaction == "k") {

                                amountAux /= 1000;

                            }

                            var balanceReceiver = balanceReceiver + Number(amountAux);
                            var typeReceiver = "M";
                            if (balanceReceiver < 1.0) {
                                balanceReceiver = balanceReceiver * 1000;
                                typeReceiver = "K";
                            }
                            var messageToSend = "You received " + amount +typeOfTransaction+" from " + name + " and now your balance is: "+balanceReceiver.toFixed(2)+typeReceiver;
                            sender.sendMessage(Number(players[j]._id), messageToSend);
                        }

                    }
                }


            }

        }

        players.length = 0;
    }







}
