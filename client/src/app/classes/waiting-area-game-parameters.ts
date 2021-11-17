import { DictionaryType } from './dictionary';
import { GameType, UNDEFINE_ID } from './game-parameters';
import { ERROR_NUMBER } from './utilities';

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
    dictionaryType: DictionaryType;
    totalCountDown: number;
    isRandomBonus: boolean;
    gameMode: GameType;
    isLOG2990: boolean;

    constructor(
        gameMode: GameType,
        capacity: number,
        dictionaryType: DictionaryType,
        totalCountDown: number,
        isRandomBonus: boolean,
        isLOG2990: boolean,
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
        this.dictionaryType = dictionaryType;
        this.totalCountDown = totalCountDown;
        this.isRandomBonus = isRandomBonus;
        this.isLOG2990 = isLOG2990;
        this.creatorName = creatorPlayerName;
        this.joinerName = opponentName !== undefined ? opponentName : '';
    }
}
