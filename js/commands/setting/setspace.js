const { answerify } = require('../../utilities.js');
const { readFileSync, writeFileSync } = require('fs');


// Set whitespace symbol for this guild
function setWhitespaceSymbol (id, newSymbol) {
    let ws = JSON.parse(readFileSync("./ws-symbols.json", "utf8"));

    ws[id] = {
        symbol: newSymbol
    };

    writeFileSync("./ws-symbols.json", JSON.stringify(ws), (err) => {
        if (err) console.log(err);
    });

    WS_SYMBOL = newSymbol;
}



module.exports = {
    name: "setspace",
    category: "Setting",
    description: "Command to set or reset a server's whitespace identifier.",
    execute: (msg, args) => {

        // Checking the number of arguments
        switch (args.length) {

            // Setting the ws-symbol to default ws-symbol '-c'
            case 0:

                // Reseting the ws-symbol
                setWhitespaceSymbol(msg.guild.id, DEFAULT_WS_SYMBOL);
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
                        answerify('Uhm... That\'s already the current whitespace identifier here.\nI\'ll just pretend I didn\'t hear this.')
                    );

                } else {

                    // Setting the ws-symbol to the new phrase
                    setWhitespaceSymbol(msg.guild.id, args[0]);
                    console.log(`>>Whitespace symbol set to : \'${WS_SYMBOL}\'.`);

                    msg.channel.send(
                        answerify('Gotcha ! Whitespace identifier set to `' + WS_SYMBOL +'` for this server.')
                    );
                }
                break;
        }
    },



    setWhitespaceSymbol
};