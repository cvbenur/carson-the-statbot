const { Client, Collection } = require('discord.js');
const { DEFAULT_PERMS, DEFAULT_PREFIX } = require('./config.json');
const Util = require('./js/utilities.js');
const { config } = require('dotenv');
const { readFileSync } = require('fs');



// Initializing bot
const bot = new Client();
bot.commands = new Collection();
bot.aliases = new Collection();

PLAYER_PERMS = DEFAULT_PERMS;

["command"].forEach(handler => {
    console.log('Loading commands...');
    require(`./js/handler/${handler}`)(bot);
    console.log('Commands loaded.');
});




config({
    path: __dirname + "/.env"
});





// On bot start-up
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




// Detecting messages
bot.on('message', async message => {

    // If the message is a Direct Message
    if (message.channel.type === "dm") {
        message.author.send(Util.answerify("Sorry, I only respond in servers !"));
        return;
    }



    let prefixes = JSON.parse(readFileSync("./prefixes.json", "utf8"));

    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: DEFAULT_PREFIX
        };
    }

    PREFIX = prefixes[message.guild.id].prefix;


    const perms = PLAYER_PERMS;

    // Logging the message in the console
    Util.logMessage(message);




    // Detecting commands destined to this bot in messages
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;


    // Decomposing the message into arguments
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    var cmd = args.shift().toLowerCase();

    
    // Detecting only the prefix
    if (cmd === "") cmd = 'start';


    // Getting the command function
    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));


    // Triggering command according to 1st argument after prefix
    switch(cmd) {

        // Detected 'help'
        case 'start':

            if (Util.permCheck(cmd, message.member.guild.me, perms)) {
                console.log(">>Executing 'help' command.");
                command.execute(message);
            } else {
                message.channel.send(Util.permDenied(perms));
            }
            break;


        // Detected 'help'
        case 'help':

            if (Util.permCheck(cmd, message.member.guild.me, perms)) {
                console.log(">>Executing 'help' command.");
                command.execute(message);
            } else {
                message.channel.send(Util.permDenied(perms));
            }
            break;
        

        // Detected 'ping'
        case 'ping':

            if (Util.permCheck(cmd, message.member.guild.me, perms)) {
                console.log(">>Executing 'ping' command.");
                command.execute(message);
            } else {
                message.channel.send(Util.permDenied(perms));
            }
            break;
        

        // Detected 'prefix'
        case 'prefix':
            
            if (Util.permCheck(cmd, message.member.guild.me, perms)) {
                console.log(">>Executing 'prefix' command.");
                command.execute(message, args);
            } else {
                message.channel.send(Util.permDenied(perms));
            }
            break;


        // Detected 'reset'
        case 'reset':

            if (Util.permCheck(cmd, message.member.guild.me, perms)) {
                console.log(">>Executing 'reset' command.");
                command.execute(message);
            } else {
                message.channel.send(Util.permDenied(perms));
            }
            break;


        // Detected 'stats'
        case 'stats':

            if (Util.permCheck(cmd, message.member.guild.me, perms)) {
                console.log(">>Executing 'stats' command.");
                command.execute(message, args);
            } else {
                message.channel.send(Util.permDenied(perms));
            }
            break;
    }
});



// Getting bot's token
bot.login(process.env.TOKEN);