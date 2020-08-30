import moment = require('moment');


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