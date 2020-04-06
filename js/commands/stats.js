const Discord = require('discord.js');
const Util = require('../utilities.js');

module.exports = {
    name: "stats",
    description: "Compiles and sends back stats.",
    execute (msg, args) {
        // TODO: -c stats command


        switch (args.length) {

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