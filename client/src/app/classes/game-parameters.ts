import { DictionaryType } from './dictionary';
import { LetterStock } from './letter-stock';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { Square } from './square';
import { ERROR_NUMBER } from './utilities';

const UNDEFINE_ID = 'none';

export enum GameType {
    Solo = 0,
    MultiPlayer = 1,
}

export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[]; // TODO: needed for waiting area component in client, i think?
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
            idGame: ERROR_NUMBER, // TODO: check to make sure room id is set in server when creating multiplayer game
            capacity: capacity,
            playersName: new Array<string>(),
            creatorId: UNDEFINE_ID,  // TODO: check if not UNDEFINE_ID in server methods too?
            joinerId: UNDEFINE_ID
        };
        this.dictionaryType = dictionaryType;
        this.totalCountDown = totalCountDown;
        this.isRandomBonus = isRandomBonus;
        this.isLOG2990 = isLOG2990;
        this.creatorName = creatorPlayerName;
        this.joinerName = opponentName !== undefined ? opponentName : '';
    }
}

export interface GameInitInfo {
    players: Player[];
    totalCountDown: number;
    scrabbleBoard: Square[][];
    stock: ScrabbleLetter[];
    gameMode: GameType;
    isRandomBonus?: boolean; // to randomize bonus tile position when creating the board
}

export interface GameParameters {
    consecutivePassedTurns: number;
    isTurnPassed: boolean;
    players: Player[];
    totalCountDown: number;
    timerMs: number;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    isEndGame: boolean;
    gameMode: GameType;
    isLOG2990: boolean;
}

// TODO: method is a work in progress, to adapt as needed and see if the method works.
    // See where to move in client and see how synchronization with server will work
    // convertToVirtualPlayer(previousPlayerIndex: number, virtualPlayerName: string): VirtualPlayer | undefined {
    //     let newVirtualPlayer = undefined;
    //     const isValidIndex = previousPlayerIndex > -1 && previousPlayerIndex < this.players.length;
    //     if (isValidIndex) {
    //         const previousPlayer = this.players[previousPlayerIndex];
    //         newVirtualPlayer = new VirtualPlayer(virtualPlayerName, scrabbleLetterstoString(previousPlayer.letters), Difficulty.Easy);
    //         newVirtualPlayer.isActive = previousPlayer.isActive;
    //         newVirtualPlayer.score = previousPlayer.score;
    //         newVirtualPlayer.isWinner = previousPlayer.isWinner; // probably wouldn't need that line
    //         newVirtualPlayer.roomId = previousPlayer.roomId; // does a vp need a room id?
    //         this.players[previousPlayerIndex] = newVirtualPlayer;
    //         this.gameMode = GameType.Solo;
    //     }
    //     return newVirtualPlayer;
    // }
