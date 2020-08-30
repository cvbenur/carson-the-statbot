import {
  Command,
  CommandMessage,
  Description,
  Guard,
} from '@typeit/discord';
import * as db from '../../../utils/config/firebase.config';
import { answerify } from '../../../utils/functions/message';
import { NotDM } from '../../guards/notdm.guard';


export abstract class Start {

  @Command('start')
  @Description('A simple command to get started with Carson.')
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {
    
    const ref = await db.guildsCollection.doc(message.guild.id).get();
    const prefix = ref.data().prefix.trim();

    await message.reply(
      answerify(
        `Just type \`${prefix} help\` to get started.`
      )
    );
  }
}