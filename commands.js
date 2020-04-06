const Discord = require('discord.js');



function answerify(text) {
    return new Discord.MessageEmbed()
        .setTitle('Carson says')
        .setColor(0xffffff)
        .setDescription(text);
}


module.exports = {
    const: PREFIX = '-c',


    // Reacting to only prefix
    start: function (msg) {
        msg.channel.send(new Discord.MessageEmbed()
            .setTitle('Carson says')
            .setColor(0xffffff)
            .setDescription('Just type `-c help` to get started.')
        );
    },


    // Reacting to 'ping' command
    pong: function (msg) {
        // FIXME
        switch(Math.floor(Math.random() * 6) + 1) {
            case 0:
                msg.channel.send(answerify('Pong!'));
                break;
            
            case 1:
                msg.channel.send(answerify('\'Ping\' yourself!'));
                break;

            case 2:
                msg.channel.send(answerify('Oh, I\'m fine, thanks for asking...'));
                break;

            case 3:
                msg.channel.send(answerify('Well, well, well, who do we have here! Here\'s your \'Pong\', kind stranger!'));
                break;

            case 4:
                msg.channel.send(answerify('Nope. Not saying it. Just because I don\'t want to.'));
                break;

            case 5:
                msg.channel.send(answerify('**\*Suddenly wakes up\***\nWh- What? Nope, not sleeping! Definitely wasn\'t sleeping !'));
        }
    },


    // Reacting to 'help' command
    help: function (msg) {
        msg.channel.send(
            new Discord.MessageEmbed()
            .setTitle('Carson the StatBot')
            .setColor(0xffffff)
            .setDescription('Carson is an easy to use - although VERY sassy - statistics compiling bot for your Discord server.\n\nHe can pretty much tell you anything you might want to know, with pretty, easy-to-read little graphs.')
            .addFields(
                // TODO: Link 'help' to a web page
                { name: '**Commands**',                         value:'Here is a list of commands you can give Carson.\n\n\n' },
                { name: 'Help',                                 value: 'If you need any help with one of Carson\'s commands, simply type `-c help`.\n\n' },
                { name: 'Stats',                                value: 'There are many things you can do with Carson in terms of stats.\nIn order to get a list of stats commands for Carson, simply type `-c stats help`.' }
            )
        );
    },


    // TODO: Check permissions for message sender
    // Reacting to 'setprefix' command
    prefix: function(msg, args) {
        
        // TODO: check permissions for message sender


        // Checking the number of arguments
        switch (args.length) {

            // Setting the prefix to default prefix '-c'
            case 2:
                PREFIX = '-c';

                msg.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle('Carson says')
                        .setColor(0xffffff)
                        .setDescription('I haven\'t heard that prefix in a while...\n**\*Looks at you suspiciously\***\nWhere do you know it from ?\n\nAlright. I guess I\'ll accept this.')
                );
                break;


            // Setting the prefix to the new prefix
            case 3:
                PREFIX = args[2];

                msg.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle('Carson says')
                        .setColor(0xffffff)
                        .setDescription('Gotcha ! I will now only answer to `' + PREFIX +'`.\nForget eeeeverything else...\n**\*Stares into the distance\***')
                );
                break;
        }
    },


    // Reacting to 'stats' command
    stats: function (msg, args) {

        // TODO: -c stats command


        switch (args.length) {

            // If there is only 1 argument after 'stats'
            case 3:
                switch (args[2]) {
                    case 'help':
                        msg.channel.send(answerify(':warning: Work in progress... Come back a bit later !'));
                        break;
                    
                }
                break;
        }
    }
};