// eslint-disable-next-line max-classes-per-file
import { Player } from './player';
import { ScrabbleWord } from './scrabble-word';

// TODO: remove what is in game params
export enum Goals {
    PlaceLetterWorthTenPts = 0, // Place a word containing a letter with a 10 pts value
    FormTwoLettersStarsOnly = 1, // Form 2 letter word, both letters are *
    FormWordWithLettersFromName = 2 /* Form a word containing at least 3 letters from the player's name
        (can be same letter, but different occurence)*/,
    FormAnExistingWord = 3, // Form a word already on the board
    FormThreeWords = 4, // Form three words at the same time
    PlaceLetterOnBoardCorner = 5, // Place a letter on one of the 4 boaard corners
    ActivateTwoBonuses = 6, // Active 2 bonuses at the same time / place a word with 2 letters on a colour square
    PlaceLetterOnColorSquare = 7, // Place letter x on a square of color y. x and y are randomly chosen at start of game
}

export enum GoalDescriptions {
    PlaceLetterWorthTenPts = 'Place a word containing a letter with a 10 pts value',
    FormTwoLettersStarsOnly = 'Form 2 letter word, both letters are *',
    FormWordWithLettersFromName = 'Form a word containing at least 3 letters from the player name(can be same letter, but different occurence)',
    FormAnExistingWord = 'Form a word already on the board',
    FormThreeWords = 'Form three words at the same time',
    PlaceLetterOnBoardCorner = 'Place a letter on one of the 4 boaard corners',
    ActivateTwoBonuses = 'Active 2 bonuses at the same time / place a word with 2 letters on a colour square',
    PlaceLetterOnColorSquare = 'Place letter x on a square of color y. x and y are randomly chosen at start of game',
}

export enum GoalPoints {
    PlaceLetterWorthTenPts = 20,
    FormTwoLettersStarsOnly = 20,
    FormWordWithLettersFromName = 30,
    FormAnExistingWord = 20,
    FormThreeWords = 50,
    PlaceLetterOnBoardCorner = 30,
    ActivateTwoBonuses = 30,
    PlaceLetterOnColorSquare = 50,
}

export abstract class Goal {
    description: string;
    isExecuted: boolean;
    players: Player[]; // player(s) who has/have this goal
    constructor() {
        this.players = new Array<Player>();
        this.description = '';
        this.isExecuted = false;
    }
    abstract execute(wordsFormed: ScrabbleWord[]): number;
}
