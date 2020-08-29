import { MemberStat } from './stats';


export class StatsObject {

  // Attributes
  private occurrences = 0;
  private memberStats: Array<MemberStat>;


  // Ctor
  constructor() {
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


  addMemberStat(stat: MemberStat): void {
    this.Occurrences += stat.PhraseCount;

    this.MemberStats.push(stat);
  }
}
