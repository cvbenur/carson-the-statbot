const Discord = require('discord.js');
const Run = require('./js/run.js');
const botconfig = require('./config.json');
const Util = require('./js/utilities.js');
const { config } = require('dotenv');



// Initializing bot
config({
    path: __dirname + "/.env"
});

const bot = new Discord.Client();


bot.on('ready', () => {
    console.log('Bot online.');

    bot.user.setPresence({
        status: "online",
        game: {
            name: "Getting my code all written up!",
            type: "WATCHING"
        }
    });
})

PLAYER_PERMS = botconfig.DEFAULT_PERMS;




// Detecting messages
bot.on('message', message => {

    if (message.channel.type === "dm") {
        message.author.send(Util.answerify("Sorry, I only respond in servers !"));
        return;
    }

    let prefixes = JSON.parse(Util.fs.readFileSync("./prefixes.json", "utf8"));

    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: botconfig.DEFAULT_PREFIX
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

            // Detected 'reset'
            case 'reset':
                Run.command(message, 'reset');
                break;

            // Detected 'stats'
            case 'stats':
                Run.command(message, 'stats', args);
                break;
        }
    }
});



// Getting bot's token
bot.login(process.env.TOKEN);