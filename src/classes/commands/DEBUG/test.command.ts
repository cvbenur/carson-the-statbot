import {
  Command, CommandMessage,
} from '@typeit/discord';
import { answerify } from '../../../utils/functions/message';


export abstract class Test {

  @Command('test')
  async execute(message: CommandMessage): Promise<void> {
    message.reply(answerify('Test', message.author));
  }
}
