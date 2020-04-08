const config = require('../../../config.json');
const Util = require('../../utilities.js')



// Reseting prefix to default
function resetPrefix (id) {
    let prefixes = JSON.parse(Util.fs.readFileSync("./prefixes.json", "utf8"));
        
    prefixes[id] = {
        prefix: config.DEFAULT_PREFIX
    };

    Util.fs.writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
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