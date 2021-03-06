import { Player } from '@app/classes/player/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { ValidationService } from '@app/services/validation.service/validation.service';

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
    PlaceLetterWorthTenPts = 'Placer un mot contenant une lettre valant 10 points. (+20pts)',
    FormTwoLettersStarsOnly = 'Former un mot avec seulement deux lettres qui contient les deux étoiles (*). (+20pts)',
    FormWordWithLettersFromName = 'Former un mot avec au moins 3 lettres de ton nom.' +
        " Chaque lettre peut être utilisé le nombre de fois qu'elle apparaît dans ton nom. (+30pts)",
    FormAnExistingWord = "Former un mot d'au moins 5 lettres qui a déjà été former auparavant. (+20pts)",
    FormThreeWords = 'Former 3 mots avec un seul placement. (+50pts)',
    PlaceLetterOnBoardCorner = 'Placer une lettre dans un des 4 coins du jeu. (+30pts)',
    ActivateTwoBonuses = 'Activer 2 bonus avec un seul placement. (+30pts)',
    PlaceLetterOnColorSquare = 'Placer la lettre x dans une case de couleur y. (+50pts)',
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

    initialize?(goalParameters: ScrabbleLetter | ValidationService | Player[]): void;
    abstract achieve(wordsFormed: ScrabbleWord[], newlyPlacedLetters?: ScrabbleLetter[], activePlayerName?: string): number;
}
