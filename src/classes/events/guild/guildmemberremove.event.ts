import { On } from '@typeit/discord';
import { GuildMember } from 'discord.js';
import * as db from '../../../utils/config/firebase.config';


export abstract class GuildMemberRemove {

  // Handle guild member removal
  @On('guildMemberRemove')
  async onGuildMemberRemove(member: GuildMember): Promise<void> {
    // Update guild's member count
    db.guildsCollection.doc(member.guild.id).update({
      memberCount: member.guild.memberCount,
    });
  }
}