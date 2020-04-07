const Discord = require('discord.js');

module.exports = {
    name: "start",
    description: "The basic help command.",
    execute (msg) {
        msg.channel.send(new Discord.MessageEmbed()
            .setTitle('Carson says')
            .setColor("#FFFFFF")
            .setDescription('Just type `' + PREFIX + ' help` to get started.')
        );
    }
};