const { answerify } = require('../../utilities.js');
const { DEFAULT_WS_SYMBOL } = require('../../../defaultConfig.json');


var WS_SYMBOL;


// Set whitespace symbol for this guild
async function setWhitespaceSymbol (guildEntry, newSymbol) {
    
    // Updating the Guild's prefix in the database
    guildEntry.update({

        'wsSymbol': newSymbol

    }).then(() => {     // In case of success

        WS_SYMBOL = newSymbol;

    }).catch((err) => {     // In case of an error

        // Logging the error
        console.error(err);

    });
}



module.exports = {
    name: "setspace",
    category: "Setting",
    description: "Command to set or reset a server's whitespace identifier.",
    execute: async (msg, args, guildEntry, guildData) => {

        // Retrieving the current WS for this Guild
        WS_SYMBOL = guildData.wsSymbol;



        // Checking the number of arguments
        switch (args.length) {

            // Setting the ws-symbol to default ws-symbol '-c'
            case 0:

                // Reseting the ws-symbol
                await setWhitespaceSymbol(guildEntry, DEFAULT_WS_SYMBOL);
                console.log(`>>Whitespace symbol set to default : \'${WS_SYMBOL}\'.`);

                msg.channel.send(
                    answerify('Resetting this server\'s whitespace identifier to \'` + WS_SYMBOL + `\'.')
                );
                break;


            // Setting the ws-symbol to the new ws-symbol
            case 1:

                // If the new ws-symbol is already the current ws-symbol
                if (args[2] === WS_SYMBOL) {

                    msg.channel.send(
                        answerify('Uhm... That\'s already the current whitespace identifier here.\nI\'ll just pretend like I didn\'t hear this.')
                    );

                } else {

                    // Setting the ws-symbol to the new phrase
                    await setWhitespaceSymbol(guildEntry, args[0]);
                    console.log(`>>Whitespace symbol set to : \'${WS_SYMBOL}\'.`);

                    msg.channel.send(
                        answerify('Gotcha ! Whitespace identifier set to `' + WS_SYMBOL + '` for this server.')
                    );
                }
                break;
        }
    },



    setWhitespaceSymbol
};