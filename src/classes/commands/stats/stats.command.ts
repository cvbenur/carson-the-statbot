import {
  Command,
  CommandMessage,
  Description,
  Guard,
} from '@typeit/discord';
import { Main } from '../../../index';
import { Collection, GuildChannel, Message, TextChannel } from 'discord.js';
import { NotDM } from '../../guards/notdm.guard';


export abstract class Stats {

  @Command('stats')
  @Description('Carson\'s main command. Gives you stats about your server.')
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {
    message.reply('stats');

    console.log(message.args);
  }
}


function getChannelFromName(message: Message, channelName: string): GuildChannel {
  return message.member.guild.channels.cache.find((channel) =>
    channel.name.includes(channelName.toLowerCase())
  );
}


async function getMessagesFromChannel(channel: TextChannel, limit = 100): Promise<Message[]> {
  const guild = Array.from(Main.Client.guilds.cache.entries()).find(
    (entry) => entry[1] === channel.guild
  )[1];


  const fetchedMessages: Array<Message> = [];
  let last_id;


  while (true) {
    const options: { limit: number; before?: string } = { limit: 100 };
    if (last_id) options.before = last_id;

    if (channel != undefined) {
      const condition = guild.me.roles.highest
        .permissionsIn(channel)
        .has('VIEW_CHANNEL');
      
      if (condition) {
        const messages: Collection<string, Message> = await channel.messages.fetch({ limit: options.limit, before: options.before });
        
        fetchedMessages.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size !== 100 || fetchedMessages.length >= limit) {
          break;
        }
      } else break;
    }
  }

  console.log(
    `Parsed channel ${channel.name},\tRetrieved : ${fetchedMessages.length}.`
  );

  return fetchedMessages;
}