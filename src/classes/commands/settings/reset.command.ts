import {
  Command,
  CommandMessage,
  Description,
  Infos,
  Guard,
} from '@typeit/discord';
import { answerify } from '../../../utils/functions/message';
import {
  PREFIX as DEFAULT_PREFIX,
  WS_SYMBOL as DEFAULT_WS,
} from '../../../utils/config/default.config';
import { setPrefix } from './prefix.command';
import { setWhitespaceSymbol } from './setspace.command';
import { NotDM } from '../../guards/notdm.guard';


export abstract class Reset {

  @Command('reset')
  @Description('Reset Carson\'s configuration to default.')
  @Infos({ forAdmins: true })
  @Guard(NotDM)
  async execute(message: CommandMessage): Promise<void> {


    switch (message.commandContent.split(' ').length) {
      case 1:
        await setPrefix(message.guild.id, DEFAULT_PREFIX);
        await setWhitespaceSymbol(message.guild.id, DEFAULT_WS);

        await message.reply(
          answerify(
            "**Reset Carson's settings to default.**\nPrefix set to `" + DEFAULT_PREFIX + "`.\nWhitespace identifier set to `" + DEFAULT_WS + "`."
          )
        );
        break;
      default:
        await message.reply(
          answerify('Too many arguments on this one.\nJust chill.')
        );
    }
  }
}