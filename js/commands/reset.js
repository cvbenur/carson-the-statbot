const config = require('./config.json');
const fs = require('fs');



// Reseting prefix to default
function resetPrefix (id) {
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
        
    prefixes[id] = {
        prefix: config.DEFAULT_PREFIX
    };

    fs.writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
    });

    PREFIX = config.DEFAULT_PREFIX;
}



module.exports = {
    name: "reset",
    description: "Resets Carson's configuration to default.",
    execute(guildId) {

        resetPrefix(id);
        
    }
};