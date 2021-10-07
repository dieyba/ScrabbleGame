import { ScrabbleLetter } from './scrabble-letter';

export abstract class Player {
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.
    isWinner: boolean;

    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.letters = [];
        this.isActive = false;
        this.isWinner = false;
    }

    addLetter(letterToAdd: ScrabbleLetter): void {
        this.letters.push(letterToAdd);
    }

    removeLetter(lettersToRemove: string): boolean {
        const oldRack: ScrabbleLetter[] = this.letters;

        for (const singleLetter of lettersToRemove) {
            const indexLetter = this.letters.findIndex((letter) => letter.character === singleLetter);
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (indexLetter > -1) {
                this.letters.splice(indexLetter, 1);
            } else {
                this.letters = oldRack;
                return false;
            }
        }
        return true;
    }
}
