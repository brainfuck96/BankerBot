module.exports = ControllerSendMoney;
var Game = require('../entities/Game');
var Player = require('../entities/Player');
var messageSender = require('../messageSender');


function ControllerSendMoney() {


    this.sendMoney = function (idUser, name, message) {


        var player = new Player();
        player.obtainCurrentGame(idUser, name, message);


    }

    this.sendMoney2 = function (idUser, sendingName, receivingName, message, mensajesAUsuarios) {


        var player = new Player();

        player.obtainCurrentGame2(idUser, sendingName, receivingName, message, mensajesAUsuarios);


    }

    this.makeTransaction = function (idUser, completeName, amountMoneyConverted, receivingName, message, mensajesAUsuarios, index) {

        var player = new Player();
        player.obtainBalance(idUser, completeName, amountMoneyConverted, receivingName, message, mensajesAUsuarios, index);



    }

    //Aqui se verifica si el segundo jugador esta en el mismo juego
    this.callBackVerifySecondPlayer = function (idUser, sendingName, receivingName, idGame, message, mensajesAUsuarios){


        if (idGame == null || idGame == -1) {
            var sender = new messageSender();
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
            mensajesAUsuarios.pop();
        }
        //Si está en un juego
        else {
            //Se procede a buscar el juego actual del segundo jugador que recibe
            var player = new Player();
            player.obtainCurrentGameWithName(idUser, sendingName, receivingName, idGame, message,mensajesAUsuarios);
        }

    }

    this.callBackSecondPlayerExists = function (idUser, sendingName, receivingName,idGame, message,mensajesAUsuarios, idReceiving){


        if (idReceiving == -1) {

            var sender = new messageSender();
            var messageToSend = "Sorry, "+receivingName+" is not in your game!"
            sender.sendResponse(message, messageToSend);
            mensajesAUsuarios.pop();
        }

        else {
            var sender = new messageSender();
            var messageToSend = "Alright, how much money do you want to send to "+receivingName+"? (200k, 1.5m, etc)";
            //var arrayResponses = [["5M", "1M", "500K"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];
            var replymarkup = { force_reply : true, selective : true };
            sender.sendResponse(message, messageToSend, replymarkup);

        }

    }

    this.callBackMakeTransaction = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance,idGame){

        //Si el jugador no tiene partida registrada, entonces se le avisa que tiene que crear una partida
        if (idGame == null || idGame == -1) {
            var sender = new messageSender();
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
            mensajesAUsuarios.splice(index, 1);

        }
        //Tiene partida, se procede a obtener a todos los integrantes del juego
        else {
            var player = new Player();
            player.obtainPlayerWithName(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance,idGame);
        }

    }

    this.callBackMakeTransaction2 = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance,idGame, idReceiving) {

        //Si el jugador no tiene partida registrada, entonces se le avisa que tiene que crear una partida
        if (idReceiving == null || idReceiving == -1) {
            var sender = new messageSender();
            var messageToSend = "Sorry, "+mensajesAUsuarios[index].receivingName+ " is not in your game;"
            sender.sendResponse(message, messageToSend);
            mensajesAUsuarios.splice(index, 1);

        }
        //Tiene partida, se procede a obtener a todos los integrantes del juego
        else {
            var player = new Player();
            player.updateBalance(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance,idGame, idReceiving);

        }

    }

    this.callBackFinalizeTransaction = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, idGame, idReceiving, balanceSender){
        //Ahora hay que obtener todos los ids de los jugadores para que se enteren de la transaccion
        var player = new Player();

        player.obtainPlayersInGame2(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, idGame, idReceiving, balanceSender);


    }

    this.callBackAlertTransaction = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, idGame, idReceiving, names, balanceSender) {

        var mainMessage = message.text;

        var typeOfTransaction = mainMessage.substring(mainMessage.length - 1, mainMessage.length)

        if (typeOfTransaction == "K" || typeOfTransaction == "k") {

            amount *=1000;

        }
        var typeSender = "M"
        if (balanceSender < 1.0) {
            typeSender = "K";
            balanceSender *= 1000;
        }

        for (var i = 0; i < names.length; i++) {

            if (Number(names[i]._id) == idUser) {
                var sender = new messageSender();
                var messageToSend = "You sent " + amount + typeOfTransaction+ " to " + receivingName +" and now your balance is: "+balanceSender.toFixed(2)+""+typeSender;
                sender.sendResponse(message, messageToSend);

            }
            else if (Number(names[i]._id) == idReceiving) {
                var balanceReceiver = Number(Number(names[i].balance));
                var typeReceiver = "M";
                if (balanceReceiver < 1.0) {
                    balanceReceiver = balanceReceiver * 1000;
                    typeReceiver = "K";
                }

                var sender = new messageSender();
                var messageToSend = "You received " + amount + typeOfTransaction+ " from " + sendingName + " and now your balance is: "+balanceReceiver.toFixed(2)+typeReceiver;

                sender.sendMessage(idReceiving, messageToSend);

            }

            else {
                var sender = new messageSender();
                var messageToSend = receivingName+" received " + amount + typeOfTransaction + " from " + sendingName;

                sender.sendMessage(Number(names[i]._id), messageToSend);

            }

        }
        mensajesAUsuarios.splice(index, 1);
        names.length = 0;

    }





    this.callBackCheckFunds = function (idUser, sendingName, amount,receivingName, message, mensajesAUsuarios, index,funds) {

        if (funds == -1) {
            var sender = new messageSender();
            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);
            mensajesAUsuarios.splice(index, 1);
        }

        else {

            var afterTransaction = funds - Number(amount);
            var typeOfAmount = "M"

            //Si el jugador no tiene partida registrada, entonces se le avisa que tiene que crear una partida
            if (afterTransaction < 0) {
                if (funds < 1.0) {
                    typeOfAmount = "K";
                    funds *= 1000;
                }
                var sender = new messageSender();

                var messageToSend = "Sorry, you only have " + funds.toFixed(3) + typeOfAmount;
                var replymarkup = { force_reply : true, selective : true };
                sender.sendResponse(message, messageToSend, replymarkup);


            }
        //Tiene partida, se procede a obtener a todos los integrantes del juego
            else {

                var player = new Player();
                player.obtainCurrentGame3(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index,funds);

            }
        }



    }




    this.callBackSendMoney = function (idUser, name, message, idGame) {
        var sender = new messageSender();


        //Si el jugador no tiene partida registrada, entonces se le avisa que tiene que crear una partida
        if (idGame == null || idGame == -1) {

            var messageToSend = "Sorry, you are not in a game! You have to create a /newgame or /joingame!"
            sender.sendResponse(message, messageToSend);

        }
        //Tiene partida, se procede a obtener a todos los integrantes del juego
        else {
            var player = new Player();
            player.obtainPlayersInGame(idGame,message,name);
        }

    }

    this.callBackPlayersToSendMoney = function (names, message,nameUser){
        var sender = new messageSender();
        var messageToSend = "Select a player to send them money"
        //var arrayResponses = [["5M", "1M", "500K"], ["4", "5", "6"], ["1", "2", "3"], ["0"]];

        var namesArray = [];
        var keyboard= [];

        for (var i = 0; i < names.length; i++) {

            var nameOfAUser = String(names[i].name);


            if (i % 2 == 0 && i != names.length - 1) {

                if (nameOfAUser != nameUser) {
                    namesArray.push(nameOfAUser);
                }


            }

            else if (i % 2 != 0 || i == names.length - 1) {

                if (nameOfAUser != nameUser) {
                    namesArray.push(nameOfAUser);
                }
                if (namesArray.length != 0) {
                    keyboard.push(namesArray);

                    namesArray = [];
                }


            }
        }

        if (keyboard.length == 0) {
            sender.sendResponse(message, "You don't have any player in your game yet! They'll have to /joingame with the Game ID!")
        }
        else {
            var replymarkup = { keyboard: keyboard, one_time_keyboard: true, one_time_keyboard: true,selective: true };
            sender.sendResponse(message, messageToSend, replymarkup)
        }
        keyboard.length = 0;
        namesArray.length = 0;
        names.length = 0;
    }







}
