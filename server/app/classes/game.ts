import { Dictionary } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';

export class Game {
    scrabbleBoard: ScrabbleBoard;
    localPlayer: Player;
    virtualPlayer: Player;
    totalCountDown: number;
    dictionary: Dictionary;
    randomBonus: boolean;
    stock: ScrabbleLetter[];
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
}
