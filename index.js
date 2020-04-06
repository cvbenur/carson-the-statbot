const Discord = require('discord.js');
const Commands = require('./commands.js');
const token = require('./token.js')


const bot = new Discord.Client();
bot.login(TOKEN);


bot.on('ready', () => {
    console.log('Bot online.');
})


// Detecting messages
bot.on('message', message => {
    
    // Decomposing the message into arguments
    let args = message.content.split(" ");

    // Detecting commands destined to this bot in messages
    if (args[0] === PREFIX) {

        if (args.length === 1) {

            // Detected prefix only
            Commands.start(message);

        } else {
            
            // Detecting arguments
            switch(args[1]) {
                case 'ping':
                    Commands.pong(message);
                    break;

                case 'help':
                    Commands.help(message);
                    break;

                case 'stats':
                    Commands.stats(message);
                    break;
            }
        }
    }
})