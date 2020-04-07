const Discord = require('discord.js');
const fs = require('fs');
const Run = require('./js/run.js');
const config = require('./config.json');
const Util = require('./js/utilities.js');



// Initializing bot
const bot = new Discord.Client();
bot.login(config.TOKEN);


bot.on('ready', () => {
    console.log('Bot online.');
})

PLAYER_PERMS = config.DEFAULT_PERMS;




// Detecting messages
bot.on('message', message => {

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: config.DEFAULT_PREFIX
        };
    }

    PREFIX = prefixes[message.guild.id].prefix;



    // Logging the message in the console
    Util.logMessage(message);


    // Detecting commands destined to this bot in messages
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    
    

    // Decomposing the message into arguments
    let args = message.content.split(" ");


    // Running the commands
    if (args.length === 1) {    // Message is the prefix only

        Run.command(message, 'start');

    } else {

        // Triggering command according to 1st argument after prefix
        switch(args[1]) {

            // Detected 'help'
            case 'help':
                Run.command(message, 'help');
                break;
            
            // Detected 'ping'
            case 'ping':
                Run.command(message, 'ping');
                break;
            
            // Detected 'prefix'
            case 'prefix':
                Run.command(message, 'prefix', args);
                break;

            // Detected 'stats'
            case 'stats':
                Run.command(message, 'stats', args);
                break;
        }
    }
})