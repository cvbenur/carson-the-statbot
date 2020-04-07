const Discord = require('discord.js');


// Printing the embed in a message
function printEmbedFromMessage(msg, msgAuthor) {
    
    // For each embed in the message
    msg.embeds.forEach(emb => {

        // If there are any fields in the embed
        if (emb.fields.length > 0) {

            // Displaying the detected embed
            console.log(
                'MSG FROM : ' + msgAuthor + ' -> '
                + emb.description + '\n'
                + emb.fields
            );

        } else {
            
            // Displaying the detected embed
            console.log(
                'MSG FROM : ' + msgAuthor + ' -> '
                + emb.description
            );
        }
    });
}



module.exports = {
    answerify (text) {
        return new Discord.MessageEmbed()
            .setTitle('Carson says')
            .setColor(0xffffff)
            .setDescription(text);
    },
    WIP () {
        return this.answerify(':warning: Work in progress... Come back a bit later !');
    },
    logMessage(msg) {

        let msgAuthor = msg.member.displayName;

        // If the bot is the author of the message
        if (msg.author.bot) {

            // Adding '(Bot) ' as a prefix to the sender's name
            msgAuthor = '(Bot) ' + msg.member.displayName;
        }

        // If the message has any embeds
        if (msg.embeds.length > 0) {

            // Printing the embed in the message
            printEmbedFromMessage(msg, msgAuthor);

        } else {

            // Displaying detected message
            console.log('MSG FROM : ' + msgAuthor + ' -> ' + msg.content);
        }
    }
};