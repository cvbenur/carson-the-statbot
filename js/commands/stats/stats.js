const Util = require('../../utilities.js');
const Discord = require('discord.js');


module.exports = {
    name: "stats",
    category: "Stat",
    description: "Compiles and sends back stats.",
    execute (msg, args) {
        // TODO: -c stats commands


        switch (args.length) {

            // If there are no arguments after 'stats'
            case 2:
                msg.channel.send(answerify('Type `' + PREFIX + ' stats help` to get started with some stats.'));
                break;

            // If there is only 1 argument after 'stats'
            case 3:
                switch (args[2]) {

                    case 'help':
                        msg.channel.send(
                            new Discord.MessageEmbed()
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
                        break;


                    case 'global':
                        // TODO: Add 'stats global' command
                        msg.channel.send(
                            Util.WIP()
                        );


                        break;
                    
                }
                break;
        }
    }
};