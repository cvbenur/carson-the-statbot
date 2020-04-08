const Discord = require('discord.js');

module.exports = {
    name: "start",
    category: "Info",
    description: "The basic help command.",
    execute: async (msg) => {
        msg.channel.send(new Discord.MessageEmbed()
            .setTitle('Carson says')
            .setColor("#FFFFFF")
            .setDescription('Just type `' + PREFIX + ' help` to get started.')
        );
    }
};