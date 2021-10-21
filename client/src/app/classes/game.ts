import { Dictionary } from './dictionary';
import { LetterStock } from './letter-stock';
import { LocalPlayer } from './local-player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleWord } from './scrabble-word';

export interface Game {
    id: string;
    scrabbleBoard: ScrabbleBoard;
    player1: LocalPlayer;
    player2: LocalPlayer;
    totalCountDown: number;
    dictionary: Dictionary;
    randomBonus: boolean;
    stock: LetterStock;
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
    newWord: ScrabbleWord;
}
