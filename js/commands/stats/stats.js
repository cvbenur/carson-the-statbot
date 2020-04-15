const { answerify } = require('../../utilities.js');
const { MessageEmbed, TextChannel } = require('discord.js');
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

    const { BOT } = require('../../../index.js');

    let guild = (Array.from(BOT.guilds.cache.entries())).find(a => a[1] === channel.guild)[1];

    let fetchedMessages = [];
    let last_id;

    // Retrieving all messages in the given channel
    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        if (channel != undefined) {

            const condition = (guild.me.roles.highest.permissionsIn(channel)).has('VIEW_CHANNEL');

            if (condition) {

                const messages = await channel.messages.fetch(options).catch(error => {console.log(error);});


                fetchedMessages.push(...messages.array());
                last_id = messages.last().id;


                if (messages.size != 100 || fetchedMessages >= limit) {
                    break;
                }

            } else break;
        }
    }

    console.log(`Parsed channel ${channel.name},\tRetrieved : ${fetchedMessages.length}.`);




    // Returning the resulting array of messages
    return fetchedMessages;
}


// Returning a member object from a name
function getPlayerFromName (msg, name) {
    if (name.toLowerCase() === 'all') return 'all';

    let found = undefined;

    // Getting the guild member
    found = msg.guild.members.cache.find(member => {
        return member.displayName.toLowerCase().includes(name) ||
        member.user.tag.toLowerCase().includes(name);
    });

    // If the member wasn't found
    return found === undefined ? -1 : found;
}


// Retrieving all players from server
async function getMembersFromGuild(guild) {

    // Fetch Collection of GuildMembers
    let found = Array.from((await guild.members.fetch()).entries());


    if (found === undefined) return -1;

    // Putting it into a single level array
    let members = [];
    found.forEach(array => {
        members.push(array[1]);
    });

    return members
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
        let nbrWords = 0;

        let line = {
            chan: '',
            member: '',
            time: '',
            word: ''
        };

        let ctr=0;

        // Parsing the arguments
        args.forEach(async arg => {

            // If the argument is 'all'
            if (arg.trim() === 'all') {

                // If there are more than one 'all' arguments
                if (++nbrAll > 1) reject('Error : Too many **`all`** arguments.');

                // Set all search parameters to 'all'
                line.chan = 'all';
                line.member = 'all';
                line.time = 'all';

            } else if (arg.trim().startsWith('c:')) {   // It the argument is a 'c:' argument
    
                // If there are more than one 'c:' arguments
                if (++nbrChannel > 1) reject('Error : Too many **`c:`** arguments.');

                // Get the channel from the given name
                const channel = getChannelFromName(msg, arg.split('c:')[1]);
    
                // If the channel wasn't found
                if (channel === -1) reject(`Sorry, I couldn't find channel **\`${arg.split('c:')[1]}\`**.\n\nDid you check the spelling?`);
    
                // Set the channel search parameter to this channel
                console.log(`Channel to look for : \"${channel.name}\"`);
                line.chan = channel;
    
            } else if (arg.trim().startsWith('p:')) {   // If the argument is a 'p:' argument
    
                // If there are more than one 'p:' arguments
                if (++nbrPlayer > 1) reject('Error : Too many **`p:`** arguments.');

                // Get the GuildMember object from the given name
                const player = getPlayerFromName(msg, (arg.split('p:')[1]).toLowerCase());
    

                // If this player wasn't found
                // FIXME: catch errors
                if (player === -1) reject(`Sorry, I couldn't find player **\`${arg.split('p:')[1]}\`**.\n\nDid you check the spelling?`);
    
                // Set the player search parameter to this player
                console.log(`Player to look for : \"${player.displayName}\"`);
                line.member = player;
    
            } else if (arg.trim().startsWith('t:')) {   // If the argument is a 't:' argument
    
                // If there are more than one 't:' arguments
                if (++nbrTime > 1) reject('I din\'t quite catch that... There were too many **`t:`** arguments.');

                // Get the limit date from the given argument
                const date = getTimeFromArg(arg.split('t:')[1]);
    
                // If the resulting date isn't valid
                if (!(date instanceof moment)) reject(`Sorry, **\`${arg.split('t:')[1]}\`** isn't a valid number of weeks.`);
    
                // Setting the date search parameter to this date
                console.log(`Time to limit by : \"${date}\".`);
                line.time = date;
    
            } else if (arg.trim().startsWith('w:')) {   // If the argument is a 'w:' argument

                // If there are more than one 'w:' arguments
                if (++nbrWords > 1) reject('Oops, too many **`w:`** arguments in your message...');

                // Get the word from the given argument
                const word = arg.trim().split('w:')[1].trim();

                // If the resulting word is either '' or undefined
                if (word === '' || word === undefined) reject('Sorry, there seems to be something wrong with this phrase.');

                // Setting the word search parameter to this word
                console.log(`Phrase to look for : **\`${word}\`**.`);
                line.word = word;

            }else reject(`I'm sorry, I can't quite recognise the argument **\`${arg}\`**.\nCould you try again?`);  // Loging the errors

            ctr++;

            // If no channel and no player were specified, set both to 'all'
            if (nbrChannel === 0 && nbrPlayer === 0) {
                line.chan = 'all';
                line.member = 'all';
            }

            // If no channel was specified but a player was, set channel to 'all'
            if (nbrChannel === 0 && nbrPlayer > 0) line.chan = 'all';
            
            // If no player was specified but a channel was, set player to 'all'
            if (nbrPlayer === 0 && nbrChannel > 0) line.member = 'all';

            // If no time was specified, set time to 'all'
            if (nbrTime === 0) line.time = 'all';

            // Resolving the search parameters
            if (ctr === args.length) resolve(line);
        });
    })
}


