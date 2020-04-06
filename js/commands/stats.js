const Util = require('../utilities.js');


module.exports = {
    name: "stats",
    description: "Compiles and sends back stats.",
    execute (msg, args) {
        // TODO: -c stats commands


        switch (args.length) {

            // If there are no arguments after 'stats'
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
                            // TODO: Write 'help' message
                            Util.WIP()
                        );
                        break;


                    case 'global':
                        // TODO: Add 'stats global' command
                        msg.channel.send(
                            Util.WIP()
                        );


                        break;
                    
                }
                break;
        }
    }
};