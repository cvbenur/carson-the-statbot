const Util = require('../../utilities.js');

module.exports = {
    name: 'ping',
    category: "Info",
    description: 'Ping command',
    execute(msg) {
        switch(Math.floor(Math.random() * 6) + 1) {
            case 0:
                msg.channel.send(Util.answerify('Pong!'));
                break;
            
            case 1:
                msg.channel.send(Util.answerify('\'Ping\' yourself!'));
                break;

            case 2:
                msg.channel.send(Util.answerify('Oh, I\'m fine, thanks for asking...'));
                break;

            case 3:
                msg.channel.send(Util.answerify('Well, well, well, who do we have here! Here\'s your \'Pong\', kind stranger!'));
                break;

            case 4:
                msg.channel.send(Util.answerify('Nope. Not saying it. Just because I don\'t want to.'));
                break;

            case 5:
                msg.channel.send(Util.answerify('**\*Suddenly wakes up\***\nWh- What? Nope, not sleeping! Definitely wasn\'t sleeping !'));
        }
    }
};