import {
  GuardFunction
} from "@typeit/discord";
import { answerify } from '../../utils/functions/message';

export const NotDM: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (message.guild !== null) {
    await next();
  } else {
    message.author.createDM()
    .then((channel) => channel.send(
      answerify('Sorry, I only respond in servers...')
    ))
    .catch((err: Error) => {
      console.error(err);
    });
  }
}