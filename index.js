const { Client, Collection } = require('discord.js');
const { DEFAULT_PERMS, DEFAULT_PREFIX, DEFAULT_WS_SYMBOL } = require('./config.json');
const { answerify, logMessage, permCheck, removeWhitespaceFromArray } = require('./js/utilities.js');
const { config } = require('dotenv');
const { readFileSync } = require('fs');



// Initializing bot
const bot = new Client();
bot.commands = new Collection();
bot.aliases = new Collection();



// Setting globals
PLAYER_PERMS = DEFAULT_PERMS;


// Loading commands
["command"].forEach(handler => {
    console.log('Loading commands...');
    require(`./js/handler/${handler}`)(bot);
    console.log('Commands loaded.');
});


// Setting path to .env
config({
    path: __dirname + "/.env"
});







// On bot start-up
bot.on('ready', () => {

    // Display status
    console.log('Bot online.');

    // Set bot's activity
    bot.user.setActivity(
        'Benur write my code',
        { type: "WATCHING" }
    );
});




// On message detection
bot.on('message', async message => {

    // If the message is a Direct Message
    if (message.channel.type === "dm") {
        message.author.send(answerify("Sorry, I only respond in servers !"));
        return;
    }



    // Getting this server's prefix, if there isn't one, set it to DEFAULT_PREFIX
    let prefixes = JSON.parse(readFileSync("./prefixes.json", "utf8"));
    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: DEFAULT_PREFIX
        };
    }
    PREFIX = prefixes[message.guild.id].prefix;



    // Getting this server's whitespace identifier, if there isn't one, set it to DEFAULT_WS_SYMBOL
    let ws = JSON.parse(readFileSync("./ws-symbols.json", "utf8"));
    if (!ws[message.guild.id]) {
        ws[message.guild.id] = {
            symbol: DEFAULT_WS_SYMBOL
        };
    }
    WS_SYMBOL = ws[message.guild.id].symbol;




    // Setting the permissions to look from
    const perms = PLAYER_PERMS;


    // Logging the message in the console
    logMessage(message);




    // Detecting commands destined to this bot in messages
    if (!message.content.startsWith(PREFIX.trim()) || message.author.bot) return;


    // Decomposing the message into arguments
    var args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    args = removeWhitespaceFromArray(args, WS_SYMBOL);
    
    
    // Converting the arguments to a command
    var cmd = args.shift().toLowerCase();

    
    // Detecting only the prefix
    if (cmd === "") cmd = 'start';


    // Getting the command function
    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));


    // Triggering command according to 1st argument after prefix
    switch(cmd) {

        // Detected 'help'
        case 'help':

            if (permCheck(cmd, message, perms)) {
                console.log(">>Executing 'help' command.");
                command.execute(message);
            }
            break;
        

        // Detected 'ping'
        case 'ping':

            if (permCheck(cmd, message, perms)) {
                console.log(">>Executing 'ping' command.");
                command.execute(message, bot);
            }
            break;
        

        // Detected 'prefix'
        case 'prefix':
            
            if (permCheck(cmd, message, perms)) {
                console.log(">>Executing 'prefix' command.");
                command.execute(message, args);
            }
            break;


        // Detected 'reset'
        case 'reset':

            if (permCheck(cmd, message, perms)) {
                console.log(">>Executing 'reset' command.");
                command.execute(message);
            }
            break;


        // Detected 'setspace'
        case 'setspace':

            if(permCheck(cmd, message, perms)) {
                console.log(">>Executing 'setspace' command.");
                command.execute(message, args);
            }
            break;


        // Detected 'stats'
        case 'stats':

            if (permCheck(cmd, message, perms)) {
                console.log(">>Executing 'stats' command.");
                command.execute(message, args);
            }
            break;


        // Detected 'help'
        case 'start':

            if (permCheck(cmd, message, perms)) {
                console.log(">>Executing 'help' command.");
                command.execute(message);
            }
            break;
    }
});




// On error
bot.on('error', err => {

    // Log error in console
    console.error(err);
});





// Login in the bot with the TOKEN
bot.login(process.env.TOKEN);


// Exports
module.exports = {
    BOT: bot,
};