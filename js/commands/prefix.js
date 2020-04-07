const Util = require('../utilities.js');

module.exports = {
    name: "prefix",
    description: "Command to set or reset the bot's prefix.",
    execute(msg, args) {
        // TODO: check permissions for message sender


        // Checking the number of arguments
        switch (args.length) {

            // Setting the prefix to default prefix '-c'
            case 2:

                // Reseting the prefix
                PREFIX = '-c';
                console.log('>>Prefix set to default prefix : \'' + PREFIX + '\'.');

                msg.channel.send(
                    Util.answerify('\'`' + PREFIX + '`\', you say ?\n... I haven\'t heard that prefix in a while...\n**\*Suddenly looks at you suspiciously\***\nWhere did you get that from ?\n\nAlright. I guess I\'ll accept this.')
                );
                break;


            // Setting the prefix to the new prefix
            case 3:

                // If the new prefix is already the current prefix
                if (args[2] === PREFIX) {

                    msg.channel.send(
                        Util.answerify('Uhm... That\'s already my prefix.\nDid you not realize this as you were typing this very command ?')
                    );

                } else {

                    // Setting the prefix to the new phrase
                    PREFIX = args[2];
                    console.log('>>Prefix set to : \'' + PREFIX + '\'.');

                    msg.channel.send(
                        Util.answerify('Gotcha ! I will now only answer to `' + PREFIX +'`.\nForget eeeeverything else...\n**\*Stares into the distance\***')
                    );
                }
                break;
        }
    }
};