var Bot = require('./lib/Bot');
var mensajesAUsuarios = [];
module.exports = messageSender;
function messageSender(){

    this.sendResponse = function(message,messageToSend) {
        var bot = new Bot({
            token: '115878793:AAGxAE0rwfF5p55LK2nkksofE_8qi5oXOJ4'
        });

        bot.sendMessage({
            text: messageToSend,
            reply_to_message_id: message.message_id,
            chat_id: message.chat.id
        });



    }

    this.sendResponse = function (message, messageToSend,replymarkup) {
        var bot = new Bot({
            token: '115878793:AAGxAE0rwfF5p55LK2nkksofE_8qi5oXOJ4'
        });

        bot.sendMessage({
            text: messageToSend,
            reply_to_message_id: message.message_id,
            chat_id: message.chat.id,
            reply_markup: JSON.stringify(replymarkup)
        });



    }

    this.sendMessage = function (idChat, messageToSend){
        var bot = new Bot({
            token: '115878793:AAGxAE0rwfF5p55LK2nkksofE_8qi5oXOJ4'
        });

        bot.sendMessage({
            text: messageToSend,
            chat_id: idChat
        });

    }





}


