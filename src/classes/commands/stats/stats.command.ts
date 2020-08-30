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
  Message,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { NotDM } from '../../guards/notdm.guard';
import {
  SearchParams,
  StatsObject,
} from '../../types/index';
import moment = require('moment');




export abstract class Stats {

  @Command('stats :arg1 :arg2 :arg3 :arg4')
  @Description('Carson\'s main command. Gives you stats about your server.')
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {

    const argsNbr = Object.keys(message.args).filter((k) => k !== undefined).length;
    if (!this.validArgsNbr(argsNbr)) return;



    // Parsing arguments
    const params: SearchParams = this.parseMessageForParams(message);
    const stats: StatsObject = new StatsObject();

    let answer = ':speech_balloon: Channel(s) : ' + (params.Channel ? `<#${params.Channel}>` : '**\`all\`**') + '\n' +
      ':busts_in_silhouette: Player(s) : ' + (params.User ? `<@${params.User}>` : '**\`all\`**') + '\n' +
      ':timer_clock: Time limit given : ' + (params.TimeAmount ? `**\`${params.TimeAmount}\`**` : '**\`none\`**') + '\n' +
      ':mag: Phrase to look for : ' + (params.Phrase ? `**\`${params.Phrase}\`**` : '**\`none\`**') + '\n';
    
    const state = {
      parsing: ':hourglass_flowing_sand: Parsing through messages...',
      parsed: ':white_check_mark: Messages parsed.',
      computing: ':hourglass_flowing_sand: Computing stats...',
      computed : ':white_check_mark: Stats computed.',
      resolved: ':white_check_mark: Resolved !',
    };

    
    const embed = new MessageEmbed()
      .setAuthor(Main.Client.user.username, Main.Client.user.displayAvatarURL())
      .setTitle(`You asked for : \"\`${this.removeMention(message.commandContent, message.guild)}\`\".`)
      .addField('**Your query :**', answer)
      .addField('**Results :**', 'Pending...')
      .addField('State :', state.parsing)
      .setFooter(`${message.member.nickname ? message.member.nickname : message.author.username} - ${moment(message.createdAt).format('ddd, MMM Do YYYY - kk:mm:ss')}`, message.author.displayAvatarURL());



    // Replying
    const reply = await (message as Message).reply(embed);



    // Fetching & filtering messages
    const fetchedMessages: Message[] = await this.getMessagesFromParams(params, message);



    // Updating reply
    embed.fields[1].value = `:email: Messages retrieved : **\`${fetchedMessages.length}\`**\n`;
    embed.fields[2].value = `${state.parsed}\n${state.computing}`;
    reply.edit(embed);



    // Update reply
    embed.fields[1].value += `:speech_balloon: Channels analyzed : **\`${params.Channel === null ? message.guild.channels.cache.array().filter((c) => c instanceof TextChannel).length : 1}\`**\n` +
      `:busts_in_silhouette: Members taken into account : **\`${params.User === null ? message.guild.memberCount : 1}\`**\n`;
    
    reply.edit(embed);



    // Computing stats
    await stats.computeStatsFromMessages(fetchedMessages, params.Phrase);
    // TODO: Nbr (%) of messages per person
    // TODO: Nbr (%) of messages per channel
    embed.fields[1].value += ':mag: ' + (params.Phrase === null ? 'No phrase to look for' : `Occurrences of **\`${params.Phrase}\`** : **\`${stats.Occurrences}\`**`) + '\n';
    

    answer = '';
    // Updating answer for phrase count per member
    if (params.Phrase) {
      stats.sortByPhraseCount();
      for (const authorStat of stats.authorStats().filter((author) => author.memberStat.PhraseCount > 0)) {
        answer += `<@${authorStat.memberId}> said it **\`${authorStat.memberStat.PhraseCount}\`** times (**\`${stats.totalPhraseCountPercentage(authorStat.memberId)}%\`**).\n`;
      }

      embed.fields[1].value += answer;
    }



    // Updating reply
    embed.fields[2].value = `${state.parsed}\n${state.computed}\n${state.resolved}`;



    // Last reply update
    reply.edit(embed);
  }



