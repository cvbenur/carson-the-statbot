const Util = require('../utilities.js');
const fs = require('fs');


// Changing the prefix for this server
function setPrefix(guild, newPref) {

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    prefixes[guild.id] = {
        prefix: newPref
    };

    fs.writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
    });

    PREFIX = newPref;
}


module.exports = {
    name: "prefix",
    description: "Command to set or reset the bot's prefix.",
    execute(msg, args) {
        
        // Checking the number of arguments
        switch (args.length) {

            // Setting the prefix to default prefix '-c'
            case 2:

                // Reseting the prefix
                setPrefix(msg.guild, '-c');
                let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
                console.log('>>Prefix set to default prefix : \'' + prefixes[msg.guild.id].prefix + '\'.');

                msg.channel.send(
                    Util.answerify('\'`' + prefixes[msg.guild.id].prefix + '`\', you say ?\n... I haven\'t heard that prefix in a while...\n**\*Suddenly looks at you suspiciously\***\nWhere did you get that from ?\n\nAlright. I guess I\'ll accept this.')
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
                    setPrefix(msg.guild, args[2]);
                    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
                    console.log('>>Prefix set to : \'' + prefixes[msg.guild.id].prefix + '\'.');

                    msg.channel.send(
                        Util.answerify('Gotcha ! I will now only answer to `' + prefixes[msg.guild.id].prefix +'`.\nForget eeeeverything else...\n**\*Stares into the distance\***')
                    );
                }
                break;
        }
    }
};