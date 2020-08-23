import { CommandMessage, CommandNotFound, Discord, Guard } from '@typeit/discord';
import { Message } from 'discord.js';
import * as db from '../../utils/config/firebase.config';
import * as Path from 'path';
import { PREFIX as DEFAULT_PREFIX } from '../../utils/config/default.config';
import { answerify } from '../../utils/functions/message';
import { NotDM } from '../guards/notdm.guard';


async function prefixBehaviour(message: Message): Promise<string> {

  const ref = db.guildsCollection.doc(message.guild.id);
  const doc = await ref.get();

  if (doc.exists) return doc.data().prefix;
  else return DEFAULT_PREFIX;
}


@Discord(prefixBehaviour, {
  import: [
    Path.join(__dirname, '..', 'commands', '**/*.command.js'),
    Path.join(__dirname, '..', 'events', '**/*.event.js'),
  ]
})
export abstract class Carson {

  @CommandNotFound()
  @Guard(NotDM)
  private notFound(message: CommandMessage) {
    message.reply(
      answerify('I don\'t recognize this command. Have you been using other bots behind my back ??\n***Stares motherfuckerly***')
    );
  }
}
