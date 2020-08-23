import {
  Message,
  MessageEmbed,
  User,
} from 'discord.js';
import { Main } from '../../index';
import { EMBED_COLOR } from '../config/default.config';



// Replaces all '\n' in a line by '\n\t'
function addTabOnLine(str: string): string {
  return str.replace(/\n/g, '\n\t');
}

// Returning a String containing the embed's fields
function getEmbedsAsString(emb: MessageEmbed): string {
  let embFields = '\nFields :';

  emb.fields.forEach((field) => {
    embFields += `\n\t${field.name}\n\t${addTabOnLine(field.value)}`;
  });

  return embFields.slice(0, embFields.length - 1);
}

// Printing the embed in a message
function printEmbedFromMessage(embeds: Array<MessageEmbed>, authorName: string): void {
  // For each embed in the message
  embeds.forEach((emb) => {
    let msgContent = '';

    // Loading the embed into a local String
    if (emb.description !== undefined) { msgContent = `\nDescription :\n\t${addTabOnLine(emb.description)}`; }

    // If there are any fields in the embed
    if (emb.fields.length > 0) {
      // Getting the fields as a string
      msgContent += getEmbedsAsString(emb);
    }

    // Displaying the detected embed
    console.log(`MSG FROM : ${authorName} -> MessageEmbed :${msgContent}`);
  });
}




// Formats a MessageEmbed with some text
export function answerify(description: string, author?: User): MessageEmbed {
  const embed = new MessageEmbed()
    .setTitle('Carson says')
    .setColor(EMBED_COLOR)
    .setDescription(description)
    .setAuthor(`${Main.Client.user.username}`, Main.Client.user.displayAvatarURL())
  
  if (author) {
    embed.setFooter(author.username, author.displayAvatarURL());
  }
  
  return embed;
}

// "Work In Progress"
export function WIP(): void {
  answerify(':warning: Work in progress... Come back a bit later !', Main.Client.user);
}

// Log a message to the console
export function logMessage(msg: Message): void {
  let authorName = msg.member.displayName;

  // If the bot is the author of the message
  if (msg.author.bot) {
    // Adding '(Bot) ' as a prefix to the sender's name
    authorName = `(Bot) ${msg.member.displayName}`;
  }

  // If the message has any embeds
  if (msg.embeds.length > 0) {
    // Printing the embed in the message
    printEmbedFromMessage(msg.embeds, authorName);
  } else {
    // Displaying detected message
    console.log(
      `SERVER: ${msg.guild.name}, Author: ${authorName} -> ${msg.content}`,
    );
  }
}

// Removing whitespaces from array after '\' indicator
export function removeWhitespaceFromArray(args: Array<string>, symbol: string): Array<string> {
  for (let ctr = 0; ctr < args.length; ctr += 1) {
    if (args[ctr].endsWith(symbol)) {
      if (
        args[ctr + 1] !== undefined
          && !args[ctr + 1].startsWith('c:')
          && !args[ctr + 1].startsWith('t:')
          && !args[ctr + 1].startsWith('w:')
          && !args[ctr + 1].startsWith('p:')
      ) {
        // eslint-disable-next-line no-param-reassign
        args[ctr] = (args[ctr] + args[ctr + 1]).replace(symbol, ' ');
        args.splice(ctr + 1, 1);

        ctr -= 1;
      }
    }
  }

  return args;
}
