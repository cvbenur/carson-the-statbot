import { Message } from 'discord.js';
import { answerify } from './message';


// Checking the user's permissions
export function permCheck(command: string, msg: Message, permissions): boolean {
  let allowed = 0;
  let deniedList = "Sorry, you don't have the right permissions for this command.\n\nThe required permissions are :\n";

  // Getting the required permissions
  const targetPerms = permissions.filter((perm) => perm.name === command)[0].perms;

  // Checking that the user has the correct permissions
  targetPerms.forEach((p) => {
    if (msg.member.hasPermission(p)) allowed += 1;
    else deniedList += `- ${p}\n`;
  });

  // If the user has every required Permission
  if (allowed === targetPerms.length) return true;

  // Else
  msg.reply(
    answerify(
      `${deniedList}\nContact one of your server's administrators in order to sort this out.`,
    ),
  );
  return false;
}