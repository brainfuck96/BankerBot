//Importo todas las dependencias que ocuparé
var Bot = require('./lib/Bot');
var ControllerNewGame = require('./controllers/ControllerNewGame');
var ControllerJoinGame = require('./controllers/ControllerJoinGame');
var ControllerLeaveGame = require('./controllers/ControllerLeaveGame');
var ControllerSendMoney = require('./controllers/ControllerSendMoney');
var ControllerSendEveryone = require('./controllers/ControllerSendEveryone');
var ControllerGeneralBalance = require('./controllers/ControllerGeneralBalance');
var ControllerMyBalance = require('./controllers/ControllerMyBalance');
var ControllerPayBank = require('./controllers/ControllerPayBank');
var ControllerGetPaid = require('./controllers/ControllerGetPaid');
var messageSender = require('./messageSender');
var mensajesAUsuarios = [];
require('./connection/DBConnection').InitDB();
var bot = new Bot({
    token: '115878793:AAGxAE0rwfF5p55LK2nkksofE_8qi5oXOJ4'
}).on('message', function (message) {

var user = message.from;
    //El id del usuario es unico
    var idUser = user.id;
    var firstName = user.first_name;

    if (firstName == null || firstName == "" || firstName == " ") {
        if (user.username != null && user.username != "") {
            firstName = user.username;
        }
        else {
            firstName = "The Guy With No Name";
        }

    }

    var lastName = user.last_name;

    if (lastName == null || lastName == "" || lastName == " ") {
        lastName ="\u00A0";
    }

    var completeName = firstName + " " + lastName;
    var mainMessage = message.text;

    if (mainMessage != null && mainMessage.length!=0) {
        var arrayMessage = mainMessage.split(" ");
    }
    var sender = new messageSender();
    var messageReply = message.reply_to_message;
    var index = search(idUser, mensajesAUsuarios);
    if (mainMessage == null) {
        bot.sendMessage({
            text: "I can manage all of your Monopoly transactions!",
            reply_to_message_id: message.message_id,
            chat_id: message.chat.id
        });
    }

    else {

        var messageReply = message.reply_to_message;
        do {
            var repetir = false;
            if (arrayMessage.length - 1 == 0) {

                //Si hace un nuevo juego, lo hago y obtengo el id
                //que me de mongodb
                if (mainMessage == "/newgame") {
                    //Creo el juego
                    var controllerGame = new ControllerNewGame();
                    controllerGame.createNewGame(idUser, completeName, message);

                }

            //Si hace un nuevo juego, lo hago y obtengo el id
            //que me de mongodb
            else if (mainMessage == "/joingame") {
                var controllerGame = new ControllerJoinGame();
                controllerGame.joinGame(idUser, completeName, message);


            }


            //Apartado para mandar dinero entre jugadores
            else if (mainMessage == "/sendmoney") {

                var controllerGame = new ControllerSendMoney();
                controllerGame.sendMoney(idUser, completeName, message);

            }

            else if (mainMessage == "/sendeveryone") {
                var controllerGame = new ControllerSendEveryone();
                controllerGame.sendEveryoneMoney(idUser, completeName, message);
            }

            //Apartado para ver el balance actual del jugador
            else if (mainMessage == "/mybalance") {
                var controllerGame = new ControllerMyBalance();
                controllerGame.myBalance(idUser, completeName, message);

            }

            //Apartado para ver el balance de todos
            else if (mainMessage == "/generalbalance") {
                var controllerGame = new ControllerGeneralBalance();
                controllerGame.generalBalance(idUser, completeName, message);

            }

            //Apartado para pagarle al banco
            else if (mainMessage == "/paybank") {
                var controllerGame = new ControllerPayBank();
                controllerGame.payBank(idUser, completeName, message);

            }
            else if (mainMessage == "/getpaid" && (message.reply_to_message == null)) {
                var controllerGame = new ControllerGetPaid();
                controllerGame.getPaid(idUser, completeName, message);

            }


             //Apartado para dejar el juego actua
             else if (mainMessage == "/leavegame") {
                var controllerGame = new ControllerLeaveGame();
                controllerGame.leaveGame(idUser, completeName, message);

            }

            else if (mainMessage == "/help") {
                var messageToSend = "I'm a banker, and I'll help you with all your Monopoly transactions! Start a /newgame (this will create a new game ID) or /joingame (you need a friend's game ID!).\r\nRemember that I'm just a helper, you will still need to gather your friends to play the physical board Monopoly, but now you won't have to count any bills again!\r\n\r\nSo if you joined a friend's game, or someone joined your game, you can do the following operations:\r\n/sendmoney : that's for sending money to another player!\r\n/sendeveryone : for sending money to everyone in the game!\r\n/getpaid : to receive money from the bank \r\n/paybank : to get the bank remove you an amount of money \r\n/leavegame : to leave the current game. \r\n\r\n NOTE: Every action you do will be forwarded to every player in the game! So if you get paid 20M from the bank, all of the players will receive that info!"
                sender.sendResponse(message, messageToSend);

            }

            else if (mainMessage == "/start") {
                var messageToSend = "Alright! Start a /newgame (this will create a new game ID) or /joingame (you need a friend's game ID!).\r\n\r\n"+
                "If you create a new game, that game will be associated to you. So if you leave your own game, but there are players still in there, you won 't be able to create a new game (but you will still be able to join others' games, and you can also join your own game),"+
                "UNTIL every player in the game leaves. Remember: You can only be in one game at a time.\r\n \r\nAlso, I'm just a helper, you will still need to gather your friends to play the physical board Monopoly, but now you won't have to count any bills again!"
                sender.sendResponse(message, messageToSend);
            }
            //Entonces es un reply
            else {
                if (messageReply != null) {
                    if (messageReply.text== "Alright, enter the game's ID (I recommend you to copy-paste it!)" ||
                        (messageReply.text).substring(0,16) == "Sorry, the game ") {
                        if (isNaN(mainMessage)) {
                            var messageToSend = "The game ID must be entirely numerical!)"
                            sender.sendResponse(message,messageToSend);
                        }
                        else {
                            var controllerGame = new ControllerJoinGame();
                            //Si existe el juego, se añade al jugador en la partida
                            controllerGame.gameExists(mainMessage, idUser, completeName, message);
                            }

                    }

                        else if (messageReply.text == "Sorry, you are already in a game! You have to /leavegame to create a new one!") {
                            messageReply = null;
                            repetir = true;

                        }

                        else if (messageReply.text == "How much money do you want to send to each player? (200k,1.5m,etc)") {

                            var amountMoney = mainMessage.substring(0, mainMessage.length - 1);

                            if (Number(amountMoney)) {
                                //M o K

                                var controllerGame = new ControllerSendEveryone();
                                if (!isNaN(mainMessage)) {
                                    var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc)"
                                    sender.sendResponse(message, messageToSend);
                                }
                                else {
                                    var typeOfTransaction = mainMessage.substring(mainMessage.length - 1, mainMessage.length)

                                    if (typeOfTransaction == "M" || typeOfTransaction == "m") {
                                        controllerGame.sendMoneyToEveryone(idUser, amountMoney, completeName, message);
                                    }
                                    else if (typeOfTransaction == "K" || typeOfTransaction == "k") {
                                        var amountMoneyConverted = Number(amountMoney) / 1000.0;

                                        controllerGame.sendMoneyToEveryone(idUser,amountMoneyConverted,completeName,message);

                                    }

                                    else {
                                        var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc)"
                                        sender.sendResponse(message, messageToSend);
                                    }
                                }


                            }
                            else {
                                var messageToSend = "Please enter a numerical amount before the K (thousands) or M (millions) (100k, 2M, etc)"
                                sender.sendResponse(message, messageToSend);
                            }
                        }

                        else if (messageReply.text == "How much money do you want to send to the bank? (200k,1.5m,etc)") {
                            var amountMoney = mainMessage.substring(0, mainMessage.length - 1);

                            if (Number(amountMoney)) {
                                //M o K

                                var controllerGame = new ControllerPayBank();
                                if (!isNaN(mainMessage)) {
                                    var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc)"
                                    sender.sendResponse(message, messageToSend);
                                }
                                else {
                                    var typeOfTransaction = mainMessage.substring(mainMessage.length - 1, mainMessage.length)
                                    if (typeOfTransaction == "M" || typeOfTransaction == "m") {
                                        controllerGame.payAmount(idUser, amountMoney, completeName, message);
                                    }
                                    else if (typeOfTransaction == "K" || typeOfTransaction == "k") {
                                        var amountMoneyConverted = Number(amountMoney) / 1000.0;

                                        controllerGame.payAmount(idUser, amountMoneyConverted, completeName, message);

                                    }

                                    else {
                                        var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc)"
                                        sender.sendResponse(message, messageToSend);
                                    }
                                }


                            }
                            else {
                                var messageToSend = "Please enter a numerical amount before the K (thousands) or M (millions) (100k, 2M, etc)"
                                sender.sendResponse(message, messageToSend);
                            }
                        }

                        else if (messageReply.text == "How much money do you want to receive from the bank? (200k,1.5m,etc)") {
                            var amountMoney = mainMessage.substring(0, mainMessage.length - 1);

                            if (Number(amountMoney)) {
                                //M o K

                                var controllerGame = new ControllerGetPaid();
                                if (!isNaN(mainMessage)) {
                                    var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc)"
                                    sender.sendResponse(message, messageToSend);
                                }
                                else {
                                    var typeOfTransaction = mainMessage.substring(mainMessage.length - 1, mainMessage.length)
                                    if (typeOfTransaction == "M" || typeOfTransaction == "m") {
                                        controllerGame.getPaidAmount(idUser, amountMoney, completeName, message);
                                    }
                                    else if (typeOfTransaction == "K" || typeOfTransaction == "k") {
                                        var amountMoneyConverted = Number(amountMoney) / 1000.0;

                                        controllerGame.getPaidAmount(idUser, amountMoneyConverted, completeName, message);

                                    }

                                    else {
                                        var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc)"
                                        sender.sendResponse(message, messageToSend);
                                    }
                                }


                            }
                            else {
                                var messageToSend = "Please enter a numerical amount before the K (thousands) or M (millions) (100k, 2M, etc)"
                                sender.sendResponse(message, messageToSend);
                            }
                        }

                        else if (((messageReply.text).substring(0, 47) == "Alright, how much money do you want to send to ")
                            ||  ((messageReply.text).substring(0, 21) == "Sorry, you only have ")) {


                            //var messageToSend = "Say what? I couldn't recognize what you just did.)"
                            //sender.sendResponse(message, messageToSend);

                            var controllerGame = new ControllerSendMoney();
                            //Si esta en mensajesAUsuarios, eso significa que está esperando una transaccion
                            if (index != -1) {

                                var receivingName = mensajesAUsuarios[index].receivingName;


                                var amountMoney = mainMessage.substring(0, mainMessage.length - 1);
                                if (Number(amountMoney)) {
                                    //M o K

                                    if (!isNaN(mainMessage)) {
                                        var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc). Try again by pressing /sendmoney one more time!"
                                        sender.sendResponse(message, messageToSend);
                                        mensajesAUsuarios.splice(index);
                                    }
                                    else {
                                        var typeOfTransaction = mainMessage.substring(mainMessage.length - 1, mainMessage.length)

                                        if (typeOfTransaction == "M" || typeOfTransaction == "m") {
                                            controllerGame.makeTransaction(idUser, completeName, amountMoney, receivingName, message, mensajesAUsuarios, index);
                                        }
                                        else if (typeOfTransaction == "K" || typeOfTransaction == "k") {
                                            var amountMoneyConverted = Number(amountMoney) / 1000.0;

                                            controllerGame.makeTransaction(idUser, completeName, amountMoneyConverted, receivingName, message, mensajesAUsuarios, index);

                                        }

                                        else {
                                            var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc). Try again by pressing /sendmoney one more time!"
                                            sender.sendResponse(message, messageToSend);
                                            mensajesAUsuarios.splice(index);
                                        }
                                    }


                                }
                                else {
                                    var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc). Try again by pressing /sendmoney one more time!"
                                    sender.sendResponse(message, messageToSend);
                                    mensajesAUsuarios.splice(index);
                                }


                            }

                            else {
                                var receivingName = mainMessage;
                                var messageType = { receivingName: receivingName, idSender: idUser };
                                mensajesAUsuarios.push(messageType);
                                controllerGame.sendMoney2(idUser, completeName, receivingName, message, mensajesAUsuarios);
                            }
                        }
                    }

                    else {


                        //Si esta en mensajesAUsuarios, esto significa que está esperando una transaccion
                        if (index != -1) {
                            var messageToSend = "Sorry, I didn't understand that. Try using /help!"
                            sender.sendResponse(message, messageToSend);
                            mensajesAUsuarios.splice(index);
                        }

                        else {
                            var messageToSend = "Sorry, I didn't understand that. Try using /help!"
                            sender.sendResponse(message, messageToSend);
                        }
                    }
                }
            }

            else if (arrayMessage.length - 1 >= 1) {

                if (arrayMessage[0] == "/joingame") {
                    var messageToSend = "Just press /joingame! I'll ask you for the game's ID after that!"
                    sender.sendResponse(message, messageToSend);
                }

                //var messageToSend = "Say what? I couldn't recognize what you just did.)"
                //sender.sendResponse(message, messageToSend);
                else {
                    var controllerGame = new ControllerSendMoney();
                    //Si esta en mensajesAUsuarios, eso significa que está esperando una transaccion
                    if (index != -1) {

                        var receivingName = mensajesAUsuarios[index].receivingName;
                        var amountMoney = mainMessage.substring(0, mainMessage.length - 1);
                        if (Number(amountMoney)) {
                            //M o K
                            var typeOfTransaction = mainMessage.substring(mainMessage.length - 1, mainMessage.length)

                            if (typeOfTransaction == "M") {
                                controllerGame.makeTransaction(idUser, nombreCompleto, amountMoney, receivingName, message, mensajesAUsuarios, index);
                            }
                            else if (typeOfTransaction == "K") {
                                var amountMoneyConverted = Number(amountMoney) / 1000.0;

                                controllerGame.makeTransaction(idUser, nombreCompleto, amountMoneyConverted, receivingName, message, mensajesAUsuarios, index);

                            }

                            else {
                                var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc). Try again by pressing /sendmoney one more time!"
                                sender.sendResponse(message, messageToSend);
                                mensajesAUsuarios.splice(index);
                            }
                        }
                        else {
                            var messageToSend = "If you want to send money, use 'm' for millions and 'k' for thousands at the end (200k, 1m, etc). Try again by pressing /sendmoney one more time!"
                            sender.sendResponse(message, messageToSend);
                            mensajesAUsuarios.splice(index);
                        }


                    }

                    else {
                        var receivingName = mainMessage;
                        var messageType = { receivingName: receivingName, idSender: idUser };
                        mensajesAUsuarios.push(messageType);
                        controllerGame.sendMoney2(idUser, completeName, receivingName, message, mensajesAUsuarios);
                    }
                }
            }
        }while(repetir);
    }

})
.start();

function search(subject, objects) {


    var i = 0;
    var aux;
    var encontro = false;

    if (objects.length == 0) {

        return -1;
    }

    do {
        if (objects[i].idSender == subject) {

            encontro = true;
            aux = i;
        }

        i++;
    } while(i < objects.length && !encontro);

    if (encontro) {
        return aux;
    }

    else {
        return -1;
    }

};
