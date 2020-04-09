const { answerify, WIP } = require('../../utilities.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');



function getChannelFromName(msg, name) {
    const found = msg.member.guild.channels.cache.find(channel => channel.name.includes(name.toLowerCase()));

    if (found === undefined) return -1;
    return found;
}


function getPlayerFromName(msg, name) {
    const found = msg.guild.members.fetch(player => player.name.toLowerCase().includes(name.toLowerCase()));

    if (found.id === undefined) return -1;
    return found;
}


function getTimeFromArg(arg) {
    const now = new moment();

    if (isNaN(arg)) return -1;
    if (!Number.isInteger(parseInt(arg))) return -2;

    const weeks = parseInt(arg, 10);
    if (weeks < 1) return -3;

    return now.subtract(weeks, 'weeks');
}





module.exports = {
    name: "stats",
    category: "Stat",
    description: "Compiles and sends back stats.",
    execute: async (msg, args) => {

        let hasGlobal = false;
        let hasChannel = false;
        let hasPlayer = false;
        let hasTime = false;


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


        args.forEach(arg => {

            if (arg.trim().startsWith('c:')) {

                hasChannel = true;
                const channel = getChannelFromName(msg, arg.split('c:')[1]);

                if (channel === -1) {
                    console.log('Error : channel not found.');
                    return;
                }

            } else if (arg.trim().startsWith('p:')) {

                hasPlayer = true;
                const player = getPlayerFromName(msg, arg.split('p:')[1]);

                if (player === -1) {
                    console.log('Error : player not found.');
                    return;
                }

                console.log(`Player detected : ${player.name}`);

            } else if (arg.trim().startsWith('t:')) {

                hasTime = true;
                const date = getTimeFromArg(arg.split('t:')[1]);

                if (!(date instanceof moment)) {

                    switch (date) {

                        case -1:
                            console.log('Error : time is not a number.');
                            break;

                        case -2:
                            console.log('Error : time is not an integer.');
                            break;

                        case -3:
                            console.log('Error : time is inferior to 1.');
                            break;
                    }

                    return;
                }

            } else if (arg.trim() === 'global') {

                hasGlobal = true;
                console.log('Global detected');

            } else {

                console.log(`Error with argument : ${arg}`);
                return;

            }
        });

        if (hasChannel && hasGlobal) {
            console.log(`Error : channel && global.`);
            return;
        }
    }
};