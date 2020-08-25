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
  User,
} from 'discord.js';
import { NotDM } from '../../guards/notdm.guard';
import { answerify } from '../../../utils/functions/message';




export abstract class Stats {

  @Command('stats :arg1 :arg2 :arg3')
  @Description('Carson\'s main command. Gives you stats about your server.')
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {

    const argsNbr = Object.keys(message.args).filter((k) => k !== undefined).length;
    if (!this.validArgsNbr(argsNbr)) return;







    // 1. Parse les args pour trouver des mentions
    // 2. Chopper les params
    // 3. Fetch les messages
    // 4. Filtrer les messages


    // 5. Stats sur les messages
    //    5-1. Nombre total de messages, nombre de personnes, nombre de channels
    //    5-3. %ages de messages par channel
    //    5-3. %ages de messages par personne, %ages de messages par personne par channel





    


    const reply = await message.reply(
      answerify(
        `Arguments (${Object.keys(message.args).length}) :\n` +
        ((message.args.arg1 !== undefined) ? `${message.args.arg1}\n` : 'all\n') +
        ((message.args.arg2 !== undefined) ? `${message.args.arg2}\n` : 'all\n') +
        ((message.args.arg3 !== undefined) ? `${message.args.arg3}` : 'all')
      )
    );


    /*
    reply.edit(
      answerify(`\`${(await this.fetchAllMessages(message)).length}\` messages retrieved in total.`)
    );
    */
  }




  private searchParameters: {
    userId: string | null;
    channelId: string | null;
    time: string | null;
  }




  private validArgsNbr(nbr: number): boolean {
    if (nbr < 1) {
      console.log('too few args.');
      return false;
    }

    if (nbr > 3) {
      console.log('too many args');
      return false;
    }

    return true;
  }



  private getChannelFromName(message: Message, channelName: string): GuildChannel {
    return message.member.guild.channels.cache.find((channel) =>
      channel.name.includes(channelName.toLowerCase())
    );
  }



  private async fetchAllMessages(message: Message): Promise<Message[]> {
    const messages: Array<Message> = [];

    for (
        const textChannel of message.guild.channels.cache.array()
          .filter((channel: GuildChannel) => channel instanceof TextChannel))
      {
        const current = await this.getMessagesFromChannel(textChannel as TextChannel);
        messages.push(...current);
    }
    
    return messages;
  }



  private async getMessagesFromChannel(channel: TextChannel, limit = 100): Promise<Message[]> {
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



  private async getMembersFromGuild(guild: Guild): Promise<GuildMember[]> {
    const found: Collection<string, GuildMember> = await guild.members.fetch();

    const members: GuildMember[] = [];
    members.push(...found.array());

    return members;
  }



  private getPlayerFromName(guild: Guild, name: string): GuildMember {
    return guild.members.cache.find((member) => {
      return (
        member.displayName.toLowerCase().includes(name) ||
        member.user.tag.toLowerCase().includes(name)
      );
    });
  }



  private getMentionFromString(str: string): Mentions {
    if (str.startsWith('<') && str.endsWith('>')) {
      if (str.startsWith('<@')) {
        if (str.startsWith('<@!')) return Mentions.Nickname;
        else if (str.startsWith('<@')) return Mentions.User;
        else if (str.startsWith('<@&')) return Mentions.Role;
      }
      
      if (str.startsWith('<#')) return Mentions.Channel;

      return Mentions.None;
    }

    return Mentions.None;
  }

  private getUserFromMention(mention: string): User {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return Main.Client.users.cache.get(mention);
  }

  private getChannelFromMention(mention: string): GuildChannel {
    return Main.Client.channels.cache.get(mention.slice(2, -1)) as GuildChannel;
  }
}


const enum Mentions {
  None,
  User,
  Nickname,
  Role,
  Channel
}
