const { answerify } = require('../../utilities.js');
const { MessageEmbed, TextChannel } = require('discord.js');
const moment = require('moment');



// Returning a channel object from a name
function getChannelFromName (msg, name) {
    if (name === 'all') return 'global';

    const found = msg.member.guild.channels.cache.find(channel => channel.name.includes(name.toLowerCase()));

    if (!(found instanceof TextChannel)) {
        console.log('Error : not a text channel.');
        return -1;
    }

    return found === undefined ? -1 : found;
}

// Returning a member object from a name
async function getPlayerFromName (msg, name) {
    if (name === 'all') return 'global';

    let found = (await msg.guild.members.fetch({ query: name, limit: 1 })).entries().next().value[1];
    return found === undefined ? -1 : found;
}

// Returning a moment
function getTimeFromArg (arg) {
    if (arg === 'all') return 'global';

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
        if (line.chan === 'global') sendback += 'Channel(s) : all.\n';
        else sendback += `Channel(s) : ${line.chan}\n`;
    }

    if (line.member != '') {
        if (line.member === 'global') sendback += 'Player(s) : all.\n';
        else sendback += `Player : ${line.member.toString()}\n`;
    }

    if (line.time != '') {
        if (line.time === 'global') sendback += 'Time : none specified.\n';
        else sendback += `Time : \"${line.time}\".\n`;
    }

    msg.channel.send(answerify(sendback));
}

// Parsing arguments to 'stats' command
async function parseArgs(msg, args) {

    return new Promise((resolve, reject) => {

        let hasGlobal = false;
        let hasChannel = false;
        let hasPlayer = false;
        let hasTime = false;

        let line = {
            chan: '',
            member: '',
            time: ''
        };

        let ctr=0;

        args.forEach(async arg => {

            if (args.length === 1 && arg.trim() === 'all') {
                line.chan = 'global';
                line.member = 'global';
                line.time = 'global';
            } else if (arg.trim().startsWith('c:')) {
    
                hasChannel = true;
                const channel = getChannelFromName(msg, arg.split('c:')[1]);
    
                if (channel === -1) reject(`Error : channel \"${arg.split('c:')}\"not found.`);
    
                console.log(`Channel detected : \"${channel.name}\"`);
                line.chan = channel;
    
            } else if (arg.trim().startsWith('p:')) {
    
                hasPlayer = true;
                const player = await getPlayerFromName(msg, arg.split('p:')[1]);
    
                if (player === -1) reject(`Error : player ${arg.split('p:')} not found.`);
    
                console.log(`Player detected : \"${player.displayName}\"`);
                line.member = player;
    
            } else if (arg.trim().startsWith('t:')) {
    
                hasTime = true;
                const date = getTimeFromArg(arg.split('t:')[1]);
    
                if (!(date instanceof moment)) reject('Wrong argument for time.');
    
                console.log(`Time detected : \"${date}\".`);
                line.time = date;
    
            } else reject(`Error with argument : \"${arg}\"`);


            if (++ctr == args.length) resolve(line);
        });

        if (hasChannel && hasGlobal) {
            reject(`Error : channel && global.`);
        }
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
                    .setColor("#FFFFFF")
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
            console.log(error);
        }
    }
};