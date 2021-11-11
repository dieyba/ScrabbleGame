import { LetterStock } from '@app/classes/letter-stock';
import { Dictionary, DictionaryType } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { Square } from './square';
import { scrabbleLetterstoString } from './utilities';
import { Difficulty, VirtualPlayer } from './virtual-player';

export const GAME_CAPACITY = 2;

export enum GameType {
    Solo = 0,
    MultiPlayer = 1,
    MultiPlayerLog = 2,
}

// we dont even need game room tbh
export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[]; // used in client waiting area component only
    creatorId: string;
    joinerId: string;
}
export interface WaitingAreaGameParameters {
    gameRoom: GameRoom;
    creatorName: string;
    joinerName: string;
    dictionaryType: DictionaryType;
    totalCountDown: number;
    isRandomBonus: boolean;
    gameMode: GameType;
}

// Game parameters to be sent to client after initializing a game on the server
export interface ClientGameInitParameters {
    players: Player[];
    totalCountDown: number;
    scrabbleBoard: Square[][]; // squares[][] can be sent?
    stock: ScrabbleLetter[]; // stock is scrabbleLetters[] or string?
    gameMode: GameType;
}

export class GameParameters {
    gameRoomId: number;
    players: Player[];
    // activePlayerIndex: number; see if needed for server game service, probably?
    dictionary: Dictionary;
    totalCountDown: number;
    randomBonus: boolean;
    timerMs: number;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    isTurnPassed: boolean;
    isEndGame: boolean;
    consecutivePassedTurns: number;
    gameMode: GameType;

    constructor(clientParametersChosen: WaitingAreaGameParameters) {
        this.gameMode = clientParametersChosen.gameMode;
        this.players = new Array<Player>();
        this.dictionary = new Dictionary(clientParametersChosen.dictionaryType);
        this.players.push(new Player(clientParametersChosen.creatorName, ''));
        if (clientParametersChosen.gameMode === GameType.Solo) {
            // TODO: add how to set up vp difficulty
            this.players.push(new VirtualPlayer(clientParametersChosen.joinerName, '', Difficulty.Easy));
        }
        this.totalCountDown = clientParametersChosen.totalCountDown;
        this.timerMs = +this.totalCountDown;
        this.stock = new LetterStock();
        this.scrabbleBoard = new ScrabbleBoard(clientParametersChosen.isRandomBonus);
        this.consecutivePassedTurns = 0;
    }

    getOtherPlayerInRoom(playerId: string): Player | undefined {
        if (this.players.length === GAME_CAPACITY) {
            return this.players[0].socketId === playerId ? this.players[1] : this.players[0];
        }
        return undefined;
    }

    getPlayerBySocketId(playerId: string): Player | undefined {
        let playerToFind = undefined;
        this.players.forEach((player) => {
            if (player.socketId === playerId) {
                playerToFind = player;
            }
        });
        return playerToFind;
    }

    // to add the joiner player if it's a multiplayer game
    addPlayer(joinerName: string, joinerSocketId: string) {
        if (this.players.length < GAME_CAPACITY) {
            this.players.push(new Player(joinerName, ''));
            this.players[GAME_CAPACITY].socketId = joinerSocketId;
        }
    }

    // removes a player from the game parameters players[] and returns it
    removePlayer(playerId: string): Player | undefined {
        const playerToRemove = this.getPlayerBySocketId(playerId);
        if (playerToRemove !== undefined) {
            const indexPlayerToRemove = this.players.indexOf(playerToRemove);
            this.players.splice(indexPlayerToRemove, 1);
        }
        return playerToRemove;
    }

    // TODO: method is a work in progress, to adapt as needed and see if the method works.
    // see if we want to leave method here or elsewhere
    convertToVirtualPlayer(previousPlayerIndex: number, virtualPlayerName: string): VirtualPlayer | undefined {
        let newVirtualPlayer = undefined;
        const isValidIndex = previousPlayerIndex > -1 && previousPlayerIndex < this.players.length;
        if (isValidIndex) {
            const previousPlayer = this.players[previousPlayerIndex];
            newVirtualPlayer = new VirtualPlayer(virtualPlayerName, scrabbleLetterstoString(previousPlayer.letters), Difficulty.Easy);
            newVirtualPlayer.isActive = previousPlayer.isActive;
            newVirtualPlayer.score = previousPlayer.score;
            newVirtualPlayer.isWinner = previousPlayer.isWinner; // probably wouldn't need that line
            newVirtualPlayer.roomId = previousPlayer.roomId; // does a vp need a room id?
            this.players[previousPlayerIndex] = newVirtualPlayer;
            this.gameMode = GameType.Solo;
        }
        return newVirtualPlayer;
    }
}

