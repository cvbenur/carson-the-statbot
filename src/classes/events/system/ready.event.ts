import { On } from '@typeit/discord';


export abstract class Ready {

  // On startup
  @On('ready')
  onReady(): void{
    console.log('Carson is now ready to work.');
  }
}