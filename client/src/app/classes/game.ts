import { LetterStock } from './letter-stock';
import { Dictionary } from './dictionary';
import { LocalPlayer } from './local-player';
import { ScrabbleBoard } from './scrabble-board';
import { VirtualPlayer } from './virtual-player';

export class Game {
    scrabbleBoard: ScrabbleBoard;
    localPlayer: LocalPlayer;
    virtualPlayer: VirtualPlayer;
    totalCountDown: number;
    dictionary: Dictionary;
    randomBonus: boolean;
    stock: LetterStock = new LetterStock();
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
}
