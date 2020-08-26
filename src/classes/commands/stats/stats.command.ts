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
  TextChannel,
} from 'discord.js';
import { NotDM } from '../../guards/notdm.guard';
import { answerify } from '../../../utils/functions/message';
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
    let answer = `**__Your query__** :\n` +
      'Channel(s) : ' + (params.Channel ? `<#${params.Channel}>\n` : '\`**all**\`\n') +
      'Player(s) : ' + (params.User ? `<@${params.User}>\n` : '\`**all**\`\n') +
      'Time limit given : ' + (params.TimeAmount ? `\`${params.TimeAmount}\`\n` : '\`**none**\`\n') +
      'Phrase to look for : ' + (params.Phrase ? `\`${params.Phrase}\`\n` : '\`**none**\`\n');
      


    const reply = await (message as Message).reply(
      answerify(answer + '\n:hourglass_flowing_sand: Parsing through messages...')
    );



    // Fetching & filtering messages
    const fetchedMessages: Message[] = await this.getMessagesFromParams(params, message);
    answer += `\n:heavy_check_mark: Messages parsed - \`${fetchedMessages.length}\` retrieved.`;


    reply.edit(
      answerify(answer + '\n:hourglass_flowing_sand: Computing stats...')
    );


    // TODO: 5. Stats sur les messages
    // TODO: autoriser les phrases avec des espaces
    //    5-1. Nombre total de messages, nombre de personnes, nombre de channels
    //    5-3. %ages de messages par channel
    //    5-3. %ages de messages par personne, %ages de messages par personne par channel


    
    reply.edit(answerify(answer + '\n:heavy_check_mark: Resolved !'));
  }



  private countOccurences(phrase: string, message: Message, allowOverlapping = false) {
    const content = message.content.toLowerCase() + '';
    phrase += '';
    if (phrase.length <= 0) return content.length + 1;

    let n = 0;
    let pos = 0;
    
    const step = allowOverlapping ? 1 : phrase.length;
    
    while (true) {
      pos = content.indexOf(phrase, pos);
      if (pos >= 0) {
        n += 1;
        pos += step;
      } else break;
    }

    return n;
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
          phrase = (arg as string).slice(1, (arg as string).length - 1).toLowerCase();
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
}



export class SearchParams {

  // Attributes
  private userId: string | null;
  private channelId: string | null;
  private timeAmount: number | null;
  private maxDate: moment.Moment | null;
  private phrase: string | null;


  // Ctor
  constructor(userId: string | null, channelId: string | null, timeAmount: number | null, phrase: string | null) {
    this.userId = userId;
    this.channelId = channelId;
    this.phrase = phrase;
    
    if (timeAmount) {
      this.timeAmount = timeAmount;
      this.maxDate = this.deduceMaxDate();
    } else this.maxDate = null;
  }



  // Methods
  private deduceMaxDate(): moment.Moment {
    const now = moment();
    return now.subtract(this.TimeAmount, 'weeks');
  }

  
  get User(): string | null {
    return this.userId;
  }
  set User(userId: string|null) {
    this.userId = userId;
  }

  get Channel(): string | null {
    return this.channelId;
  }
  set Channel(channelId: string|null) {
    this.channelId = channelId;
  }

  get TimeAmount(): number | null {
    return this.timeAmount;
  }
  set TimeAmount(timeAmount: number | null) {
    this.timeAmount = timeAmount;
  }

  get MaxDate(): moment.Moment | null {
    return this.maxDate;
  }
  set MaxDate(maxDate: moment.Moment | null) {
    this.maxDate = maxDate;
  }

  get Phrase(): string | null {
    return this.phrase;
  }

  set Phrase(phrase: string | null) {
    this.phrase = phrase;
  }
}
