import { Injectable } from '@angular/core';
// TODO: import actual game service
import { Command } from '../classes/commands'; 

@Injectable({
  providedIn: 'root'
})

type GameService = {};

export class CommandInvokerService {
    private gameService: GameService;

    constructor(gameService: GameService){
        this.gameService = gameService;
    }

    executeCommand(cmd: Command): void {
      // if(cmd.execute !== undefined){
        cmd.execute();
      // }
    }

}

