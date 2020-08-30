import { Guard, On } from '@typeit/discord';
import { NotBot } from '../../guards/notbot.guard';


export abstract class MessageEvent {

  // Handle message
  @On('message')
  @Guard(NotBot)
  async onMessage(): Promise<void> {
    return;
  }
}