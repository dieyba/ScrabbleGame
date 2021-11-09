import { ScrabbleLetter } from './scrabble-letter';

export class Player {
    socketId: string;
    roomId: number;
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True is it is this players turn, false if not.
    isWinner: boolean;

    constructor(name: string, socketId: string) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = -1;
        this.isActive = false;
        this.score = 0;
        this.letters = [];
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
