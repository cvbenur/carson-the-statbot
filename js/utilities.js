const Discord = require('discord.js');

module.exports = {
    answerify (text) {
        return new Discord.MessageEmbed()
            .setTitle('Carson says')
            .setColor(0xffffff)
            .setDescription(text);
    },
    WIP () {
        return this.answerify(':warning: Work in progress... Come back a bit later !');
    }
};