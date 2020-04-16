const { answerify } = require('../../utilities.js');



module.exports = {
    name: "start",
    category: "Info",
    description: "The basic help command.",
    execute: async (msg, guildData) => {
        msg.channel.send(answerify('Just type `' + guildData.prefix.trim() + ' help` to get started.'));
    }
};