// Sending back a message
async function processParameters (msg, line) {

    let search = {
        messages: [],
        members: [],
        date: '',
        word: ''
    }

    // If a 'c:' argument was given
    if (line.chan != '') {

        // If the argument was 'all'
        if (line.chan === 'all') {

            // Parsing all the server's channels to which the bot has access
            for (let channel of msg.guild.channels.cache) {

                // If this channel is a TextChannel, retreive the array of messages
                if (channel[1] instanceof TextChannel) {
                    let current = await getMessagesFromChannel(channel[1]);

                    // Compile the retrieved messages
                    search.messages = search.messages.concat(current);
                }
            }

        } else {    // Else

            // Retrieving the given channel's messages
            search.messages = search.messages.concat(await getMessagesFromChannel(line.chan));
        }

        console.log(`Retrieved ${search.messages.length} messages in total.`);
    }

    // If a 'p:' argument was given
    if (line.member != '') {

        // If the argument was 'all'
        if (line.member === 'all') {

            // Get an array of GuildMember objects from all the players in this guild
            search.members = await getMembersFromGuild(msg.guild);

        } else {    // Else

            // Getting the GuildMember object from the given player 
            search.members.push(line.member);
        }
    }

    // If a 't:' argument was given
    if (line.time != '') {

        // If the given argument was 'all'
        if (line.time === 'all') search.date = line.time;
        // Else
        else search.date = line.time.toDate();
    }


    if (line.word != '') search.word = line.word;
    else search.word = undefined;



    // Computing the stats and sending back the reply
    return compileThemStats(msg, search);
}



