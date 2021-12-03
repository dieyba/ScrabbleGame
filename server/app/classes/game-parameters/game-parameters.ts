import { DictionaryType } from '@app/classes/dictionary/dictionary';
import { LetterStock } from '@app/classes/letter-stock/letter-stock';
import { Player } from '@app/classes/player/player';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { Square, TOTAL_COLORS } from '@app/classes/square/square';

export const GAME_CAPACITY = 2;
const DEFAULT_LETTER_COUNT = 7;
const PUBLIC_GOALS_COUNT = 2;
const TOTAL_GOALS_COUNT = 8;

export enum GoalType {
    PlaceLetterWorthTenPts = 0, // Place a word containing a letter with a 10 pts value
    FormTwoLettersStarsOnly = 1, // Form 2 letter word, both letters are *
    FormWordWithLettersFromName = 2 /* Form a word containing at least 3 letters from the player's name
        (can be same letter, but different occurence)*/,
    FormAnExistingWord = 3, // Form a word already on the board
    FormThreeWords = 4, // Form three words at the same time
    PlaceLetterOnBoardCorner = 5, // Place a letter on one of the 4 boaard corners
    ActivateTwoBonuses = 6, // Active 2 bonuses at the same time / place a word with 2 letters on a colour square
    PlaceLetterOnColorSquare = 7, // Place letter x on a square of color y. x and y are randomly chosen at start of game
}

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
export interface WaitingAreaGameParameters {
    gameRoom: GameRoom;
    creatorName: string;
    joinerName: string;
    dictionaryType: DictionaryType;
    totalCountDown: number;
    isRandomBonus: boolean;
    isLog2990: boolean;
    gameMode: GameType;
}

export class GameInitInfo {
    gameRoomId: number; // needed on server to get a game from the game manager service
    players: Player[];
    totalCountDown: number;
    scrabbleBoard: Square[][];
    stockLetters: ScrabbleLetter[];
    isLog2990: boolean;
    gameMode: GameType;
    sharedGoals: GoalType[];
    randomLetterAndColor: ScrabbleLetter;

    constructor(clientParametersChosen: WaitingAreaGameParameters) {
        this.gameRoomId = clientParametersChosen.gameRoom.idGame;
        this.gameMode = clientParametersChosen.gameMode;
        this.isLog2990 = clientParametersChosen.isLog2990;
        this.totalCountDown = clientParametersChosen.totalCountDown;
        this.scrabbleBoard = new ScrabbleBoard(clientParametersChosen.isRandomBonus).squares;

        // Initializing the players and the stock
        const stock = new LetterStock();
        this.players = new Array<Player>();
        this.players.push(new Player(clientParametersChosen.creatorName, clientParametersChosen.gameRoom.creatorId, this.gameRoomId));
        this.players.push(new Player(clientParametersChosen.joinerName, clientParametersChosen.gameRoom.joinerId, this.gameRoomId));
        const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
        this.players[starterPlayerIndex].isActive = true;
        this.stockLetters = stock.letterStock; // stock with the two players' letters removed
        this.sharedGoals = [];
        // set the players' letters
        this.players.forEach((player) => {
            player.letters = stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        });
        // Set the private and public goals
        if (String(clientParametersChosen.isLog2990) === 'true') {
            const usedGoals: GoalType[] = [];
            this.pickSharedGoals(usedGoals);
            this.pickPrivateGoals(usedGoals);
        }
        // console.log('Shared goals:', this.sharedGoals);
        // this.players.forEach((player) => {
        //     console.log(player.name, ' goal:', player.goal);
        // });
    }

    // pick the 4 public random objectives/goals from the list
    pickSharedGoals(usedGoals: GoalType[]) {
        for (let i = 0; this.sharedGoals.length < PUBLIC_GOALS_COUNT; i++) {
            const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
            if (this.sharedGoals.indexOf(randomGoal) === -1) {
                this.sharedGoals.push(randomGoal);
                usedGoals.push(randomGoal);
                if (randomGoal === GoalType.PlaceLetterOnColorSquare) {
                    this.randomLetterAndColor = this.pickRandomLetterAndColor(this.stockLetters);
                }
            }
        }
    }

    // pick a private goal for each player
    pickPrivateGoals(usedGoals: GoalType[]) {
        this.players.forEach((player) => {
            do {
                const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
                if (usedGoals.indexOf(randomGoal) === -1) {
                    player.goal = randomGoal;
                    usedGoals.push(randomGoal);
                    if (randomGoal === GoalType.PlaceLetterOnColorSquare) {
                        this.randomLetterAndColor = this.pickRandomLetterAndColor(this.stockLetters);
                    }
                }
            } while (player.goal === undefined);
        });
    }

    pickRandomLetterAndColor(lettersLeftInStock: ScrabbleLetter[]) {
        let letterAndColor = new ScrabbleLetter('');
        // Set random letter and random color
        const randomLetterIndex = Math.floor(Math.random() * lettersLeftInStock.length);
        letterAndColor = lettersLeftInStock[randomLetterIndex];
        let randomColorIndex = 0;
        do {
            randomColorIndex = Math.floor(Math.random() * TOTAL_COLORS);
        } while (randomColorIndex === 0);
        letterAndColor.color = randomColorIndex;
        return letterAndColor;
    }

    getOtherPlayerInRoom(playerId: string): Player | undefined {
        if (this.players.length === GAME_CAPACITY) {
            return this.players[0].socketId === playerId ? this.players[1] : this.players[0];
        }
        return undefined;
    }

    getPlayerBySocketId(playerId: string): Player | undefined {
        let playerToFind;
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
            const removedPlayer = this.players.splice(indexPlayerToRemove, 1)[0];
            return removedPlayer;
        }
        return undefined;
    }
}
