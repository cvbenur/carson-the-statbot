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
import { WS_SYMBOL as DEFAULT_WS } from '../../../utils/config/default.config';


export abstract class Setspace {

  @Command('setspace :newSymbol')
  @Description('Set or reset Carson\'s whitespace identifier.')
  @Infos({ forAdmins: true })
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {
    Setspace.symbol = await this.fetchWhitespaceSymbol(message.guild.id);


    switch (message.commandContent.split(' ').length) {
      case 1:
        message.reply(
          answerify('Check yourself, fool. Something\'s missing with this command.')
        );
        break;
      case 2:
        if (message.args.newSymbol === 'default') {
          await setWhitespaceSymbol(message.guild.id, DEFAULT_WS);
          message.reply(
            answerify(`Okeydoke, reset whitespace identifier to \`${Setspace.symbol}\`.`)
          );
        } else if (message.args.newSymbol === Setspace.symbol) {
          message.reply(
            answerify('Hold up. This one\'s already in use.\nJeez, wake up already!')
          );
        } else {
          await setWhitespaceSymbol(message.guild.id, message.args.newSymbol);
          message.reply(
            answerify(`Alrighty! Whitespace identifier now set to \`${Setspace.symbol}\`.\nNothing else matters now.`)
          );
        }
        break;
      default:
        message.reply(
          answerify('Hold on up a minute.\nToo. Many. Words.\nWho do you think you are with your big fancy commands?')
        );
    }
  }


  static symbol: string;


  private async fetchWhitespaceSymbol(guildId: string): Promise<string> {
    const ref = await db.guildsCollection.doc(guildId).get();
    return ref.data().wsSymbol;
  }
}


export async function setWhitespaceSymbol(guildId: string, newSymbol: string): Promise<void> {
  await db.guildsCollection
    .doc(guildId)
    .update({
      wsSymbol: newSymbol,
    })
    .then(() => {
      Setspace.symbol = newSymbol;
    })
    .catch((err: Error) => {
      console.log(err);
    })
}