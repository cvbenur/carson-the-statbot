import { On } from '@typeit/discord';
import { Guild } from 'discord.js';
import * as db from '../../../utils/config/firebase.config';


export abstract class GuildDelete {

  // Handle guild deletion
  @On('guildDelete')
  async onGuildDelete(guilds: [Guild]): Promise<void> {
    // Remove guild info from DB
    const guild = guilds[0];
    await db.guildsCollection.doc(guild.id).delete();
  }
}