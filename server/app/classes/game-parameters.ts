import { LetterStock } from '@app/classes/letter-stock';
import { Dictionary, DictionaryType } from './dictionary';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';

export const GAME_CAPACITY = 2;
const DEFAULT_LETTER_COUNT = 7;

export enum GameType {
    Solo = 0,
    MultiPlayer = 1,
}

export interface GameRoom {
    idGame: number;
    capacity: number;
    playersName: string[]; // used in clients' waiting area component
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
    isLOG2990: boolean;
    gameMode: GameType;

    addJoinerPlayer(joinerName: string, joinerSocketId: string): boolean {
        if (this.gameRoom.playersName.length < this.gameRoom.capacity) {
            this.joinerName = joinerName;
            this.gameRoom.joinerId = joinerSocketId;
            this.gameRoom.playersName = [this.creatorName, joinerName];
            return true;
        }
        return false;
    }
}

export class GameInitInfo {
    gameRoomId: number; // needed on server to get a game from the game manager service
    players: Player[];
    dictionary: Dictionary;
    totalCountDown: number;
    scrabbleBoard: ScrabbleBoard;
    stock: LetterStock;
    gameMode: GameType;

    constructor(clientParametersChosen: WaitingAreaGameParameters) {
        this.gameRoomId = clientParametersChosen.gameRoom.idGame;
        this.gameMode = clientParametersChosen.gameMode;
        this.dictionary = new Dictionary(clientParametersChosen.dictionaryType);
        this.totalCountDown = clientParametersChosen.totalCountDown;
        this.scrabbleBoard = new ScrabbleBoard(clientParametersChosen.isRandomBonus);
        this.stock = new LetterStock();

        // Initializing the players and their letters
        this.players = new Array<Player>();
        this.players.push(new Player(clientParametersChosen.creatorName, clientParametersChosen.gameRoom.creatorId, this.gameRoomId));
        this.players.push(new Player(clientParametersChosen.joinerName, clientParametersChosen.gameRoom.joinerId, this.gameRoomId));
        const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
        this.players[starterPlayerIndex].isActive = true;
        this.players.forEach(player => {
            player.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        });

        if (clientParametersChosen.isLOG2990) {
            // TODO: pick the 4 random objectives from the list
        }
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

    removePlayer(playerId: string): Player | undefined {
        const playerToRemove = this.getPlayerBySocketId(playerId);
        if (playerToRemove !== undefined) {
            const indexPlayerToRemove = this.players.indexOf(playerToRemove);
            this.players.splice(indexPlayerToRemove, 1);
        }
        return playerToRemove;
    }
}

