const { answerify } = require('../../utilities.js');
const { MessageEmbed, TextChannel, GuildMember } = require('discord.js');
const { EMBED_COLOR } = require('../../../config.json');
const moment = require('moment');



// Returning a channel object from a name
function getChannelFromName (msg, name) {
    if (name === 'all') return 'all';

    // Getting the channel object
    const found = msg.member.guild.channels.cache.find(channel => channel.name.includes(name.toLowerCase()));

    // If the channel is not a TextChannel
    if (!(found instanceof TextChannel)) {

        // Error
        console.log('Error : not a text channel.');
        return -1;
    }

    // If the TextChannel is not undefined, return it
    return found === undefined ? -1 : found;
}

// Returning the messages in a given channel
async function getMessagesFromChannel (channel, limit = 100) {

    let fetchedMessages = [];
    let last_id;

    console.log(`Parsing channel : ${channel.name}`);

    // Retrieving all messages in the given channel
    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        if (channel != undefined) {
            const messages = await channel.messages.fetch(options);
        
            fetchedMessages.push(...messages.array());
            last_id = messages.last().id;

            if (messages.size != 100 || fetchedMessages >= limit) {
                break;
            }
        }
    }

    // Returning the resulting array of messages
    return fetchedMessages;
}

// Returning a member object from a name
async function getPlayerFromName (msg, name) {
    if (name === 'all') return 'all';

    // Fetching the GuildMember object
    let found = (await msg.guild.members.fetch({ query: name, limit: 1 })).entries().next().value[1];
    return found === undefined ? -1 : found;
}

// Returning a moment
function getTimeFromArg (arg) {
    if (arg === 'all') return 'all';

    const now = new moment();

    // If the given argument is not a number
    if (isNaN(arg)) return -1;

    // If the given argument is not an integer
    if (!Number.isInteger(parseInt(arg))) return -2;

    // If the given argument is an integer, turn it into a number of weeks
    const weeks = parseInt(arg, 10);
    if (weeks < 1) return -3;

    // Return the resulting date
    return now.subtract(weeks, 'weeks');
}

// Parsing arguments to 'stats' command
async function parseArgs(msg, args) {

    // Return the resulting promise
    return new Promise((resolve, reject) => {

        let nbrAll = 0;
        let nbrChannel = 0;
        let nbrPlayer = 0;
        let nbrTime = 0;

        let line = {
            chan: '',
            member: '',
            time: ''
        };

        let ctr=0;

        // Parsing the arguments
        args.forEach(async arg => {

            // If the argument is 'all'
            if (arg.trim() === 'all') {

                // If there are more than one 'all' arguments
                if (++nbrAll > 1) reject('Error : Too many `all` arguments.');

                // Set all search parameters to 'all'
                line.chan = 'all';
                line.member = 'all';
                line.time = 'all';

            } else if (arg.trim().startsWith('c:')) {   // It the argument is a 'c:' argument
    
                // If there are more than one 'c:' arguments
                if (++nbrChannel > 1) reject('Error : Too many `c:` arguments.');

                // Get the channel from the given name
                const channel = getChannelFromName(msg, arg.split('c:')[1]);
    
                // If the channel wasn't found
                if (channel === -1) reject(`Sorry, I couldn't find channel \`${arg.split('c:')[1]}\`.\n\nDid you check the spelling?`);
    
                // Set the channel search parameter to this channel
                console.log(`Channel detected : \"${channel.name}\"`);
                line.chan = channel;
    
            } else if (arg.trim().startsWith('p:')) {   // If the argument is a 'p:' argument
    
                // If there are more than one 'p:' arguments
                if (++nbrPlayer > 1) reject('Error : Too many `p:` arguments.');

                // Get the GuildMember object from the given name
                const player = await getPlayerFromName(msg, arg.split('p:')[1]);
    
                // If this player wasn't found
                // TODO: catch errors
                if (player === undefined) reject(`Sorry, I couldn't find player \`${arg.split('p:')[1]}\`.\n\nDid you check the spelling?`);
    
                // Set the player search parameter to this player
                console.log(`Player detected : \"${player.displayName}\"`);
                line.member = player;
    
            } else if (arg.trim().startsWith('t:')) {   // If the argument is a 't:' argument
    
                // If there are more than one 't:' arguments
                if (++nbrTime > 1) reject('I din\'t quite catch that... There were too many `t:` arguments.');

                // Get the limit date from the given argument
                const date = getTimeFromArg(arg.split('t:')[1]);
    
                // If the resulting date isn't valid
                if (!(date instanceof moment)) reject(`Sorry, \`${arg.split('t:')[1]}\` isn't a valid number of weeks.`);
    
                // Setting the date search parameter to this date
                console.log(`Time detected : \"${date}\".`);
                line.time = date;
    
            } else reject(`Error with argument : \"${arg}\"`);  // Loging the errors

            // Resolving the search parameters
            if (++ctr == args.length) resolve(line);
        });
    })

}

