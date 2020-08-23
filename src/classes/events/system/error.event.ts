import { On } from '@typeit/discord';


export abstract class Error {

  // Handle errors
  @On('error')
  onError(err: Error): void {
    console.error(err);
  }
}