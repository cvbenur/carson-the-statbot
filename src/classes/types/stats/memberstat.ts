import { MessageStat } from './stats';


export class MemberStat {

  // Attributes
  private msgStats: Array<MessageStat>;
  private channelCount = 0;
  private phraseCount = 0;
  private editedCount = 0;


  // Ctor
  constructor() {
    this.msgStats = [];
  }


  // Methods
  get MsgStats(): Array<MessageStat> {
    return this.msgStats;
  }
  set MsgStats(msgStats: Array<MessageStat>) {
    this.msgStats = msgStats;
  }

  get ChannelCount(): number {
    return this.channelCount;
  }
  set ChannelCount(channelCount: number) {
    this.channelCount = channelCount;
  }

  get PhraseCount(): number {
    return this.phraseCount;
  }
  set PhraseCount(phraseCount: number) {
    this.phraseCount = phraseCount;
  }

  get EditedCount(): number {
    return this.editedCount;
  }
  set EditedCount(editedCount: number) {
    this.editedCount = editedCount;
  }


  addMessageStat(messageStat: MessageStat): void {
    this.MsgStats.push(messageStat);
    this.deduceEditedCount();
    this.deducePhraseCount();
    this.deduceChannelCount();
  }

  deduceEditedCount(): void {
    this.EditedCount = this.MsgStats.filter((message) => message.Edited).length;
  }

  deducePhraseCount(): void {
    this.PhraseCount = this.MsgStats.filter((message) => message.ContainsPhrase).length;
  }

  deduceChannelCount(): void {
    const channels: Array<string> = [];

    for (const stat of this.MsgStats) {
      if (!channels.some((channelId) => channelId === stat.ChanId)) channels.push(stat.ChanId);
    }

    this.ChannelCount = channels.length;
  }



  phraseCountPercentage(): number {
    return Math.round((((this.PhraseCount / this.MsgStats.length) * 100) + Number.EPSILON) * 100) / 100;
  }

  editedMessagePercentage(): number {
    return Math.round((((this.EditedCount / this.MsgStats.length) * 100) + Number.EPSILON) * 100) / 100;
  }

  messagesPerChannel(): Array<{ id: string; msgCount: number; }> {
    const res: Array<{ id: string; msgCount: number; }> = [];

    for (const stat of this.MsgStats) {
      if (res.some((channel) => channel.id !== stat.ChanId)) res.push({ id: stat.ChanId, msgCount: 0 });

      res.find((channel) => channel.id === stat.ChanId).msgCount += 1;
    }
      
    return res;
  }

  averageMessagesPerChannel(): number {
    return Math.round(((this.MsgStats.length / this.ChannelCount) + Number.EPSILON) * 100) / 100;
  }
}
