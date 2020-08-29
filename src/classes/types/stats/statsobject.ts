export class StatsObject {

  // Attributes
  private occurrences: number;
  private memberStats: Array<MemberStat>;


  // Ctor
  constructor() {
    this.occurrences = 0;
    this.memberStats = [];
  }


  // Methods
  get Occurrences(): number {
    return this.occurrences;
  }
  set Occurrences(occurrences: number) {
    this.occurrences = occurrences;
  }

  get MemberStats(): Array<MemberStat> {
    return this.memberStats;
  }
  set MemberStats(memberStats: Array<MemberStat>) {
    this.memberStats = memberStats;
  }
}



class MemberStat {

  // Attributes
  private id: string;
  private msgCount: number;
  private phraseCount: number;


  // Ctor
  constructor(id: string) {
    this.id = id;
    this.msgCount = 0;
    this.phraseCount = 0;
  }


  // Methods
  get Id(): string {
    return this.id;
  }
  set Id(id: string) {
    this.id = id;
  }

  get MsgCount(): number {
    return this.msgCount;
  }
  set MsgCount(msgCount: number) {
    this.msgCount = msgCount;
  }

  get PhraseCount(): number {
    return this.phraseCount;
  }
  set PhraseCount(phraseCount: number) {
    this.phraseCount = phraseCount;
  }


  phraseCountPercentage(): number {
    return Math.round((((this.MsgCount * this.PhraseCount) / 100) + Number.EPSILON) * 100) / 100;
  }
}