  private validArgsNbr(nbr: number): boolean {
    if (nbr < 1) {
      console.log('too few args.');
      return false;
    }

    if (nbr > 4) {
      console.log('too many args');
      return false;
    }

    return true;
  }

  private parseMessageForParams(message: CommandMessage): SearchParams {
    
    let time: number | null = null;
    let phrase: string | null = null;


    const mentions = this.getMentionsFromMessage(message);

    
    for (const arg of Object.values(message.args)) {

      if (!this.isMention(arg as string)) {
        
        if (this.isPhrase(arg as string)) {
          phrase = (arg as string).slice(1, (arg as string).length - 1).split('_').join(' ');
        } else {
          if (!Number.isNaN(arg)) {
            if (time === null) {
              if (Number.isInteger(parseInt(arg as string))) time = Number.parseInt(arg as string, 10);
            } else console.log('Too many integers (max is 1).');
          }
        }
      }
    }


    return new SearchParams(mentions.user, mentions.chan, time, phrase);
  }

  private isPhrase(str: string): boolean {
    return str && (str.startsWith('[') && str.endsWith(']'));
  }



  private getChannelFromId(channelId: string, guild: Guild): TextChannel {
    return guild.channels.cache.find((channel) => channel.id === channelId) as TextChannel;
  }



  private async getMessagesFromParams(params: SearchParams, message: Message): Promise<Message[]> {

    let fetched: Message[] = [];
    const filtered: Message[] = [];
    

    // Filter by channel
    if (params.Channel === null) {
      fetched = await this.fetchAllMessages(message as Message);
    } else {
      fetched = await this.getMessagesFromChannel(this.getChannelFromId(params.Channel, message.guild));
    }


    // Filter by time and by user
    for (const msg of fetched) {

      let timeValid = true;
      let userValid = true;

      // Filter by time
      if (params.MaxDate !== null) {
        const lastDate = (msg.editedAt === null) ? moment(msg.createdAt) : moment(msg.editedAt);
        if (!lastDate.isAfter(params.MaxDate)) timeValid = false;
      }
      

      // Filter by user
      if (params.User !== null) {
        if (msg.author.id !== params.User) userValid = false;
      }


      // If both are valid, keep message
      if (timeValid && userValid) filtered.push(msg);
    }


    return filtered;
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



  private isMention(str: string): boolean {
    return (str && (str.startsWith('<@') || str.startsWith('<#')) && str.endsWith('>'));
  }

  private getMentionsFromMessage(message: Message) {

    let chan = null;
    let user = null;

    let channels = null;
    let members = null;

    if (message.mentions.channels) channels = message.mentions.channels.array();
    if (message.mentions.members) members = message.mentions.members.array();


    // Parsing through channel mentions
    if (channels.length > 0) {
      if (channels.length === 1) {
        if (channels[0] instanceof TextChannel) chan = channels[0].id;
        else console.log(`Channel #${channels[0].name} is not a TextChannel.`);
      } else console.log('Too many channels mentioned (max is 1).');
    }

    if (members.length > 0) {
      if (members.length === 1) user = members[0].user.id;
      else console.log('Too many members mentioned (max is 1).');
    }


    return {
      chan: chan,
      user: user,
    }
  }


  
  private removeMention(content: string, guild: Guild) {
    const array = content.split(' ');

    for (let i = 0; i < array.length; i++) {
      if (this.isMention(array[i])) {
        if (array[i].endsWith('>')) {
          if (array[i].startsWith('<@')) {
            if (array[i].charAt(2) === '!') array[i] = '@' + guild.members.cache.array().find((m) => m.id === array[i].slice(3, -1)).nickname;
            else array[i] = '@' + guild.members.cache.array().find((m) => m.id === array[i].slice(2, -1)).nickname;
          }
        }
      }
    }

    return array.join(' ');
  }
}
