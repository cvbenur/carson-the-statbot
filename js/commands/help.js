const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Gives you a list of useful commands for Carson.",
    execute (msg) {
        msg.channel.send(
            new Discord.MessageEmbed()
            .setTitle('Carson the StatBot')
            .setColor("#FFFFFF")
            .setDescription('Carson is an easy to use - although VERY sassy - statistics compiling bot for your Discord server.\n\nHe can pretty much tell you anything you might want to know, with pretty, easy-to-read little graphs.')
            .addFields(
                // TODO: Link 'help' to a web page
                { name: '**Commands**',                         value:'Here is a list of commands you can give Carson.\n\n\n' },
                { name: 'Help',                                 value: 'If you need any help with one of Carson\'s commands, simply type `' + PREFIX + ' help`.\n\n' },
                { name: 'Stats',                                value: 'There are many things you can do with Carson in terms of stats.\nIn order to get a list of stats commands for Carson, simply type `' + PREFIX + ' stats help`.' }
            )
        );
    }
};