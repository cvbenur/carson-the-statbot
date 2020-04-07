const Discord = require('discord.js');
const Commands = require('./js/commands.js');
const config = require('./config.json');
const Util = require('./js/utilities.js');



// Initializing bot
const bot = new Discord.Client();
bot.login(config.TOKEN);


// Initializing global variables
PREFIX = config.DEFAULT_PREFIX;
console.log('Default prefix loaded.');

PLAYER_PERMS = config.DEFAULT_PLAYER_PERMS;
console.log('Default permissions loaded.');





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
    if (args.length === 1) {    // Detected prefix only

        if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.talk)) {
            console.log(">>Executing 'start' command.");
            Commands.start.execute(message);
        } else {
            Util.permDenied(PLAYER_PERMS.talk);
        }

    } else {

        // Triggering command according to 1st argument after prefix
        switch(args[1]) {

            // Detected 'ping'
            case 'ping':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.pong)) {
                    console.log(">>Executing 'ping' command.");
                    Commands.pong.execute(message);
                } else {
                    Util.permDenied(PLAYER_PERMS.pong);
                }
                
                break;

            // Detected 'help'
            case 'help':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.help)) {
                    console.log(">>Executing 'help' command.");
                    Commands.help.execute(message);
                } else {
                    Util.permDenied(PLAYER_PERMS.help);
                }
                break;

            // Detected 'stats'
            case 'stats':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.stats)) {
                    console.log(">>Executing 'stats' command.");
                    Commands.stats.execute(message, args);
                } else {
                    Util.permDenied(PLAYER_PERMS.stats);
                }
                break;

            // Detected 'prefix'
            case 'prefix':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.prefix)) {
                    console.log(">>Executing 'prefix' command.");
                    Commands.prefix.execute(message, args);
                } else {
                    Util.permDenied(PLAYER_PERMS.prefix);
                }
        }
    }
})