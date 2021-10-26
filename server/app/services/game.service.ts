import { GameParameters } from '@app/classes/game-parameters';
import { Service } from 'typedi';

@Service()
export class GameService {
    games: GameParameters[];
    constructor(/*private readonly validationService: ValidationService*/) {}

    // placeLetter(game: GameParameters, placeParams: PlaceParams) {
    //     let result;
    //     if (game.creatorPlayer.isActive === true) {
    //         result = this.validationService.place(game.creatorPlayer, placeParams, game);
    //     } else {
    //         result = this.validationService.place(game.opponentPlayer, placeParams, game);
    //     }
    //     this.updateGameById(game.gameRoom.idGame, game)
    // }

    updateGameById(id: number, updatedGame: GameParameters) {
        this.games.forEach(game => {
            if (game.gameRoom.idGame === id) {
                game = updatedGame;
            }
        });
    }
}
