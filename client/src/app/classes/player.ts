import { ScrabbleLetter } from './scrabble-letter';
import { ERROR_NUMBER } from './utilities';

// TODO: cant we make player non abstract, and virtual extends it?
export class Player {
    socketId: string;
    roomId: number;
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True if it is this player's turn, false if not.
    isWinner: boolean;

    constructor(initInfo: string) {
        if (typeof initInfo === 'string') {
            this.name = initInfo;
            this.score = 0;
            this.letters = [];
            this.isActive = false;
            this.isWinner = false;
            this.socketId = ''; // used to know which player is the local player in game service init method
        }
    }
}

// TODO: doesnt recognize removeLetter() method when from server player
// so was put in a function (see if can fix bug, pseudo copy constructor attempt didn't work)
export const removePlayerLetters = (lettersToRemove: string, player: Player): boolean => {
    const oldRack: ScrabbleLetter[] = player.letters;

    for (const singleLetter of lettersToRemove) {
        const indexLetter = player.letters.findIndex((letter) => letter.character === singleLetter);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (indexLetter > ERROR_NUMBER) {
            player.letters.splice(indexLetter, 1);
        } else {
            player.letters = oldRack;
            return false;
        }
    }
    return true;
};
