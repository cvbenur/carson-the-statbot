const { Client, Collection } = require('discord.js');
const { DEFAULT_PERMS, DEFAULT_PREFIX, DEFAULT_WS_SYMBOL } = require('./config.json');
const { answerify, logMessage, permCheck, removeWhitespaceFromArray } = require('./js/utilities.js');
const { config } = require('dotenv');


// Initializing Firebase storage
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

// DB credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://carson-the-statbot.firebaseio.com"
});


// Initializing database
let db = admin.firestore();




// Initializing bot
const bot = new Client();
bot.commands = new Collection();
bot.aliases = new Collection();



// Setting globals
const OWNER = process.env.OWNER;
var PLAYER_PERMS = DEFAULT_PERMS;


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






// Handling events
// On bot start-up
bot.on('ready', () => {

    // Set bot's activity
    bot.user.setActivity(
        'Benur write my code',
        { type: "WATCHING" }
    );


    // Display status
    console.log('Bot online.');
});




// On message detection
bot.on('message', async message => {

    // If the message is a Direct Message
    if (message.channel.type === "dm") {
        message.author.send(answerify("Sorry, I only respond in servers !"));
        return;
    }


    // Setting the permissions to look from
    const perms = PLAYER_PERMS;


    // Logging the message in the console
    logMessage(message);




    // Getting the current Guild data from the database
    let currentGuildEntry = db.collection('guilds').doc(message.guild.id);
    let guildData;
    currentGuildEntry.get().then((query) => {


        // If the requested Guild exists in the database, setting current guildData to the retrieved data
        if (query.exists) guildData = query.data();


    }).then(() => {     // Once the current Guild's data has been retrieved


        // Detecting commands destined to this bot in messages
        if (!message.content.startsWith(guildData.prefix.trim()) || message.author.bot) return;

    


        // Decomposing the message into arguments
        var args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
        args = removeWhitespaceFromArray(args, guildData.wsSymbol);


        // Converting the arguments to a command
        var cmd = args.shift().toLowerCase();





        // Detecting only the prefix
        if (cmd === "") cmd = 'start';


        // Getting the command's function
        let command = bot.commands.get(cmd);
        if (!command) command = bot.commands.get(bot.aliases.get(cmd));





        // Triggering command according to 1st argument after prefix
        switch(cmd) {

            // Detected 'help'
            case 'help':

                if (permCheck(cmd, message, perms)) {
                    console.log(">>Executing 'help' command.");
                    command.execute(message, guildData);
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
                    command.execute(message, args, currentGuildEntry, guildData);
                }
                break;


            // Detected 'reset'
            case 'reset':

                if (permCheck(cmd, message, perms)) {
                    console.log(">>Executing 'reset' command.");
                    command.execute(message, currentGuildEntry);
                }
                break;


            // Detected 'setspace'
            case 'setspace':

                if(permCheck(cmd, message, perms)) {
                    console.log(">>Executing 'setspace' command.");
                    command.execute(message, args, currentGuildEntry, guildData);
                }
                break;


            // Detected 'stats'
            case 'stats':

                if (permCheck(cmd, message, perms)) {
                    console.log(">>Executing 'stats' command.");
                    command.execute(message, args, guildData);
                }
                break;


            // Detected 'help'
            case 'start':

                if (permCheck(cmd, message, perms)) {
                    console.log(">>Executing 'help' command.");
                    command.execute(message, guildData);
                }
                break;

            default:
                message.reply(answerify(`Sorry, I didn't recognise the command **\`${cmd}\`**.\nMaybe it wasn't meant for me ?\n**\*Stares passive-agressively\***`));
        }

        // End of command execution


    }).catch((error) => {     // In case of an error

        // Logging error in console
        console.error(error);
        message.reply(answerify("There seems to be an error. Please contact support.\n\n" + error));

    });
});




// On error
bot.on('error', err => {

    // Log error in console
    console.error(err);
});




// On guild join
bot.on('guildCreate', async newGuild => {

    // Create new entry in the database for this Guild
    db.collection('guilds').doc(newGuild.id).set({
        'guildId': newGuild.id,
        'guildName': newGuild.name,
        'guildOwner': newGuild.owner.user.username,
        'guildOwnerId': newGuild.owner.id,
        'memberCount': newGuild.memberCount,
        'prefix': DEFAULT_PREFIX,
        'wsSymbol': DEFAULT_WS_SYMBOL
    });
});




// On guild update
bot.on('guildUpdate', async (oldGuild, newGuild) => {

    // Update this guild's entry in the database
    db.collection('guilds').doc(oldGuild.id).update({
        'guildName': newGuild.name,
        'guildOwner': newGuild.owner.user.username,
        'guildOwnerId': newGuild.owner.id
    });
});




// On guild member removal
bot.on('guildMemberRemove', async member => {

    // Update the guild's member count in the database
    db.collection('guilds').doc(member.guild.id).update({

        'memberCount': member.guild.memberCount

    });
});




// On guild member addition
bot.on('guildMemberAdd', async member => {

    // Update the guild's member count in the database
    db.collection('guilds').doc(member.guild.id).update({

        'memberCount': member.guild.memberCount

    });
});






// Login in the bot with the TOKEN
bot.login(process.env.TOKEN);


// Exports
module.exports = {
    BOT: bot,
};