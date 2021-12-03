import { GoalType } from '@app/classes/goal/goal';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ERROR_NUMBER } from '@app/classes/utilities/utilities';

export class Player {
    socketId: string;
    roomId: number;
    name: string;
    score: number;
    letters: ScrabbleLetter[];
    isActive: boolean; // True if it is this player's turn, false if not.
    isWinner: boolean;
    goal: GoalType;

    constructor(initInfo: string) {
        this.name = initInfo;
        this.score = 0;
        this.letters = [];
        this.isActive = false;
        this.isWinner = false;
        this.socketId = ''; // used to know which player is the local player in game service init method
    }
}
export const removePlayerLetters = (lettersToRemove: string, player: Player): boolean => {
    const oldRack: ScrabbleLetter[] = player.letters;

    for (const singleLetter of lettersToRemove) {
        const indexLetter = player.letters.findIndex((letter) => letter.character === singleLetter);
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
