import { On } from '@typeit/discord';
import { GuildMember } from 'discord.js';
import * as db from '../../../utils/config/firebase.config';


export abstract class GuildMemberAdd {

  // Handle guild member addition
  @On('guildMemberAdd')
  async onGuildMemberAdd(member: GuildMember): Promise<void> {
    // Update guild's member count
    db.guildsCollection.doc(member.guild.id).update({
      memberCount: member.guild.memberCount,
    });
  }
}