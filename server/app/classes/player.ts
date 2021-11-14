import { ScrabbleLetter } from './scrabble-letter';
import { ERROR_NUMBER } from './utilities';

export class Player {
    socketId: string;
    roomId: number;
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean;
    isWinner: boolean;

    constructor(name: string, socketId: string, roomId?: number) {
        this.name = name;
        this.socketId = socketId;
        this.roomId = roomId !== undefined ? roomId : ERROR_NUMBER;
        this.isActive = false;
        this.score = 0;
        this.letters = [];
    }

    // TODO: See if need to delete (see client player class)
    // addLetter(letterToAdd: ScrabbleLetter): void {
    //     this.letters.push(letterToAdd);
    // }

    // removeLetter(lettersToRemove: string): boolean {
    //     const oldRack: ScrabbleLetter[] = this.letters;

    //     for (const singleLetter of lettersToRemove) {
    //         const indexLetter = this.letters.findIndex((letter) => letter.character === singleLetter);
    //         // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    //         if (indexLetter > -1) {
    //             this.letters.splice(indexLetter, 1);
    //         } else {
    //             this.letters = oldRack;
    //             return false;
    //         }
    //     }
    //     return true;
    // }
}
