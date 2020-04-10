const Util = require('../../utilities.js');
const { readFileSync, writeFileSync } = require('fs');
const { DEFAULT_PREFIX } = require('../../../config.json');


// Changing the prefix for this server
function setPrefix (id, newPref) {

    let prefixes = JSON.parse(readFileSync("./prefixes.json", "utf8"));

    prefixes[id] = {
        prefix: newPref + ' '
    };

    writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
    });

    PREFIX = newPref + ' ';
}


module.exports = {
    name: "prefix",
    category: "Setting",
    description: "Command to set or reset the bot's prefix.",
    execute: (msg, args) => {
        
        // Checking the number of arguments
        switch (args.length) {

            // Setting the prefix to default prefix '-c'
            case 0:

                // Reseting the prefix
                setPrefix(msg.guild.id, DEFAULT_PREFIX);
                console.log('>>Prefix set to default prefix : \'' + PREFIX.trim() + '\'.');

                msg.channel.send(
                    Util.answerify('Resetting my prefix to \'`' + PREFIX.trim() + '`\'.\nI\'ll only answer to this now. Don\'t even try.')
                );
                break;


            // Setting the prefix to the new prefix
            case 1:

                // If the new prefix is already the current prefix
                if (args[2] === PREFIX) {

                    msg.channel.send(
                        Util.answerify('Uhm... That\'s already my prefix.\nDid you not realize this as you were typing this very command ?')
                    );

                } else {

                    // Setting the prefix to the new phrase
                    setPrefix(msg.guild.id, args[0]);
                    console.log('>>Prefix set to : \'' + PREFIX.trim() + '\'.');

                    msg.channel.send(
                        Util.answerify('Gotcha ! I will now only answer to `' + PREFIX.trim() +'`.\nForget eeeeverything else...\n**\*Stares into the distance\***')
                    );
                }
                break;
        }
    },



    setPrefix
};