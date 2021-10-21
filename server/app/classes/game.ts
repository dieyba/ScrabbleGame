import { Dictionary } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

export interface Game {
    id: string;
    scrabbleBoard: ScrabbleBoard;
    player1: Player;
    player2: Player;
    totalCountDown: number;
    dictionary: Dictionary;
    randomBonus: boolean;
    stock: ScrabbleLetter[];
    turnPassed: boolean;
    hasTurnsBeenPassed: boolean[];
    isEndGame: boolean;
    newWord: ScrabbleWord;
}
