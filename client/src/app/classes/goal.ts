import { ValidationService } from '@app/services/validation.service';
import { ScrabbleLetter } from './scrabble-letter';
import { ScrabbleWord } from './scrabble-word';

export enum GoalType {
    PlaceLetterWorthTenPts = 0,
    FormTwoLettersStarsOnly = 1,
    FormWordWithLettersFromName = 2,
    FormAnExistingWord = 3,
    FormThreeWords = 4,
    PlaceLetterOnBoardCorner = 5,
    ActivateTwoBonuses = 6,
    PlaceLetterOnColorSquare = 7,
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
    type: GoalType;
    description: string;
    isAchieved: boolean;
    constructor() {
        this.description = '';
        this.isAchieved = false;
    }
    initialize?(goalParameters: ScrabbleLetter | ValidationService | string): void;
    abstract achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters?: ScrabbleLetter[]): number;
}
