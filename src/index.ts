import { Client } from '@typeit/discord';
import * as env from './utils/config/env.config';


export class Main {
  private static bot: Client;

  static get Client(): Client {
    return this.bot;
  }

  static async start(): Promise<void> {
    this.bot = new Client();

    await this.bot.login(
      env.TOKEN,
      `${__dirname}/classes/bots/*.ts`,
      `${__dirname}/classes/bots/*.js`,
    ).then(async () => {
      await this.bot.user.setActivity('Benur rewrite me in TS from scratch', { type: 'WATCHING' })
    }).catch((err) => {
      console.log(err);
    });

    console.log(Client.getCommands());
  }
}

Main.start();
