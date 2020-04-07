const Discord = require('discord.js');
const Commands = require('./js/commands.js');
const config = require('./config.json');
const Util = require('./js/utilities.js');



// Initializing bot
const bot = new Discord.Client();

bot.login(config.TOKEN);
PREFIX = config.DEFAULT_PREFIX;

bot.on('ready', () => {
    console.log('Bot online.');
})





// Detecting messages
bot.on('message', message => {

    // Logging the message in the console
    Util.logMessage(message);


    // Detecting commands destined to this bot in messages
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    
    

    // Decomposing the message into arguments
    let args = message.content.split(" ");


    // Running the commands
    if (args.length === 1) {

        // Detected prefix only
        Commands.start.execute(message);

    } else {

        // Triggering command according to 1st argument after prefix
        switch(args[1]) {

            // Detected 'ping'
            case 'ping':
                console.log(">>Executing 'ping' command.");
                Commands.pong.execute(message);
                break;

            // Detected 'help'
            case 'help':
                console.log(">>Executing 'help' command.");
                Commands.help.execute(message);
                break;

            // Detected 'stats'
            case 'stats':
                console.log(">>Executing 'stats' command.");
                Commands.stats.execute(message, args);
                break;

            // Detected 'prefix'
            case 'prefix':
                // TODO: Check permissions for message sender
                
                console.log(">>Executing 'prefix' command.");
                Commands.prefix.execute(message, args);
        }
    }
})