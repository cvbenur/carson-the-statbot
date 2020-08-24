import { On } from '@typeit/discord';
import { Guild } from 'discord.js';
import * as db from '../../../utils/config/firebase.config';
import * as Default from '../../../utils/config/default.config';


export abstract class GuildCreate {

  // Handle guild creation
  @On('guildCreate')
  async onGuildCreate(guilds: [Guild]): Promise<void> {
    // Get new guild's info and store it into DB
    const newGuild = guilds[0];

    db.guildsCollection.doc(newGuild.id).set({
      guildId: newGuild.id,
      guildName: newGuild.name,
      guildOwner: newGuild.owner.user.username,
      guildOwnerId: newGuild.owner.id,
      memberCount: newGuild.memberCount,
      prefix: Default.PREFIX,
      wsSymbol: Default.WS_SYMBOL,
    });
  }
}