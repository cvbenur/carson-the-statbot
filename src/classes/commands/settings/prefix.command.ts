import {
  Command,
  CommandMessage,
  Description,
  Infos,
  Guard,
} from '@typeit/discord';
import * as db from '../../../utils/config/firebase.config';
import { answerify } from '../../../utils/functions/message';
import { NotDM } from '../../guards/notdm.guard';
import { PREFIX as DEFAULT_PREFIX } from '../../../utils/config/default.config';


export abstract class Prefix {

  @Command('prefix :newPref')
  @Description('Set or reset Carson\'s prefix.')
  @Infos({ forAdmins: true })
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {
    Prefix.pref = await this.fetchPrefix(message.guild.id);

    switch (message.commandContent.split(' ').length) {
      case 1:
        message.reply(
          answerify('Something\'s missing here.\nI can *feel* it.\nNot sure what, though. Check it yourself.')
        );
        break;
      case 2:
        if (message.args.newPref === 'default') {
          await setPrefix(message.guild.id, DEFAULT_PREFIX);
          message.reply(
            answerify(`Prefix reset to \`${Prefix.pref}\`.\nI'll only answer to this now. Don't even try, won't work.`)
          );
        } else if (message.args.newPref === Prefix.pref) {
          message.reply(
            answerify('Uhm... That\'s already my prefix.\nDid you not realize this as you were typing this very command ?')
          );
        } else {
          await setPrefix(message.guild.id, message.args.newPref);
          message.reply(
            answerify(`Gotcha! I will now only answer to \`${Prefix.pref}\`.\nForget eeeeverything else...\n***Stares into the distance***`)
          );
        }
        break;
      default:
        message.reply(
          answerify('Hold on there, chief.\nToo many words on here, speak slower so I can understand.')
        );
    }
  }



  static pref: string;


  private async fetchPrefix(guildId: string): Promise<string> {
    const ref = await db.guildsCollection.doc(guildId).get();
    return ref.data().prefix;
  }
}


export async function setPrefix(guildId: string, newPref: string): Promise<void> {
  await db.guildsCollection
    .doc(guildId)
    .update({
      prefix: newPref,
    })
    .then(() => {
      Prefix.pref = newPref;
    })
    .catch((err: Error) => {
      console.log(err);
    })
}