// Compute number of occurences in string
function occurrences (message, phrase, allowOverlapping) {
    message += "";
    phrase += "";
    if (phrase.length <= 0) return (message.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : phrase.length;

    while (true) {
        pos = message.indexOf(phrase, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}


// FIXME: 80msg diff between fetched and parsed when specifying only word
// Compiling basic stats
function compileThemStats (msg, search) {
    
    const messages = search.messages;
    const members = search.members;
    const word = search.word;
    let maxDate;


    if (search.date === 'all') maxDate = new moment(msg.guild.createdAt);
    else maxDate = new moment(search.date);


    let memberStatsArray = {
        stats: new Array(),
        channels: new Array(),
        nbrMsg: 0,
        word: word,
        nbrWrd: 0,
        time: search.date === 'all' ? 'all' : maxDate.format("dddd, MMM Do YYYY, HH:mm:ss A")
    };


    let messageAlreadyParsed = new Array();

    
    members.forEach(member => {

        // Creating a memberStat object
        let memberStat = {
            // The User object
            member: member,

            // The number of messages the User sent
            msgCtr: 0,

            // The number of times the User said the phrase
            wordCtr: 0,

            // The total time period over witch the messages are parsed
            joinGuildOn: moment(member.joinedAt)
        };



        // Parsing the messages
        for (msg of messages) {

            let wordContained = 0;


            // If this channel hasn't already been parsed once, add it to the array
            if (!memberStatsArray.channels.some(c => c === msg.channel)) memberStatsArray.channels.push(msg.channel);



            let createMoment = moment(msg.createdAt);

            let editMoment;
            if (msg.editedAt === null) editMoment = createMoment;
            else editMoment = moment(msg.editedAt);



            // If the message has NOT already been parsed
            if (!(messageAlreadyParsed.some(m => m === msg))) {


                // If the message was created (or last edited) within the specified date parameters
                if (createMoment.isAfter(maxDate) || editMoment.isAfter(maxDate)) {


                    // If the content of the message is not empty or if the message is not a pure embed
                    if (msg.content != "") {


                        // If the member is the author of this message
                        if (msg.author === member.user) {

                            // Increment msgCtr for this user
                            memberStat.msgCtr++;


                            if (word != undefined) {

                                // Find the number of occurences of the phrase in the message
                                wordContained = occurrences(msg.content.toLowerCase(), word.toLowerCase(), false);
                            }

                            // Increment wrdCtr by number found
                            memberStat.wordCtr += wordContained;

                            // Put it in the 'already parsed' array in order not to parse it twice
                            messageAlreadyParsed.push(msg);

                        } else {    // The current member is not the current message's author

                            // If there is only one member to analyze
                            if (members.length === 1) {

                                // Put it in the 'already parsed' array in order not to parse it twice
                                messageAlreadyParsed.push(msg);
                            }
                        }

                    } else {

                        // Put it in the 'already parsed' array in order not to parse it twice
                        messageAlreadyParsed.push(msg);
                    }

                } else {

                    // Put it in the 'already parsed' array in order not to parse it twice
                    messageAlreadyParsed.push(msg);
                }

            }   // Else, message has already been parsed, ignore it
        }


        // Increment the total number of occurences found by the number found for this user
        memberStatsArray.nbrWrd += memberStat.wordCtr;

        // Pushing the resulting memberStat into the stats array
        memberStatsArray.stats.push(memberStat);
    });



    // Putting the number of parsed messages in the array
    memberStatsArray.nbrMsg = messageAlreadyParsed.length;



    // Returning the compiled stats
    return memberStatsArray;
}


// Deducting from compiled stats
function deduceFromStats (memberStatsArray) {

    // Pre-writing the reply to send back
    let sendback = '**Your query:**\n';

    if (memberStatsArray.channels.length === 1) sendback += `Channel(s) : **\`${memberStatsArray.channels[0].name}\`**.\n`;
    else sendback += `Channel(s) : **\`all\`**.\n`;

    if (memberStatsArray.stats.length === 1) sendback += `Player(s) : **${memberStatsArray.stats[0].member.toString()}**.\n`;
    else sendback += `Player(s) : **\`all\`**.\n`;

    if (memberStatsArray.time === 'all') sendback += `Time limit given : **\`none\`**.\n`;
    else sendback += `Time limit given : **\`${memberStatsArray.time}\`**.\n`;

    if (memberStatsArray.word != undefined) sendback += `Phrase to look for : **\`${memberStatsArray.word}\`**.\n`;
    else sendback += `Phrase to look for : **\`none\`**.\n`;





    // Object containing the final stats to render
    let finalStats = {

        // Total number of channels
        nbrChnls: memberStatsArray.channels.length,

        // Total number of players
        nbrPlyrs: memberStatsArray.stats.length,

        // Total number of messages analyzed
        nbrMsgs: memberStatsArray.nbrMsg,

        // Total number of occurences of the phrase in the array
        nbrWrd: memberStatsArray.nbrWrd,

        // TODO: Add other stats
    };




    // Writing the results
    sendback += '\n**Results:**\n';

    // Writing the number of players and messages analyzed
    sendback += `**\`${finalStats.nbrPlyrs}\`** player(s) selected.\n`;
    sendback += `**\`${finalStats.nbrMsgs}\`** message(s) analyzed over **\`${finalStats.nbrChnls}\`** channel(s).\n\n`;


    // If a specific player was selected, sendback the number of msgs/user
    if (memberStatsArray.stats.length === 1) {
        sendback += `${memberStatsArray.stats[0].member.toString()} has sent **\`${memberStatsArray.stats[0].msgCtr}\`** of **\`${finalStats.nbrMsgs}\`** messages analyzed (**\`${Number.parseFloat(memberStatsArray.stats[0].msgCtr*100/finalStats.nbrMsgs).toPrecision(4)}%\`**).\n\n`;
    }



    // If there was a word to search for
    if (memberStatsArray.word != undefined) {

        // If the word was found anywhere
        if (finalStats.nbrWrd > 0) {
            sendback += `**\`${finalStats.nbrWrd}\`** occurence(s) were found for the phrase : **\`${memberStatsArray.word}\`**.\n`;

            // Who said it how many times ?
            memberStatsArray.stats.forEach(stat => {
                if (stat.wordCtr > 0) sendback += `- ${stat.member.toString()} : **\`${stat.wordCtr}\`** of **\`${finalStats.nbrWrd}\`** (**\`${Number.parseFloat(stat.wordCtr*100/finalStats.nbrWrd).toPrecision(4)}%\`** of occurences).\n`;

            });

        // Else, the word wasn't found anywhere
        } else sendback += `No occurences were found for the phrase : **\`${memberStatsArray.word}\`**.\n`;
    }



    // Returning the final message
    return sendback;
}




module.exports = {
    name: "stats",
    category: "Stat",
    description: "Compiles and sends back stats.",
    execute: async (msg, args) => {


        // If there are no arguments after 'stats'
        if (args.length === 0) {
            msg.channel.send(answerify('Type `' + PREFIX.trim() + ' stats help` to get started with some stats.'));
            return;
        }


        // If the only argument after 'stats' is 'help'
        if (args[0] === 'help') {
            msg.reply(
                new MessageEmbed()
                    .setTitle('Carson says')
                    .setColor(EMBED_COLOR)
                    .setDescription('Here is a list of heywords to use with `' + PREFIX.trim() + ' stats`.')
                    .addFields(
                    {
                        name: "**- `help`**",
                        value: "This very command. Pretty self-explanatory."
                    },
                    {
                        name: "**- `c:<channel>` (optional)**",
                        value: "All stats for the given channel.\nFor all channels, either don't specify any, or just type **`c:all`**."
                    },
                    {
                        name: "**- `p:<player>` (optional)**",
                        value: "All stats for a given player.\nFor all players, either don't specify any, or just type **`p:all`**."
                    },
                    {
                        name: "**- `t:<number>` (optional)**",
                        value: "Number of weeks ago to restrict the search to.\nFor all time, either don't specify any, or just type **`t:all`**."
                    },
                    {
                        name: "**- `w:<word>` (optional)**",
                        value: "Counts the occurences of the word <word>.\nIn order to search for a phrase, replace spaces by **`" + WS_SYMBOL + " `**.\nExample below."
                    },
                    {
                        name: "**A few examples :**",
                        value: "You can combine almost all of them together.\nHere are some examples."
                    },
                    {
                        name: "- `" + PREFIX.trim() + " stats c:all p:Yeetus t:3`",
                        value:  "This command will give you the stats for player **`Yeetus`** over the last **`3`** weeks."
                    },
                    {
                        name: "- `" + PREFIX.trim() + " stats w:lit\\ fam c:general`",
                        value: "This command will give you the number of occurence of the phrase **`lit fam`** in channel **`general`**."
                    })
            );

            return;
        }
        
        
        // Telling the user that the query is being processed
        const reply = await msg.reply(answerify('Gotcha! This may take a while, please give me a moment :stopwatch:'));

        // Actually get the stats on the args
        try {

            // Getting the compiled stats
            const computedStats = await processParameters(msg, await parseArgs(msg, args));

            // Deducing from stats and replying with result
            reply.edit(answerify(deduceFromStats(computedStats)));

        } catch (error) {

            // In case of an error, report it
            reply.edit(answerify(error));
        }
    }
};