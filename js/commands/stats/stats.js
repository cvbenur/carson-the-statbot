const { answerify } = require('../../utilities.js');
const { MessageEmbed, TextChannel, GuildMember } = require('discord.js');
const { EMBED_COLOR } = require('../../../config.json');
const moment = require('moment');



// Returning a channel object from a name
function getChannelFromName (msg, name) {
    if (name === 'all') return 'all';

    const found = msg.member.guild.channels.cache.find(channel => channel.name.includes(name.toLowerCase()));

    if (!(found instanceof TextChannel)) {
        console.log('Error : not a text channel.');
        return -1;
    }

    return found === undefined ? -1 : found;
}

// Returning a member object from a name
async function getPlayerFromName (msg, name) {
    if (name === 'all') return 'all';

    let found = (await msg.guild.members.fetch({ query: name, limit: 1 })).entries().next().value[1];
    return found === undefined ? -1 : found;
}

// Returning a moment
function getTimeFromArg (arg) {
    if (arg === 'all') return 'all';

    const now = new moment();

    if (isNaN(arg)) return -1;
    if (!Number.isInteger(parseInt(arg))) return -2;

    const weeks = parseInt(arg, 10);
    if (weeks < 1) return -3;

    return now.subtract(weeks, 'weeks');
}

// Sending back a message
function sendBackStats (msg, line) {
    let sendback='**Your query:**\n';

    if (line.chan != '') {
        if (line.chan === 'all') sendback += 'Channel(s) : all.\n';
        else sendback += `Channel(s) : ${line.chan}\n`;
    }

    if (line.member != '') {
        if (line.member === 'all') sendback += 'Player(s) : all.\n';
        else sendback += `Player : ${line.member.toString()}\n`;
    }

    if (line.time != '') {
        if (line.time === 'all') sendback += 'Time : none specified.\n';
        else sendback += `Time : \"${line.time}\".\n`;
    }

    msg.reply(answerify(sendback));
}

// Parsing arguments to 'stats' command
async function parseArgs(msg, args) {

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

        args.forEach(async arg => {

            if (arg.trim() === 'all') {
                if (++nbrAll > 1) reject('Error : Too many `all` arguments.');

                line.chan = 'all';
                line.member = 'all';
                line.time = 'all';
            } else if (arg.trim().startsWith('c:')) {
    
                if (++nbrChannel > 1) reject('Error : Too many `c:` arguments.');

                const channel = getChannelFromName(msg, arg.split('c:')[1]);
    
                if (channel === -1) reject(`Sorry, I couldn't find channel \`${arg.split('c:')[1]}\`.\n\nDid you check the spelling?`);
    
                console.log(`Channel detected : \"${channel.name}\"`);
                line.chan = channel;
    
            } else if (arg.trim().startsWith('p:')) {
    
                if (++nbrPlayer > 1) reject('Error : Too many `p:` arguments.');

                const player = await getPlayerFromName(msg, arg.split('p:')[1]);
    
                if (player === undefined) reject(`Sorry, I couldn't find player \`${arg.split('p:')[1]}\`.\n\nDid you check the spelling?`);
    
                console.log(`Player detected : \"${player.displayName}\"`);
                line.member = player;
    
            } else if (arg.trim().startsWith('t:')) {
    
                if (++nbrTime > 1) reject('I din\'t quite catch that... There were too many `t:` arguments.');

                const date = getTimeFromArg(arg.split('t:')[1]);
    
                if (!(date instanceof moment)) reject(`Sorry, \`${arg.split('t:')[1]}\` isn't a valid number of weeks.`);
    
                console.log(`Time detected : \"${date}\".`);
                line.time = date;
    
            } else reject(`Error with argument : \"${arg}\"`);


            if (++ctr == args.length) resolve(line);
        });
    })

}





module.exports = {
    name: "stats",
    category: "Stat",
    description: "Compiles and sends back stats.",
    execute: async (msg, args) => {


        if (args.length === 0) {
            msg.channel.send(answerify('Type `' + PREFIX + ' stats help` to get started with some stats.'));
            return;
        }


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
        
        

        try {
            sendBackStats(msg, await parseArgs(msg, args));
        } catch (error) {
            msg.reply(answerify(error));
        }
    }
};