import { DictionaryType } from './dictionary';
import { LetterStock } from './letter-stock';
import { Player } from './player';
import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { Square, SquareColor, TOTAL_COLORS } from './square';

export const GAME_CAPACITY = 2;
const DEFAULT_LETTER_COUNT = 7;
const PUBLIC_GOALS_COUNT = 2;
const TOTAL_GOALS_COUNT = 8;

export enum Goals {
    PlaceLetterWorthTenPts = 0, // Place a word containing a letter with a 10 pts value
    FormTwoLettersStarsOnly = 1, // Form 2 letter word, both letters are *
    FormWordWithLettersFromName = 2, /* Form a word containing at least 3 letters from the player's name
        (can be same letter, but different occurence)*/
    FormAnExistingWord = 3, // Form a word already on the board
    FormThreeWords = 4, // Form three words at the same time 
    PlaceLetterOnBoardCorner = 5, // Place a letter on one of the 4 boaard corners
    ActivateTwoBonuses = 6, // Active 2 bonuses at the same time / place a word with 2 letters on a colour square
    PlaceLetterOnColorSquare = 7, // Place letter x on a square of color y. x and y are randomly chosen at start of game
}

export enum GoalPoints {
    PlaceLetterWorthTenPts = 20,
    FormTwoLettersStarsOnly = 20,
    FormWordWithLettersFromName = 30,
    FormAnExistingWord = 20,
    FormThreeWords = 50,
    PlaceLetterOnBoardCorner = 30,
    ActivateTwoBonuses = 30,
    PlaceLetterOnColorSquare = 50,
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
    sharedGoals: Goals[];
}

export class GameInitInfo {
    gameRoomId: number; // needed on server to get a game from the game manager service
    players: Player[];
    totalCountDown: number;
    scrabbleBoard: Square[][];
    stockLetters: ScrabbleLetter[];
    isLog2990: boolean;
    gameMode: GameType;
    sharedGoals: Goals[];
    randomLetterAndColor: RandomLetterAndColor;

    constructor(clientParametersChosen: WaitingAreaGameParameters) {
        this.gameRoomId = clientParametersChosen.gameRoom.idGame;
        this.gameMode = clientParametersChosen.gameMode;
        this.isLog2990 = clientParametersChosen.isLog2990;
        this.totalCountDown = clientParametersChosen.totalCountDown;
        this.scrabbleBoard = new ScrabbleBoard(clientParametersChosen.isRandomBonus).squares;

        // Initializing the players and their letters and the stock
        const stock = new LetterStock();
        this.players = new Array<Player>();
        this.players.push(new Player(clientParametersChosen.creatorName, clientParametersChosen.gameRoom.creatorId, this.gameRoomId));
        this.players.push(new Player(clientParametersChosen.joinerName, clientParametersChosen.gameRoom.joinerId, this.gameRoomId));
        const starterPlayerIndex = Math.round(Math.random()); // index 0 or 1, initialize randomly which of the two player will start
        this.players[starterPlayerIndex].isActive = true;
        this.stockLetters = stock.letterStock; // stock with the two players' letters removed
        this.sharedGoals = [];
        var usedGoals: Goals[] = [];
        // TODO: pick the 4 public random objectives/goals from the list
        if (String(clientParametersChosen.isLog2990) === 'true') {
            for (let i = 0; this.sharedGoals.length < PUBLIC_GOALS_COUNT; i++) {
                const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
                if (!this.sharedGoals.includes(randomGoal)) {
                    this.sharedGoals.push(randomGoal);
                    usedGoals.push(randomGoal);
                    if (randomGoal === Goals.PlaceLetterOnColorSquare) {
                        this.randomLetterAndColor = new RandomLetterAndColor(this.stockLetters);
                    }
                }
            }
            console.log(this.sharedGoals);
            this.players.forEach((player) => {
                player.letters = stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
                do {
                    const randomGoal = Math.floor(Math.random() * TOTAL_GOALS_COUNT);
                    if (!usedGoals.includes(randomGoal)) {
                        player.goal = randomGoal;
                        usedGoals.push(randomGoal)
                        if (randomGoal === Goals.PlaceLetterOnColorSquare) {
                            this.randomLetterAndColor = new RandomLetterAndColor(this.stockLetters);
                        }
                    }
                } while(player.goal === undefined);
            });
        }
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

export class RandomLetterAndColor {
    letter: ScrabbleLetter;
    color: SquareColor;

    constructor(lettersLeft: ScrabbleLetter[]) {
        // Set random letter and random color
        const randomLetterIndex = Math.floor(Math.random() * lettersLeft.length);
        this.letter = lettersLeft[randomLetterIndex];
        let randomColorIndex = 0;
        do {
            randomColorIndex = Math.floor(Math.random() * TOTAL_COLORS);
        } while (randomColorIndex === 0);
        this.color = randomColorIndex;
    }
}
