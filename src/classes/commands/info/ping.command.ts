import {
  Command,
  CommandMessage,
  Description,
  Guard,
} from '@typeit/discord';
import { Client, Message } from 'discord.js';
import { answerify } from '../../../utils/functions/message';
import { NotDM } from '../../guards/notdm.guard';


export abstract class Ping {
  
  @Command('ping')
  @Description('Pings Carson.')
  @Guard(NotDM)
  async execute(message: CommandMessage, bot: Client): Promise<void> {

    // Acknowledging command
    const reply: Message = await message.reply(answerify(":ping_pong: Pinging...\n"));


    // Getting the answer
    let pingAnswer = ":ping_pong: ";

    switch (Math.floor(Math.random() * 6) + 1) {
      case 0:
        pingAnswer += "Pong !\n";
        break;

      case 1:
        pingAnswer += "'Ping' yourself !\n";
        break;

      case 2:
        pingAnswer += "Oh, I'm fine, thanks for asking...\n";
        break;

      case 3:
        pingAnswer +=
          "Well, well, well, who do we have here! Here's your 'Pong', kind stranger!\n";
        break;

      case 4:
        pingAnswer += "Nope. Not saying it. Just because I don't want to.\n";
        break;

      case 5:
        pingAnswer +=
          "***Suddenly wakes up***\nHuh? What? Nope, not sleeping! Definitely wasn't sleeping !\n";
    }


    // Replying
    reply.edit(
      answerify(
        pingAnswer +
      `\nPong latency : ${Math.floor(
          reply.createdAt.getTime() - message.createdAt.getTime()
        )} ms.\nAPI Latency : ${Math.round(bot.ws.ping)} ms.`
      )
    );
  }
}