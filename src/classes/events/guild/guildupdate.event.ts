import { On } from '@typeit/discord';
import { Guild } from 'discord.js';
import * as db from '../../../utils/config/firebase.config';


export abstract class GuildUpdate {

  // Handle guild update
  @On('guildUpdate')
  async onGuildUpdate(oldGuild: Guild, newGuild: Guild): Promise<void> {
    // Update guild's info
    db.guildsCollection.doc(oldGuild.id).update({
      guildName: newGuild.name,
      guildOwner: newGuild.owner.user.username,
      guildOwnerId: newGuild.owner.id,
    });
  }
}