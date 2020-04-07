const Commands = require('./commands.js');
const Util = require('./utilities.js');


module.exports = {

    command: function (message, command, args) {

        switch (command) {

            // Pipeline for command 'help'
            case 'help':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.help)) {
                    console.log(">>Executing 'help' command.");
                    Commands.help.execute(message);
                } else {
                    message.channel.send(Util.permDenied(PLAYER_PERMS.help));
                }
                break;


            // Pipeline for command 'ping'
            case 'ping':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.pong)) {
                    console.log(">>Executing 'ping' command.");
                    Commands.pong.execute(message);
                } else {
                    message.channel.send(Util.permDenied(PLAYER_PERMS.pong));
                }
                break;


            // Pipeline for command 'prefix'
            case 'prefix':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.prefix)) {
                    console.log(">>Executing 'prefix' command.");
                    Commands.prefix.execute(message, args);
                } else {
                    message.channel.send(Util.permDenied(PLAYER_PERMS.prefix));
                }
                break;


            // Pipeline for command 'reset'
            case 'reset':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.reset)) {
                    console.log(">>Executing 'reset' command.");
                    Commands.reset.execute(message, args);
                } else {
                    message.channel.send(Util.permDenied(PLAYER_PERMS.reset));
                }
                break;


            // Pipeline for command '-c'
            case 'start':

                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.start)) {
                    console.log(">>Executing 'start' command.");
                    Commands.start.execute(message);
                } else {
                    message.channel.send(Util.permDenied(PLAYER_PERMS.start));
                }

                break;


            // Pipeline for command 'stats'
            case 'stats':
                if (Util.permCheck(message.member.guild.me, PLAYER_PERMS.stats)) {
                    console.log(">>Executing 'stats' command.");
                    Commands.stats.execute(message, args);
                } else {
                    message.channel.send(Util.permDenied(PLAYER_PERMS.stats));
                }
                break;
        }
    }
};