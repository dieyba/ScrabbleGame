import { ScrabbleLetter } from './scrabble-letter';

export abstract class Player {
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.

    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.letters = [];
        this.isActive = false;
    }
    addLetter(letterToAdd: ScrabbleLetter): void {
        this.letters.push(letterToAdd);
    }

    // le même problème resize
    removeLetter(lettersToRemove: string): boolean {
        // for (ScrabbleLetter letter : this.letters) {
        //     if (letter)
        // }

        //let removedLetter: ScrabbleLetter[] = [];
        let oldRack: ScrabbleLetter[] = this.letters;

        for (let i = 0; i < lettersToRemove.length; i++) {
            let indexLetter = this.letters.findIndex((letter) => letter.character === lettersToRemove[i]);
            if (indexLetter > -1) {
                this.letters.splice(indexLetter, 1);
            } else {
                this.letters = oldRack;
                return false;
            }
        }
        return true;

        // for (let i: number = 0; i < lettersToRemove.length; i++) {
        //     for (let j: number = 0; j < this.letters.length; j++) {
        //         if (this.letters[j].character == lettersToRemove[i]) {
        //             removedLetter[i] = this.letters[j];
        //         }
        //         else {
        //             return false;
        //         }
        //     }
        // }

        // // for (let i: number = 0; i < this.letters.length; i++) {
        // //     if (this.letters[i].character == letterToRemove) {
        // //         removedLetter[i] = this.letters[i];

        // //         return true;
        // //     }
        // // }

        // return false;
    }
}
