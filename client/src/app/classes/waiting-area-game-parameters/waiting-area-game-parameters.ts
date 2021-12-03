import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { GameType, UNDEFINE_ID } from '@app/classes/game-parameters/game-parameters';
import { ERROR_NUMBER } from '@app/classes/utilities/utilities';

export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[];
    creatorId: string;
    joinerId: string;
}

export class WaitingAreaGameParameters {
    gameRoom: GameRoom;
    creatorName: string;
    joinerName: string;
    dictionary: DictionaryInterface;
    totalCountDown: number;
    isRandomBonus: boolean;
    gameMode: GameType;
    isLog2990: boolean;

    constructor(
        gameMode: GameType,
        capacity: number,
        dictionary: DictionaryInterface,
        totalCountDown: number,
        isRandomBonus: boolean,
        isLog2990: boolean,
        creatorPlayerName: string,
        opponentName?: string,
    ) {
        this.gameMode = gameMode;
        this.gameRoom = {
            idGame: ERROR_NUMBER,
            capacity,
            playersName: new Array<string>(),
            creatorId: UNDEFINE_ID,
            joinerId: UNDEFINE_ID,
        };
        this.dictionary = dictionary;
        this.totalCountDown = totalCountDown;
        this.isRandomBonus = isRandomBonus;
        this.isLog2990 = isLog2990;
        this.creatorName = creatorPlayerName;
        this.joinerName = opponentName !== undefined ? opponentName : '';
    }
}
