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

    // TODO: see if calling player class' methods works in multiplayer mode too
    // calculateRackPoints(player: Player): number {
    //     let totalValue = 0;
    //     player.letters.forEach((letter) => {
    //         totalValue += letter.value;
    //     });
    //     return totalValue;
    // }
    // removePlayerLetters(lettersToRemove: string, player: Player): boolean {
    //     const oldRack: ScrabbleLetter[] = player.letters;

    //     for (const singleLetter of lettersToRemove) {
    //         const indexLetter = player.letters.findIndex((letter) => letter.character === singleLetter);
    //         // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    //         if (indexLetter > ERROR_NUMBER) {
    //             player.letters.splice(indexLetter, 1);
    //         } else {
    //             player.letters = oldRack;
    //             return false;
    //         }
    //     }
    //     return true;
    // }
}

// TODO: didn't recognize removeLetter() when called in game service if from a server player, see if that's still the case
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
export const calculateRackPoints = (player: Player): number => {
    let totalValue = 0;
    player.letters.forEach((letter) => {
        totalValue += letter.value;
    });
    return totalValue;
};
