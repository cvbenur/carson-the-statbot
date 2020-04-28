const Util = require('../../utilities.js');
const { DEFAULT_PREFIX } = require('../../../defaultConfig.json');


var PREFIX;


// Changing the prefix for this server
async function setPrefix (guildEntry, newPref) {

    // Updating this Guild's prefix in the database
    guildEntry.update({

        'prefix': newPref

    }).then(() => {     // In case of success

        PREFIX = newPref + ' ';

    }).catch((err) => {     // In case of an error

        // Logging the error
        console.log(err);

    });
}


module.exports = {
    name: "prefix",
    category: "Setting",
    description: "Command to set or reset the bot's prefix.",
    execute: async (msg, args, guildEntry, guildData) => {

        // Retrieving current prefix for this guild
        PREFIX = guildData.prefix;


        
        // Checking the number of arguments
        switch (args.length) {

            // Setting the prefix to default prefix '-c'
            case 0:

                // Reseting the prefix
                await setPrefix(guildEntry, DEFAULT_PREFIX);
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
                    await setPrefix(guildEntry, args[0]);
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