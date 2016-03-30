module.exports = Player;
var DBConnection = require('../connection/DBConnection');
var ControllerNewGame = require('../controllers/ControllerNewGame');
var ControllerJoinGame = require('../controllers/ControllerJoinGame');
var ControllerSendMoney = require('../controllers/ControllerSendMoney');
var ControllerLeaveGame = require('../controllers/ControllerLeaveGame');
var ControllerSendEveryone = require('../controllers/ControllerSendEveryone');
var ControllerGeneralBalance = require('../controllers/ControllerGeneralBalance');
var ControllerMyBalance = require('../controllers/ControllerMyBalance');
var ControllerPayBank = require('../controllers/ControllerPayBank');
var ControllerGetPaid = require('../controllers/ControllerGetPaid');
function Player(){

    this.createNewPlayer = function (idUser, nameUser, idGameofUser){

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


            this.jugador.insert({
                _id: idUser,
                name: nameUser,
                idGame: idGameofUser,
                balance: 15.0}, function (err, item) {

                });


    };


    this.obtainCurrentGame = function (idUser, name, message){

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id: idUser }, { idGame:true,balance: true }, function (err, item) {



            if (message.text == "/newgame") {
                var controllerGame = new ControllerNewGame();
                if (item == null || item.length == 0) {
                    controllerGame.callBackNewGame(idUser, name, message, -1)
                }

                else {
                    var idGame = item.idGame;
                    controllerGame.callBackNewGame(idUser, name, message, idGame)
                }
            }
            else if (message.text == "/joingame") {
                var controllerGame = new ControllerJoinGame();
                if (item == null || item.length == 0) {
                    controllerGame.callBackJoinGame(idUser, name, message, -1)
                }

                else {
                    var idGame = item.idGame;
                    controllerGame.callBackJoinGame(idUser, name, message, idGame)
                }
            }
            else if (message.text == "/sendmoney") {

                var controllerGame = new ControllerSendMoney();
                if (item == null || item.length == 0) {
                    controllerGame.callBackSendMoney(idUser, name, message, -1)
                }

                else {

                    var idGame = item.idGame;
                    controllerGame.callBackSendMoney(idUser, name, message, idGame)
                }
            }

            else if (message.text == "/sendeveryone") {
                var controllerGame = new ControllerSendEveryone();
                if (item == null || item.length == 0) {
                    controllerGame.callBackSendEveryone(idUser, name, message, -1)
                }

                else {
                    var idGame = item.idGame;
                    controllerGame.callBackSendEveryone(idUser, name, message, idGame)
                }

            }

            else if (message.text == "/generalbalance") {
                var controllerGame = new ControllerGeneralBalance();
                if (item == null || item.length == 0) {
                    controllerGame.callBackGameExists(idUser, name, message, -1);
                }

                else {
                    var idGame = item.idGame;
                    controllerGame.callBackGameExists(idUser, name, message, idGame);
                }

            }

            else if (message.text == "/leavegame") {
                var controllerGame = new ControllerLeaveGame();
                if (item == null || item.length == 0) {
                    controllerGame.callBackLeaveGame(idUser, name, message, -1)
                }

                else {
                    var idGame = item.idGame;
                    controllerGame.callBackLeaveGame(idUser, name, message, idGame)
                }
            }

            else if (message.text == "/mybalance") {
                var controllerGame = new ControllerMyBalance();
                if (item == null || item.length == 0) {
                    controllerGame.callBackGameExists(idUser, name, message, -1,-1)
                }

                else {
                    var idGame = item.idGame;
                    var balance = item.balance;
                    controllerGame.callBackGameExists(idUser, name, message, idGame, balance)
                }
            }

            else if (message.text == "/paybank") {
                var controllerGame = new ControllerPayBank();
                if (item == null || item.length == 0) {
                    controllerGame.callBackGameExists(idUser, name, message, -1)
                }

                else {
                    var idGame = item.idGame;
                    var balance = item.balance;
                    controllerGame.callBackGameExists(idUser, name, message, idGame)
                }
            }

            else if (message.text == "/getpaid") {

                var controllerGame = new ControllerGetPaid();
                if (item == null || item.length == 0) {
                    controllerGame.callBackExistsGame(idUser, name, message, -1)
                }

                else {
                    var idGame = item.idGame;
                    var balance = item.balance;
                    controllerGame.callBackExistsGame(idUser, name, message, idGame)
                }
            }


        });


    };

    this.obtainName = function (idUser, message) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id: idUser }, { name: true }, function (err, item) {
            var controllerGame = new ControllerJoinGame();
            if (item == null) {
                controllerGame.callBackGameOwner("someone", message);
            }
            else {
              controllerGame.callBackGameOwner(item.name, message);
            }


        });


    };

    this.obtainPlayersInGame = function (idGame, message, name) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');

        this.jugador.find({ idGame: idGame }, { name: true,balance:true }).toArray(function (err, nombres) {

            if (message.text == "/leavegame") {
                var controllerGame = new ControllerLeaveGame();
                controllerGame.callBackPlayersInGame(nombres, message, name, idGame);
            }

            else if (message.text == "/generalbalance") {
                var controllerGame = new ControllerGeneralBalance();
                controllerGame.callBackPlayersInGame(nombres, message, idGame);
            }

            else if (message.text == "/join") {
                var controllerGame = new ControllerJoinGame();
                controllerGame.callBackPlayersInGame(nombres, message);
            }

            else {
                var controllerGame = new ControllerSendMoney();
                controllerGame.callBackPlayersToSendMoney(nombres, message, name);
            }


        });
    };

    this.obtainCurrentGame2 = function (idUser, sendingName, receivingName, message,mensajesAUsuarios) {

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id: idUser }, function (err, item) {
            if (item == null || item.length == 0) {
                var controllerGame = new ControllerSendMoney();
                controllerGame.callBackVerifySecondPlayer(idUser,sendingName,receivingName,-1,message, mensajesAUsuarios)
            }

            else {
                var controllerGame = new ControllerSendMoney();
                var idGame = item.idGame;
                controllerGame.callBackVerifySecondPlayer(idUser, sendingName, receivingName, idGame, message, mensajesAUsuarios)
            }





        });


    };

    //Esto ya e scon amount
    this.obtainCurrentGame3 = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance) {

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id: idUser }, function (err, item) {
            if (item == null || item.length == 0) {
                var controllerGame = new ControllerSendMoney();
                controllerGame.callBackMakeTransaction(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, -1)
            }

            else {
                var controllerGame = new ControllerSendMoney();
                var idGameObtenido = item.idGame;
                controllerGame.callBackMakeTransaction(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index,balance,idGameObtenido)
            }





        });


    };

    this.obtainCurrentGame4 = function (idUser, amount, name, message) {

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id: idUser }, function (err, item) {
            if (item == null || item.length == 0) {
                var controllerGame = new ControllerSendEveryone();
                controllerGame.callBackGotGame(idUser, amount, name, message, -1)
            }

            else {
                var controllerGame = new ControllerSendEveryone();
                var idGame = item.idGame;
                controllerGame.callBackGotGame(idUser, amount, name, message, idGame)
            }





        });


    };

    this.obtainCurrentGame5 = function (idUser, amount, name, message) {

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id: idUser },{ idGame : true, balance:true}, function (err, item) {
            if (item == null || item.length == 0) {
                var controllerGame = new ControllerPayBank();
                controllerGame.callBackGotBalance(idUser, amount, name, message, -1,-1)
            }

            else {
                var controllerGame = new ControllerPayBank();
                var idGame = item.idGame;
                var balance = item.balance;
                controllerGame.callBackGotBalance(idUser, amount, name, message, idGame,balance)
            }





        });


    };

    this.obtainCurrentGame6 = function (idUser, amount, name, message) {

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id: idUser }, { idGame : true, balance: true }, function (err, item) {
            if (item == null || item.length == 0) {
                var controllerGame = new ControllerGetPaid();
                controllerGame.callBackExistsGame2(idUser, amount, name, message, -1, -1);
            }

            else {
                var controllerGame = new ControllerGetPaid();
                var idGame = item.idGame;
                var balance = item.balance;
                controllerGame.callBackExistsGame2(idUser, amount, name, message, idGame, balance);
            }





        });


    };

    //Obtain current game WITH receiving name
    this.obtainCurrentGameWithName = function (idUser, sendingName, receivingName, idGame, message, mensajesAUsuarios){
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ name:receivingName,idGame:idGame}, function (err, item) {
            if (item == null || item.length == 0) {

                var controllerGame = new ControllerSendMoney();
                controllerGame.callBackSecondPlayerExists(idUser, sendingName, receivingName, idGame, message, mensajesAUsuarios, -1)
            }

            else {
                var controllerGame = new ControllerSendMoney();
                var idSecondOne = item._id;
                controllerGame.callBackSecondPlayerExists(idUser, sendingName, receivingName, idGame, message, mensajesAUsuarios, idSecondOne)
            }





        });

    }

    this.obtainBalance = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index){

        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ _id:idUser }, { balance: true}, function (err, item) {
            if (item == null || item.length == 0) {

                var controllerGame = new ControllerSendMoney();
                controllerGame.callBackCheckFunds(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index,-1)
            }

            else {
                var funds = item.balance;
                var controllerGame = new ControllerSendMoney();
                controllerGame.callBackCheckFunds(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, funds)
            }





        });

    }

    //Obtain current player WITH receiving name
    this.obtainPlayerWithName = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance,idGame) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.findOne({ name: receivingName, idGame: idGame }, function (err, item) {
            if (item == null || item.length == 0) {

                var controllerGame = new ControllerSendMoney();
                controllerGame.callBackMakeTransaction2(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, idGame,-1)
            }

            else {
                var controllerGame = new ControllerSendMoney();
                var idSecondOne = item._id;
                controllerGame.callBackMakeTransaction2(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance,idGame,idSecondOne)
            }





        });

    }

    //Obtain
    this.updateBalance = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index,balance,idGame, idReceiving) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        var balanceSender = balance - Number(amount);


        this.jugador.update({ _id: idUser }, {
            $set: {
                balance: balanceSender,
            }}, function (err, item) {
            if (item == null || item.length == 0) {

            }

            else {
                this.db = DBConnection.GetDB();
                this.jugador2 = this.db.collection('jugador');
                this.jugador2.update({ _id: idReceiving }, {
                    $inc: {
                        balance: Number(amount),
                    }
                }, function (err, item2) {
                    if (item2 == null || item2.length == 0) {

                    }

                    else {
                        var controllerGame = new ControllerSendMoney();
                        controllerGame.callBackFinalizeTransaction(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, idGame, idReceiving,balanceSender)
                    }

                });


            }

        });

    }

    this.obtainPlayersInGame2 = function (idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, idGame, idReceiving, balanceSender) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');

        this.jugador.find({ idGame: idGame }, { name: true,balance:true }).toArray(function (err, nombres) {
            var controllerGame = new ControllerSendMoney();
            controllerGame.callBackAlertTransaction(idUser, sendingName, amount, receivingName, message, mensajesAUsuarios, index, balance, idGame, idReceiving,nombres, balanceSender);

        });
    };

    this.obtainPlayersInGame3 = function (idUser, amount, name, message, idGame) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');

        this.jugador.find({ idGame: idGame }, { name: true,balance:true }).toArray(function (err, nombres) {
            var controllerGame = new ControllerSendEveryone();
            controllerGame.finalizeTransactions(idUser, amount, name, message, idGame, nombres)

        });
    };

    this.obtainPlayersInGame4 = function (idUser, name, idGame, sentMoney) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');

        this.jugador.find({ idGame: idGame, _id: { $ne: idUser }  }).toArray(function (err, players) {
            var controllerGame = new ControllerPayBank();
            controllerGame.callBackAlertPlayers(players, sentMoney, name);

        });
    };

    this.obtainPlayersInGame5 = function (idUser, name, idGame, sentMoney) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.find({ idGame: idGame, _id: { $ne: idUser } }).toArray(function (err, players) {
            var controllerGame = new ControllerGetPaid();

            controllerGame.callBackAlertPlayers(players, sentMoney, name);

        });
    };

    //adds money to everyone except to the one that is sending the money
    this.addMoneyToEveryone = function (idGame, amount,idUser) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');
        this.jugador.update(
            //query
            { idGame: idGame, _id: { $ne: idUser } },
            //update
            {
            $inc: {
                balance: Number(amount)
            }

            },
            //options
            {
                multi: true
            });

    }



    //
    this.decreaseMoney = function (idGame, amount, idUser) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');

        this.jugador.update(
            //query
            { idGame: idGame, _id: idUser },
            //update
            {
                $inc: {
                    balance: (-1.0*Number(amount))
                }
            });

    }

    //
    this.increaseMoney = function (idGame, amount, idUser) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');

        this.jugador.update(
            //query
            { idGame: idGame, _id: idUser },
            //update
            {
                $inc: {
                    balance: Number(amount)
                }
            });

    }

    this.leaveGame = function (idUser,name,message) {
        this.db = DBConnection.GetDB();
        this.jugador = this.db.collection('jugador');


        this.jugador.remove({ _id: idUser });


    };




}
