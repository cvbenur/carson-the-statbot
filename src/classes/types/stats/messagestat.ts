import moment = require('moment');


export class MessageStat {

  // Attributes
  private chanId: string;
  private wordCount: number;
  private containsPhrase = false;
  private edited = false;
  private date: moment.Moment;


  // Ctor
  constructor(chanId: string, wordCount: number, containsPhrase: boolean, edited: boolean, date: moment.Moment) {
    this.chanId = chanId;
    this.wordCount = wordCount;
    this.containsPhrase = containsPhrase;
    this.edited = edited;
    this.date = date;
  }


  // Methods
  get ChanId(): string {
    return this.chanId;
  }
  set ChanId(chanId: string) {
    this.chanId = chanId;
  }

  get WordCount(): number {
    return this.wordCount;
  }
  set WordCount(wordCount: number) {
    this.wordCount = wordCount;
  }

  get ContainsPhrase(): boolean {
    return this.containsPhrase;
  }
  set ContainsPhrase(containsPhrase: boolean) {
    this.containsPhrase = containsPhrase;
  }

  get Edited(): boolean {
    return this.edited;
  }
  set Edited(edited: boolean) {
    this.edited = edited;
  }

  get Date(): moment.Moment {
    return this.date;
  }
  set Date(date: moment.Moment) {
    this.date = date;
  }
}