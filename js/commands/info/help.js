const { MessageEmbed } = require('discord.js');
const { EMBED_COLOR } = require('../../../config.json');

module.exports = {
    name: "help",
    category: "Info",
    description: "Gives you a list of useful commands for Carson.",
    execute: async (msg, guildData) => {
        msg.channel.send(
            new MessageEmbed()
            .setTitle('Carson the StatBot')
            .setColor(EMBED_COLOR)
            .setDescription('Carson is an easy to use - although VERY sassy - statistics compiling bot for your Discord server.\n\nHe can pretty much tell you anything you might want to know, with pretty, easy-to-read little graphs.')
            .addFields(
                // TODO: Link 'help' to a web page
                { name: '**Commands**',                         value:'Here is a list of commands you can give Carson.\n\n\n' },
                { name: 'Help',                                 value: 'If you need any help with one of Carson\'s commands, simply type `' + guildData.prefix.trim() + ' help`.\n\n' },
                { name: 'Stats',                                value: 'There are many things you can do with Carson in terms of stats.\nIn order to get a list of stats commands for Carson, simply type `' + guildData.prefix.trim() + ' stats help`.' }
            )
        );
    }
};