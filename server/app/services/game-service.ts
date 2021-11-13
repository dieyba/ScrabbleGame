
// TODO: delete this game service from server

// import { ClientGameInitParameters, GameParameters } from '@app/classes/game-parameters';
// import { Service } from 'typedi';
// import { ValidationService } from './validation.service';
// import { WordBuilderService } from './word-builder.service';

// export const TIMER_INTERVAL = 1000;
// export const DEFAULT_LETTER_COUNT = 7;
// export const MAX_TURNS_PASSED = 6;

// @Service()
// export class GameService {
//     game: GameParameters;
//     // isVirtualPlayerObservable: Observable<boolean>;
//     // virtualPlayerSubject: BehaviorSubject<boolean>;
//     // timer: string; isn't this only for the ui? not needed on server no?
//     intervalValue: NodeJS.Timeout;

//     constructor(
//         protected validationService: ValidationService,
//         protected wordBuilder: WordBuilderService,

//     ) {}
//     initializeGame(gameParams: GameParameters): ClientGameInitParameters {
//         this.game = gameParams;
//         const starterPlayerIndex = Math.round(Math.random()); // initialize random starter player
//         this.game.players[starterPlayerIndex].isActive = true;
//         this.game.players.forEach(player => {
//             player.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
//         });
//         const clientInitParams: ClientGameInitParameters = {
//             players: this.game.players,
//             totalCountDown: this.game.totalCountDown,
//             scrabbleBoard: this.game.scrabbleBoard.squares,
//             stock: this.game.stock.letterStock,
//             gameMode: this.game.gameMode,
//         }
//         // console.log('creator:', this.game.players[0].name);
//         // console.log('opponent:', this.game.players[1].name);
//         // console.log('creator is normal player:', this.game.players[0] instanceof Player);
//         // console.log('opponent is a jv:', this.game.players[1] instanceof VirtualPlayer, '\n');
//         return clientInitParams;
//     }
// }
