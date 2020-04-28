const { answerify } = require('../../utilities.js')
const { setPrefix } = require('./prefix.js');
const { setWhitespaceSymbol } = require('./setspace.js');
const { DEFAULT_PREFIX, DEFAULT_WS_SYMBOL } = require('../../../defaultConfig.json');




module.exports = {
    name: "reset",
    category: "Setting",
    description: "Resets Carson's configuration to default.",
    execute: async (msg, guildEntry) => {

        await setPrefix(guildEntry, DEFAULT_PREFIX);
        await setWhitespaceSymbol(guildEntry, DEFAULT_WS_SYMBOL);
        
        msg.channel.send(answerify("**Reset Carson's settings to default.**\nPrefix : `" + DEFAULT_PREFIX.trim() + "`\nWhitespace identifier : `" + DEFAULT_WS_SYMBOL + "`"));
    }
};