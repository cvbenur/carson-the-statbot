const { MessageEmbed } = require('discord.js');
const { EMBED_COLOR } = require('../config.json');




// Replaces all '\n' in a line by '\n\t'
function addTabOnLine (str) {
    return str.replace(/\n/g, "\n\t");
}

// Returning a String containing the embed's fields
function getEmbedsAsString (emb) {
    var embFields = '\nFields :';

    emb.fields.forEach(field => {
        embFields += '\n\t' + field.name + '\n\t' + addTabOnLine(field.value);
    });

    return embFields.slice(0, embFields.length-1);
}

// Printing the embed in a message
function printEmbedFromMessage (embeds, msgAuthor) {
    
    // For each embed in the message
    embeds.forEach(emb => {

        // Loading the embed into a local String
        let msgContent = '\nDescription :\n\t' + addTabOnLine(emb.description);


        // If there are any fields in the embed
        if (emb.fields.length > 0) {

            // Getting the fields as a string
            msgContent += getEmbedsAsString(emb);

        }

        // Displaying the detected embed
        console.log(
            'MSG FROM : ' + msgAuthor + ' -> MessageEmbed :'
            + msgContent
        );
    });
}

// Formats a MessageEmbed with some text
function answerify (description) {
    return new MessageEmbed()
        .setTitle('Carson says')
        .setColor(EMBED_COLOR)
        .setDescription(description);
}





module.exports = {
    
    answerify,

    
    // "Work In Progress"
    WIP: () => {
        return this.answerify(':warning: Work in progress... Come back a bit later !');
    },


    // Log a message to the console
    logMessage: (msg) => {

        let msgAuthor = msg.member.displayName;

        // If the bot is the author of the message
        if (msg.author.bot) {

            // Adding '(Bot) ' as a prefix to the sender's name
            msgAuthor = '(Bot) ' + msg.member.displayName;
        }

        // If the message has any embeds
        if (msg.embeds.length > 0) {

            // Printing the embed in the message
            printEmbedFromMessage(msg.embeds, msgAuthor);

        } else {

            // Displaying detected message
            console.log('MSG FROM : ' + msgAuthor + ' -> ' + msg.content);
        }
    },


    // Checking the user's permissions
    permCheck: (command, msg, permissions) => {

        let allowed = 0;
        let deniedList = 'Sorry, you don\'t have the right permissions for this command.\n\nThe required permissions are :\n';


        // Getting the required permissions
        const targetPerms = permissions.filter(
            function(permissions){ return permissions.name == command }
        )[0].perms;


        // Checking that the user has the correct permissions
        targetPerms.forEach(p => {
            if (msg.member.hasPermission(p)) allowed++;
            else deniedList += `- ${p}\n`;
        })


        // If the user has every required Permission
        if (allowed === targetPerms.length) return true;

        // Else
        msg.reply(answerify(deniedList + '\nContact one of your server\'s administrators in order to sort this out.'));
        return false;
    },


    // Removing whitespaces from array after '\' indicator
    removeWhitespaceFromArray: (args) => {

        var ctr=0;

        for (let arg of args) {
            
            if (arg.endsWith(WS_SYMBOL)) {
                if (args[ctr+1] && (!args[ctr+1].startsWith('c:') && !args[ctr+1].startsWith('t:'))) {
                    args[ctr] = (arg + args[ctr+1]).replace(WS_SYMBOL, ' ');
                    args.splice(ctr+1, 1);
                }
            }

            ctr++;
        }

        return args;
    }
};