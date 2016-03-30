module.exports = Game;
var DBConnection = require('../connection/DBConnection');
var ControllerNewGame = require('../controllers/ControllerNewGame');
var ControllerJoinGame = require('../controllers/ControllerJoinGame');

function Game() {

    this.idGame = -1;
    this.createNewGame = function (idUser, name, message) {

        var unNum;
        this.db = DBConnection.GetDB();
        this.juego = this.db.collection('juego');

        var ops = [];
        this.juego.insert({ _id: idUser }, function(err, docInserted) {
            var controllerGame = new ControllerNewGame();
            if (err) {

                controllerGame.callBackGameCreated(idUser, name, message, -1);
            }
            else {
                ops = docInserted.ops;
                controllerGame.callBackGameCreated(idUser, name, message, ops[0]._id);
            }

        });

    }

    this.deleteGame = function (idGame) {


        this.db = DBConnection.GetDB();
        this.juego = this.db.collection('juego');
        this.juego.remove({ _id: idGame });

    }

    this.searchGame = function (idGame, idUser, completeName, message) {

        this.db = DBConnection.GetDB();
        this.juego = this.db.collection('juego');

        var controllerGame = new ControllerJoinGame();

        this.juego.findOne({ _id: Number(idGame) }, function (err, item) {
            if (item == null || item.length == 0) {
                controllerGame.callBackExistGame(-1, idUser, completeName, message);
            }

            else {
                var id = item._id;
                controllerGame.callBackExistGame(id, idUser, completeName, message);
            }



        });

    }






}
