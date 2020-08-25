import {
  Command,
  CommandMessage,
  Description,
  Guard,
} from '@typeit/discord';
import { Main } from '../../../index';
import {
  Collection,
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  TextChannel,
} from 'discord.js';
import { NotDM } from '../../guards/notdm.guard';
import { answerify } from '../../../utils/functions/message';


export abstract class Stats {

  @Command('stats :arg1 :arg2 :arg3')
  @Description('Carson\'s main command. Gives you stats about your server.')
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {

    const reply = await message.reply(
      answerify(
        'Arguments :\n'
        + message.args.arg1 + '\n'
        + message.args.arg2 + '\n'
        + message.args.arg3 + '\n'
      )
    );


    
    
    
    reply.edit(
      answerify(`\`${(await fetchAllMessages(message)).length}\` messages retrieved in total.`)
    );
  }
}


function getChannelFromName(message: Message, channelName: string): GuildChannel {
  return message.member.guild.channels.cache.find((channel) =>
    channel.name.includes(channelName.toLowerCase())
  );
}


async function fetchAllMessages(message: Message): Promise<Message[]> {
  const messages: Array<Message> = [];

  for (
      const textChannel of message.guild.channels.cache.array()
        .filter((channel: GuildChannel) => channel instanceof TextChannel))
    {
      const current = await getMessagesFromChannel(textChannel as TextChannel);
      messages.push(...current);
  }
  
  return messages;
}


async function getMessagesFromChannel(channel: TextChannel, limit = 100): Promise<Message[]> {
  const guild = Array.from(Main.Client.guilds.cache.entries()).find(
    (entry) => entry[1] === channel.guild
  )[1];


  const fetchedMessages: Array<Message> = [];
  let last_id;


  while (true) {
    const options: { limit: number; before?: string; } = { limit: limit };
    if (last_id) options.before = last_id;

    if (channel != undefined) {
      const condition = guild.me.roles.highest
        .permissionsIn(channel)
        .has('VIEW_CHANNEL');
      
      if (condition) {
      
        const currentBatch: Collection<string, Message> = (await channel.messages.fetch(options));
        
        fetchedMessages.push(...currentBatch.array());
        last_id = currentBatch.last().id;
      

        if (currentBatch.size != 100) {
          break;
        }
      } else break;
    }
  }

  console.log(
    `Parsed channel ${channel.name}@${channel.guild.name}<${channel.guild.id}>,\tRetrieved : ${fetchedMessages.length}.`
  );

  return fetchedMessages;
}


async function getMembersFromGuild(guild: Guild): Promise<GuildMember[]> {
  const found: Collection<string, GuildMember> = await guild.members.fetch();

  const members: GuildMember[] = [];
  members.push(...found.array());

  return members;
}


function getPlayerFromName(guild: Guild, name: string): GuildMember {
  return guild.members.cache.find((member) => {
    return (
      member.displayName.toLowerCase().includes(name) ||
      member.user.tag.toLowerCase().includes(name)
    );
  });
}