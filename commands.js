const Discord = require('discord.js');

function answerify(text) {
    return new Discord.MessageEmbed().setTitle('StatBot says').setDescription(text).setColor(0xffffff);
}


module.exports = {
    const: PREFIX = '-',


    // Reacting to 'ping' command
    pong: function (msg) {
        switch(Math.floor(Math.random() * 6) + 1) {
            case 0:
                msg.channel.send(answerify('Pong!'));
                break;
            
            case 1:
                msg.channel.send(answerify('\'Ping\' yourself!'));
                break;

            case 2:
                msg.channel.send(answerify('Oh, I\'m fine, thanks for asking...'));
                break;

            case 3:
                msg.channel.send(answerify('Well, well, well, who do we have here! Here\'s your \'Pong\', kind stranger!'));
                break;

            case 4:
                msg.channel.send(answerify('Nope. Not saying it. Just because I don\'t want to.'));
                break;

            case 5:
                msg.channel.send(answerify('**\*Suddenly wakes up\***\nWh- What? Nope, not sleeping! Definitely wasn\'t sleeping !'));
        }
    },


    // Reacting to 'help' command
    help: function (msg) {
        msg.channel.send(answerify(':warning: Work in progress... Come back later !'));
    },


    // Reacting to 'stats' command
    stats: function (msg) {

        // Decomposing the message into arguments
        let args = msg.content.substring(PREFIX.length).split(" ");


        switch (args[1]) {
            case 'help':
                msg.channel.send(answerify(':warning: Work in progress... Come back later !'));
                break;
        }
    }
};