import {
  MemberStat,
  MessageStat,
  ChannelStat,
} from './stats';
import {
  Channel,
  Message,
  TextChannel,
} from 'discord.js';
import moment = require('moment');


export class StatsObject {

  // Attributes
  private occurrences = 0;
  private memberStats: Array<{
    memberId: string;
    memberStat: MemberStat;
  }>;
  private channelStats: Array<{
    channelId: string;
    channelStat: ChannelStat;
  }>;


  // Ctor
  constructor() {
    this.memberStats = [];
    this.channelStats = [];
  }


  // Methods
  get Occurrences(): number {
    return this.occurrences;
  }
  set Occurrences(occurrences: number) {
    this.occurrences = occurrences;
  }

  get MemberStats(): Array<{ memberId: string; memberStat: MemberStat }> {
    return this.memberStats;
  }
  set MemberStats(memberStats: Array<{ memberId: string; memberStat: MemberStat }>) {
    this.memberStats = memberStats;
  }

  get ChannelStats(): Array<{ channelId: string; channelStat: ChannelStat; }> {
    return this.channelStats;
  }
  set ChannelStats(channelStats: Array<{ channelId: string; channelStat: ChannelStat; }>) {
    this.channelStats = channelStats;
  }



  async computeStatsFromMessages(messages: Array<Message>, phrase: string): Promise<void> {
    this.computeMessageStats(messages, phrase);
    this.computeChannelStats(
      messages[0].guild.channels.cache
        .array()
        .filter((channel) => channel instanceof TextChannel)
    );
  }

  async computeMessageStats(messages: Array<Message>, phrase: string): Promise<void> {
    for (const msg of messages) {
      // Check whether the stat exists
      if (!this.MemberStats.some((memberStat) => memberStat.memberId === msg.author.id)) {
        this.MemberStats.push({
          memberId: msg.author.id,
          memberStat: new MemberStat(),
        });
      }

      // Push stat into array
      this.MemberStats.find((memberStat) => memberStat.memberId === msg.author.id)
        .memberStat
        .addMessageStat(
          new MessageStat(
            msg.channel.id,
            msg.content.split(' ').length,
            (this.countOccurencesInMessage(phrase, msg) > 0),
            msg.edits.length !== 0,
            moment(msg.createdAt)
          )
        );
    }
  }

  async computeChannelStats(channels: Array<Channel>): Promise<void> {
    for (const channel of channels) {

      // Check whether stat exists
      if (!this.ChannelStats.some((channelStat) => channelStat.channelId === channel.id)) {

        // Push stat into array
        this.ChannelStats.push({
          channelId: channel.id,
          channelStat: new ChannelStat(channel)
        });
      }
    }
  }



  private countOccurencesInMessage(phrase: string, message: Message, allowOverlapping = false): number {
    if (phrase !== null && !(phrase.startsWith(':') && phrase.endsWith(':'))) {
      const content = message.content.toLowerCase() + '';
      phrase = phrase.toLowerCase() + '';
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

      this.Occurrences += n;
      return n;
    }

    return 0;
  }



  authorStats(): Array<{ memberId: string; memberStat: MemberStat }> {
    return this.MemberStats.filter((stat) => stat.memberStat.MsgStats.length > 0);
  }

  sortByMessageCount(descending = true): void {
    if (descending) {
      this.MemberStats.sort((a, b) => b.memberStat.MsgStats.length - a.memberStat.MsgStats.length);
    } else {
      this.MemberStats.sort((a, b) => a.memberStat.MsgStats.length - b.memberStat.MsgStats.length);
    }
  }

  sortByPhraseCount(descending = true): void {
    if (descending) {
      this.MemberStats.sort((a, b) => b.memberStat.PhraseCount - a.memberStat.PhraseCount);
    } else {
      this.MemberStats.sort((a, b) => a.memberStat.PhraseCount - b.memberStat.PhraseCount);
    }
  }



  totalPhraseCountPercentage(memberId: string): number {
    return Math.round((((this.MemberStats.find((stat) => stat.memberId === memberId).memberStat.PhraseCount / this.Occurrences) * 100) + Number.EPSILON) * 100) / 100;
  }
}
