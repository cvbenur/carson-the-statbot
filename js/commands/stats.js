const Util = require('../utilities.js');

module.exports = {
    name: "stats",
    description: "Compiles and sends back stats.",
    execute (msg, args) {
        // TODO: -c stats command


        switch (args.length) {

            // If there are no arguments after 'stats
            case 2:
                msg.channel.send(
                    Util.WIP()
                );
                break;

            // If there is only 1 argument after 'stats'
            case 3:
                switch (args[2]) {
                    case 'help':
                        msg.channel.send(
                            Util.WIP()
                        );
                        break;
                    
                }
                break;
        }
    }
};