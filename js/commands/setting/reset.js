const config = require('../../../config.json');
const Util = require('../../utilities.js')
const { readFileSync, writeFileSync } = require('fs');



// Reseting prefix to default
function resetPrefix (id) {
    let prefixes = JSON.parse(readFileSync("./prefixes.json", "utf8"));
        
    prefixes[id] = {
        prefix: config.DEFAULT_PREFIX
    };

    writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
    });

    PREFIX = config.DEFAULT_PREFIX;
}



module.exports = {
    name: "reset",
    category: "Setting",
    description: "Resets Carson's configuration to default.",
    execute: async (msg) => {

        resetPrefix(msg.member.guild.id);
        
        msg.channel.send(Util.answerify("Reset Carson's settings to default."));
    }
};