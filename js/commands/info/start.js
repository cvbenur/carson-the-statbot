const { answerify } = require('../../utilities.js');



module.exports = {
    name: "start",
    category: "Info",
    description: "The basic help command.",
    execute: async (msg) => {
        msg.channel.send(answerify('Just type `' + PREFIX.trim() + ' help` to get started.'));
    }
};