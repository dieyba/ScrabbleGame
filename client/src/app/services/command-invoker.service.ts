import { Injectable } from '@angular/core';
TODO: // import actual game service
import { Command, GameService } from '../classes/commands'; 
import { Vec2 } from '../classes/vec2';

@Injectable({
  providedIn: 'root'
})

type cmdParam = {position: Vec2, orientation:string,letters:string} | {lettersToExchange: string};

export class CommandInvokerService {
  private gameService: GameService;
  constructor(gameService: GameService){
    this.gameService = gameService
  };

  public executeCommand(cmd: Command): void {
    cmd.execute();
  }
  
  // public createCommand():Command{
  // }


}