// Sending back a message
async function processParameters (msg, line) {

    let sendback='**Your query:**\n';
    let fetchedMessages = [];

    // If a 'c:' argument was given
    if (line.chan != '') {

        // If the argument was 'all'
        if (line.chan === 'all') {
            sendback += 'Channel(s) : all.\n';

            // Parsing all the server's channels to which the bot has access
            for (let channel of msg.guild.channels.cache) {

                // If this channel is a TextChannel, retreive the array of messages
                if (channel[1] instanceof TextChannel) {
                    let current = await getMessagesFromChannel(channel[1]);

                    // Compile the retrieved messages
                    fetchedMessages = fetchedMessages.concat(current);
                }
            }

        } else {    // Else
            sendback += `Channel(s) : ${line.chan}\n`;

            // Retrieving the given channel's messages
            fetchedMessages = await getMessagesFromChannel(line.chan);
        }

        console.log(`Retrieved ${fetchedMessages.length} messages.`);
    }

    // If a 'p:' argument was given
    if (line.member != '') {

        // If the argument was 'all'
        if (line.member === 'all') sendback += 'Player(s) : all.\n';
        // Else
        else sendback += `Player : ${line.member.toString()}\n`;
    }

    // If a 't:' argument was given
    if (line.time != '') {

        // If the given argument was 'all'
        if (line.time === 'all') sendback += 'Time : none specified.\n';
        // Else
        else sendback += `Time : \"${line.time}\".\n`;
    }

    // Sending back the reply
    msg.reply(answerify(sendback));
}




module.exports = {
    name: "stats",
    category: "Stat",
    description: "Compiles and sends back stats.",
    execute: async (msg, args) => {


        // If there are no arguments after 'stats'
        if (args.length === 0) {
            msg.channel.send(answerify('Type `' + PREFIX + ' stats help` to get started with some stats.'));
            return;
        }


        // If the only argument after 'stats' is 'help'
        if (args[0] === 'help') {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Carson says')
                    .setColor(EMBED_COLOR)
                    .setDescription('Here is a list of heywords to use with `' + PREFIX + ' stats`.')
                    .addFields(
                    {
                        name: "**- `help`**",
                        value: "This very command. Pretty self-explanatory."
                    },
                    {
                        name: "**- `global` (optional)**",
                        value: "All stats, for the whole server. ALL. OF. IT.\n:warning: Can\'t be used with `c:<channel>.`"
                    },
                    {
                        name: "**- `c:<channel>` (optional)**",
                        value: "All stats for the given channel.\n:warning: Can\'t be used with `global`."
                    },
                    {
                        name: "**- `p:<player>` (optional)**",
                        value: "All stats for a given player."
                    },
                    {
                        name: "**- `t:<number>` (optional)**",
                        value: "Number of weeks from now to restrict the search to."
                    },
                    {
                        name: "**- `w:<word>` (optional)**",
                        value: "Counts the occurences of the word <word>.\nIn order to search for a phrase, replace spaces by `'\\ '`."
                    },
                    {
                        name: "**A few combinations :**",
                        value: "You can combine almost all of them together, except for `global` and `c:<channel>`. These do not go well together.\nHere are some examples."
                    },
                    {
                        name: "- `" + PREFIX + " stats global p:Yeetus t:3`",
                        value:  "This command will give you the stats for player 'Yeetus' over the last 3 weeks."
                    },
                    {
                        name: "- `" + PREFIX + " stats w:lit\\ fam c:general`",
                        value: "This command will give you the number of occurence of the phrase \'lit fam\' in the channel \'general\'."
                    })
            );

            return;
        }
        
        
        // Actually get the stats on the args
        try {
            processParameters(msg, await parseArgs(msg, args));
        } catch (error) {

            // In case of an error, report it
            msg.reply(answerify(error));
        }
    }
};