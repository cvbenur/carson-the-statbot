import { Command, CommandMessage, Description, Guard } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import { Main } from '../../..';
import { EMBED_COLOR } from '../../../utils/config/default.config';
import { NotDM } from '../../guards/notdm.guard';


export abstract class Help {

  @Command('help')
  @Description('A list of useful commands for Carson.')
  @Guard(NotDM)

  async execute(message: CommandMessage): Promise<void> {

    message.channel.send(
      new MessageEmbed()
        .setAuthor(Main.Client.user.username, Main.Client.user.displayAvatarURL())
        .setTitle("Carson the StatBot")
        .setColor(EMBED_COLOR)
        .setDescription(
          'Carson is an easy to use - although VERY sassy - statistics compiling bot for your Discord server.' +
          '\n\nHe can pretty much tell you anything you might want to know, with pretty, easy - to - read little graphs.' +
          '\nHere are a few commands for you to try out :\n'
        )
        .addField('Help', 'This command.')
        .addField('Ping', 'A very basic \`:ping_pong: Ping\` command.')
        .addField('Stats', 'Carson\'s main command.')
        .setFooter(message.author.username, message.author.displayAvatarURL())
    )
  }
}