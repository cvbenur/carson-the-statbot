const Discord = require('discord.js');
const Commands = require('./commands.js');


const bot = new Discord.Client();

const token = 'Njk2MzM0MjAzNDkwNjY0NDYw.XonTBw.2naCmujCQGpnU96BmohgCrZDc-w';


bot.on('ready', () => {
    console.log('Bot online.');
})


// Detecting messages
bot.on('message', message => {

    // Detecting commands destined to this bot in messages
    if (message.content.charAt(0) === PREFIX) {

        // Decomposing the message into arguments
        let args = message.content.substring(PREFIX.length).split(" ");

        // Detecting arguments
        switch(args[0]) {
            case 'ping':
                Commands.pong(message);
                break;

            case 'help':
                // TODO: Implement 'help' command
                
                break;

            case 'stats':
                Commands.stats(message);
                break;
        }
    }
})


bot.login(token);