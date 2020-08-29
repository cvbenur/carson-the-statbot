import { Channel } from 'discord.js';
import moment = require('moment');


export class ChannelStat {

  // Attributes
  private msgCount = 0;
  private date: moment.Moment;


  // Ctor
  constructor(channel: Channel) {
    this.date = moment(channel.createdAt);
  }
  

  // Methods
  get MsgCount(): number {
    return this.msgCount;
  }
  set MsgCount(msgCount: number) {
    this.msgCount = msgCount;
  }

  get Date(): moment.Moment {
    return this.date;
  }
  set Date(date: moment.Moment) {
    this.date = date;
  }
}