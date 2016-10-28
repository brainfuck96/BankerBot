//Connection Singleton

var mongodb = require('mongodb');
var Server = require('mongodb').Server;
var mongojs = require('mongojs')
var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'monopolydb';
var uri = "mongodb://heroku_f21mqg65:mrqnk4n957sik8afck4lqoae02@ds137207.mlab.com:37207/heroku_f21mqg65";
var DBConnection = function () {
};
var db;
module.exports = DBConnection;

DBConnection.GetDB = function () {
    if (typeof DBConnection.db === 'undefined') {
        DBConnection.InitDB();
    }
    return db;
}

DBConnection.InitDB = function () {

  db = mongojs(uri)
}

DBConnection.Disconnect = function () {
    if (db) {
        db.close();
    }
}

DBConnection.BsonIdFromString = function (id) {
    var mongo = require('mongodb');
    var BSON = mongo.BSONPure;
    return new BSON.ObjectID(id);
}
