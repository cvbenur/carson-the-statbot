import {
  Command,
  CommandMessage,
  Description,
  Infos,
} from '@typeit/discord';
import { answerify } from '../../../utils/functions/message';


export abstract class Test {

  @Command('test')
  @Description('A test command for debugging.')
  @Infos({ forAdmins: true })
  async execute(message: CommandMessage): Promise<void> {
    message.reply(answerify('Test', message.author));
  }
}
