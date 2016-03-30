//Connection Singleton

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'monopolydb';

var DBConnection = function () {
};

module.exports = DBConnection;

DBConnection.GetDB = function () {
    if (typeof DBConnection.db === 'undefined') {
        DBConnection.InitDB();
    }
    return DBConnection.db;
}

DBConnection.InitDB = function () {
    DBConnection.db = new Db(dbName, new Server(dbHost, dbPort, {}, {}), { safe: false, auto_reconnect: true });

    DBConnection.db.open(function (e, d) {
        if (e) {

        } else {

        }
    });
}

DBConnection.Disconnect = function () {
    if (DBConnection.db) {
        DBConnection.db.close();
    }
}

DBConnection.BsonIdFromString = function (id) {
    var mongo = require('mongodb');
    var BSON = mongo.BSONPure;
    return new BSON.ObjectID(id);
}
