/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('SoloGameService', () => {
    let service: SoloGameService;
    let changeActivePlayerSpy: jasmine.Spy<any>;
    let secondsToMinutesSpy: jasmine.Spy<any>;
    let startCountdownSpy: jasmine.Spy<any>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let addRackLettersSpy: jasmine.Spy<any>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let ctxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawLetter', 'drawLetters'], { scrabbleBoard: new ScrabbleBoard(false) });
        rackServiceSpy = jasmine.createSpyObj('RackService', ['gridContext', 'drawLetter', 'removeLetter', 'addLetter', 'rackLetters'], {
            rackLetters: [] as ScrabbleLetter[],
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
            ],
        });
        service = TestBed.inject(SoloGameService);
        changeActivePlayerSpy = spyOn<any>(service, 'changeActivePlayer').and.callThrough();
        secondsToMinutesSpy = spyOn<any>(service, 'secondsToMinutes').and.callThrough();
        startCountdownSpy = spyOn<any>(service, 'startCountdown').and.callThrough();
        addRackLettersSpy = spyOn<any>(service, 'addRackLetters').and.callThrough();
        service.game = new GameParameters('Ariane', 60, false);
        const letter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        service.game.creatorPlayer = new LocalPlayer('Ariane');
        service.game.creatorPlayer.score = 73;
        service.game.creatorPlayer.letters = [letter];
        // addRackLetterSpy = spyOn<any>(service, 'addRackLetter').and.callThrough();
        // spyPlayer = new LocalPlayer('sara');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeGame should set variables to right value', () => {
        const level = new FormControl('easy', [Validators.required]);
        const name = new FormControl('Ariane', [Validators.required, Validators.pattern('[a-zA-Z]*')]);
        const timer = new FormControl('60', [Validators.required]);
        const bonus = new FormControl(false);
        const dictionaryForm = new FormControl('0', [Validators.required]);
        const opponent = new FormControl('Sara');
        const myForm = new FormGroup({ name, timer, bonus, dictionaryForm, level, opponent });
        service.initializeGame(myForm);
        expect(service.game.creatorPlayer.name).toEqual('Ariane');
        expect(service.game.creatorPlayer.letters.length).toEqual(7);
        expect(service.game.opponentPlayer.name).toEqual('Sara');
        expect(service.game.opponentPlayer.letters.length).toEqual(7);
        expect(service.game.totalCountDown).toEqual(60);
        expect(service.game.timerMs).toEqual(60);
        expect(service.game.dictionary.title).toEqual('Mon dictionnaire');
        expect(service.game.randomBonus).toEqual(false);
    });

    it('createNewGame should clear scrabble board and fill rack', () => {
        service.game.creatorPlayer = new LocalPlayer('Ariane');
        const firstLetter: ScrabbleLetter = new ScrabbleLetter('D', 1);
        const secondLetter: ScrabbleLetter = new ScrabbleLetter('e', 2);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('j', 3);
        service.game.creatorPlayer.letters = [firstLetter, secondLetter, thirdLetter];
        rackServiceSpy.gridContext = ctxStub;
        service.createNewGame();
        expect(addRackLettersSpy).toHaveBeenCalled();
        expect(startCountdownSpy).toHaveBeenCalled();
    });

    it('secondsToMinutes should convert ms to string format ss:msms', () => {
        service.game.timerMs = 150;
        service.secondsToMinutes();
        expect(service.timer).toEqual('2:30');
    });

    it('secondsToMinutes should convert ms to string format ss:0ms', () => {
        service.game.timerMs = 67;
        service.secondsToMinutes();
        expect(service.timer).toEqual('1:07');
    });

    it('when localPlayer is active, changeActivePlayer should set game.opponentPlayer to active', () => {
        service.game.localPlayer = new LocalPlayer('Ariane');
        service.game.opponentPlayer = new VirtualPlayer('Sara', Difficulty.Easy);
        service.game.localPlayer.letters = [new ScrabbleLetter('D', 1)];
        service.game.localPlayer.isActive = true;
        service.game.opponentPlayer.isActive = false;
        service.changeActivePlayer();
        expect(secondsToMinutesSpy).toHaveBeenCalled();
        expect(startCountdownSpy).toHaveBeenCalled();
        expect(service.game.localPlayer.isActive).toEqual(false);
        expect(service.game.opponentPlayer.isActive).toEqual(true);
    });

    it('when game.opponentPlayer is active, changeActivePlayer should set localPlayer to active', () => {
        service.game.localPlayer = new LocalPlayer('Ariane');
        service.game.opponentPlayer = new VirtualPlayer('Sara', Difficulty.Easy);
        service.game.opponentPlayer.letters = [new ScrabbleLetter('D', 1)];
        service.game.opponentPlayer.isActive = true;
        service.game.localPlayer.isActive = false;
        service.changeActivePlayer();
        expect(service.game.localPlayer.isActive).toEqual(true);
        expect(service.game.opponentPlayer.isActive).toEqual(false);
    });

    it('passTurn should make game.opponentPlayer active and clear interval', () => {
        service.game.localPlayer = new LocalPlayer('Ariane');
        service.game.opponentPlayer = new VirtualPlayer('Sara', Difficulty.Easy);
        service.game.localPlayer.letters = [new ScrabbleLetter('D', 1)];
        service.game.localPlayer.isActive = true;
        service.game.opponentPlayer.isActive = false;
        service.passTurn(service.game.localPlayer);
        expect(changeActivePlayerSpy).toHaveBeenCalled();
        expect(secondsToMinutesSpy).toHaveBeenCalled();
        expect(service.game.localPlayer.isActive).toEqual(false);
        expect(service.game.opponentPlayer.isActive).toEqual(true);
    });

    it('passTurn not possible when local player is not active', () => {
        service.game.creatorPlayer = new LocalPlayer('Ariane');
        service.game.creatorPlayer.isActive = false;
        const error = ErrorType.ImpossibleCommand;
        expect(service.passTurn(service.game.creatorPlayer)).toEqual(error);
    });

    // Test pour la fonction exchangeLetters
    it('exchangeLetter should call removeLetter of class Player if he is active and if there is at least 7 letters', () => {
        service.game.creatorPlayer.letters = [new ScrabbleLetter('a', 1)];
        service.game.opponentPlayer = new VirtualPlayer('Ariane', Difficulty.Easy);
        service.game.opponentPlayer.isActive = false;

        const spy = spyOn(service.game.creatorPlayer, 'removeLetter').and.callThrough();
        expect(spy).not.toHaveBeenCalled();

        service.game.creatorPlayer.isActive = true;
        service.exchangeLetters(service.game.creatorPlayer, 'a');

        expect(spy).toHaveBeenCalled();
    });

    it('exchangeLetter should call addLetter, removeLetter(rack service) and addLetter if the letters to exchange are removed with success', () => {
        service.game.creatorPlayer.letters = [new ScrabbleLetter('a', 1)];
        service.game.creatorPlayer.isActive = true;
        service.game.opponentPlayer = new VirtualPlayer('Ariane', Difficulty.Easy);
        service.game.opponentPlayer.isActive = false;

        const addRackLetterSpy = spyOn(service, 'addRackLetter').and.callThrough();
        const addLetterToPlayerSpy = spyOn(service, 'addLetterToPlayer').and.callThrough();
        service.exchangeLetters(service.game.creatorPlayer, 'b');
        expect(rackServiceSpy.removeLetter).not.toHaveBeenCalled();
        expect(addRackLetterSpy).not.toHaveBeenCalled();        
        expect(addLetterToPlayerSpy).not.toHaveBeenCalled();

        service.exchangeLetters(service.game.creatorPlayer, 'a');
        expect(rackServiceSpy.removeLetter).toHaveBeenCalled();
        expect(addRackLetterSpy).toHaveBeenCalled();     
        expect(addLetterToPlayerSpy).toHaveBeenCalled();
    });

    it('exchange not possible when local player dont have the letters or stock barely empty', () => {
        service.game.creatorPlayer.letters = [new ScrabbleLetter('o', 1)];
        service.game.creatorPlayer.isActive = true;
        const error = ErrorType.ImpossibleCommand;
        expect(service.exchangeLetters(service.game.creatorPlayer, 'a')).toEqual(error);
    });

    it('exchange not possible when local player not active', () => {
        service.game.creatorPlayer.isActive = false;
        const error = ErrorType.ImpossibleCommand;

        expect(service.exchangeLetters(service.game.creatorPlayer, 'a')).toEqual(error);
    });

    //     it('canPlaceWord should be false when word is outside of scrabble board', () => {
    //         service.game.creatorPlayer.isActive = true;
    //         const placeParams = { position: new Vec2(Column.Fifteen, 0), orientation: 'h', word: 'myWord' };

    //         expect(service.canPlaceWord(service.game.creatorPlayer, placeParams)).toEqual(false);
    //     });

    //     it("'canPlaceWord' should be false if first the word is not in the middle or touching another word", () => {
    //         service.game.creatorPlayer.isActive = true;
    //         const placeParams = { position: new Vec2(Column.Seven, Row.G), orientation: 'h', word: 'myWord' };
    //         expect(service.canPlaceWord(service.game.creatorPlayer, placeParams)).toEqual(false);
    //     });

    //     it("'canPlaceWord' should be true if first the word is in the middle", () => {
    //         service.game.creatorPlayer.isActive = true;
    //         const placeParams = { position: new Vec2(Column.Seven, Row.H), orientation: 'h', word: 'myWord' };

    //         expect(service.canPlaceWord(service.game.creatorPlayer, placeParams)).toEqual(true);
    //     });

    //         const coord = new Vec2(placeParams.position.x, placeParams.position.y);
    //         for (const letter of 'house') {
    //             // eslint-disable-next-line dot-notation
    //             const tempSquare = service['gridService'].scrabbleBoard.squares[coord.x][coord.y];
    //             tempSquare.letter = new ScrabbleLetter(letter, 1);
    //             tempSquare.occupied = true;
    //             tempSquare.letter.tile = tempSquare;
    //             coord.x++; // Because it's horizontal
    //         }

    //         service.game.creatorPlayer.isActive = true;
    //         const placeParams = { position: new Vec2(Column.Nine, Row.G), orientation: 'v', word: 'maison' };

    //         expect(service.canPlaceWord(service.game.creatorPlayer, placeParams)).toEqual(true);
    //     });

    //     it("'canPlaceWord' should be false if it's not the player's turn", () => {
    //         service.game.creatorPlayer.isActive = false;
    //         const placeParams = { position: new Vec2(Column.Seven, Row.H), orientation: 'h', word: 'myWord' };

    //         expect(service.canPlaceWord(service.game.creatorPlayer, placeParams)).toEqual(false);
    //     });

    //     it('"placeLetter" should remove letter from the rack and place it to the board', () => {
    //         const playerLetters: ScrabbleLetter[] = [];
    //         const letterA = new ScrabbleLetter('a', 1);
    //         const letterStar = new ScrabbleLetter('*', 0);
    //         playerLetters.push(letterA);
    //         playerLetters.push(letterStar);
    //         const letterToPlace = 'a';
    //         const coord = new Vec2(Column.Eight, Row.H);

    //         service.placeLetter(playerLetters, letterToPlace, coord);

    //         // Searching letter in playerLetter
    //         let playerLetter: ScrabbleLetter | undefined;
    //         for (const letter of playerLetters) {
    //             if (letter.character === letterToPlace) {
    //                 playerLetter = letter;
    //             }
    //         }
    //         expect(gridServiceSpy.drawLetter).toHaveBeenCalled();
    //         expect(rackServiceSpy.removeLetter).toHaveBeenCalled();
    //         expect(playerLetter).toEqual(undefined);
    //         // eslint-disable-next-line dot-notation
    //         expect(letterA.tile).toEqual(service['gridService'].scrabbleBoard.squares[coord.x][coord.y]);
    //     });

    //     it('"placeLetter" should remove letter from the rack and place it to the board', () => {
    //         const playerLetters: ScrabbleLetter[] = [];
    //         const letterA = new ScrabbleLetter('a', 1);
    //         const letterStar = new ScrabbleLetter('*', 0);
    //         playerLetters.push(letterA);
    //         playerLetters.push(letterStar);
    //         const letterToPlace = 'A';
    //         const coord = new Vec2(Column.Eight, Row.H);

    //         service.placeLetter(playerLetters, letterToPlace, coord);

    //         // Searching letter in playerLetter
    //         let playerLetter: ScrabbleLetter | undefined;
    //         for (const letter of playerLetters) {
    //             if (letter.character === letterToPlace) {
    //                 playerLetter = letter;
    //             }
    //         }
    //         expect(gridServiceSpy.drawLetter).toHaveBeenCalled();
    //         expect(rackServiceSpy.removeLetter).toHaveBeenCalled();
    //         expect(playerLetter).toEqual(undefined);
    //         // eslint-disable-next-line dot-notation
    //         expect(letterStar.tile).toEqual(service['gridService'].scrabbleBoard.squares[coord.x][coord.y]);
    //     });

    //     it('"placeLetter" should not place letter if the is already a letter', () => {
    //         const playerLetters: ScrabbleLetter[] = [];
    //         const letterA = new ScrabbleLetter('a', 1);
    //         const letterStar = new ScrabbleLetter('*', 0);
    //         playerLetters.push(letterA);
    //         playerLetters.push(letterStar);
    //         const letterToPlace = 'a';
    //         const coord = new Vec2(Column.Eight, Row.H);

    //         // eslint-disable-next-line dot-notation
    //         service['gridService'].scrabbleBoard.squares[coord.x][coord.y].occupied = true; // No need to place a real letter
    //         service.placeLetter(playerLetters, letterToPlace, coord);

    //         // Searching letter in playerLetter
    //         let playerLetter: ScrabbleLetter | undefined;
    //         for (const letter of playerLetters) {
    //             if (letter.character === letterToPlace) {
    //                 playerLetter = letter;
    //             }
    //         }
    //         expect(gridServiceSpy.drawLetter).not.toHaveBeenCalled();
    //         expect(rackServiceSpy.removeLetter).not.toHaveBeenCalled();
    //         expect(playerLetter).toEqual(letterA);
    //         // When coord are negative, it means that the letter is not placed
    //         expect(letterA.tile.position.x).toEqual(-1);
    //         expect(letterA.tile.position.y).toEqual(-1);
    //     });

    //     it('"place" should return a syntax error if it\'s not possible to place the word', () => {
    //         spyOn(service, 'canPlaceWord').and.returnValue(false);

    //         service.game.creatorPlayer.isActive = true;
    //         const placeParams = { position: new Vec2(Column.Seven, Row.H), orientation: 'h', word: 'myWord' };

    //         expect(service.place(service.game.creatorPlayer, placeParams)).toEqual(ErrorType.SyntaxError);
    //     });

    //     it('endGame should be called when changing players and rack + letterStock is empty (game.creatorPlayer)', () => {
    //         const endGameSpy = spyOn<any>(service, 'endGame').and.callThrough();
    //         service.game.creatorPlayer.letters = [new ScrabbleLetter('a', 1)];
    //         service.game.creatorPlayer.isActive = true;
    //         service.game.creatorPlayer.letters = [];
    //         service.game.stock.letterStock.length = 0;
    //         service.game.opponentPlayer = new VirtualPlayer('Ariane', Difficulty.Easy);
    //         service.game.opponentPlayer.isActive = false;
    //         service.changeActivePlayer();
    //         expect(endGameSpy).toHaveBeenCalled();
    //         expect(service.game.isEndGame).toEqual(true);
    //     });

    //     it('endGame should be called when changing players and rack + letterStock is empty (game.opponentPlayer)', () => {
    //         const endGameSpy = spyOn<any>(service, 'endGame').and.callThrough();
    //         service.game.creatorPlayer.letters = [new ScrabbleLetter('a', 1)];
    //         service.game.opponentPlayer = new VirtualPlayer('Ariane', Difficulty.Easy);
    //         service.game.opponentPlayer.isActive = true;
    //         service.game.opponentPlayer.letters = [];
    //         service.game.stock.letterStock.length = 0;
    //         service.game.creatorPlayer.isActive = false;
    //         service.changeActivePlayer();
    //         expect(endGameSpy).toHaveBeenCalled();
    //         expect(service.game.isEndGame).toEqual(true);
    //     });

    //     it('isTurnsPassedLimit should return true if turn has been passed 6 times', () => {
    //         service.game.hasTurnsBeenPassed = [false, true, true, true, true, true, true];
    //         service.game.turnPassed = true;
    //         expect(service.isTurnsPassedLimit()).toEqual(true);
    //     });

    //     it('when passTurn is called 6 times in a row, endGame should be called', () => {
    //         const endGameSpy = spyOn<any>(service, 'endGame').and.callThrough();
    //         service.game.creatorPlayer.letters = [new ScrabbleLetter('a', 1)];
    //         service.game.creatorPlayer.isActive = true;
    //         service.game.stock.letterStock.length = 0;
    //         service.game.opponentPlayer = new VirtualPlayer('Ariane', Difficulty.Easy);
    //         service.game.opponentPlayer.letters = [new ScrabbleLetter('a', 1)];
    //         service.game.opponentPlayer.isActive = false;
    //         service.game.hasTurnsBeenPassed = [false, true, true, true, true, true];
    //         service.game.turnPassed = true;
    //         service.passTurn(service.game.creatorPlayer);
    //         expect(endGameSpy).toHaveBeenCalled();
    //         expect(service.game.isEndGame).toEqual(true);
    //     });

    //     it('drawRack should call addRackLetter', () => {
    //         const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
    //         const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
    //         const letter3: ScrabbleLetter = new ScrabbleLetter('j', 4);
    //         const word1: ScrabbleWord = new ScrabbleWord();
    //         word1.content = [letter1, letter2, letter3];
    //         word1.orientation = Axis.H;
    //         const word2: ScrabbleWord = new ScrabbleWord();
    //         word2.orientation = Axis.V;
    //         word2.content = [letter1, letter2, letter3];
    //         const words: ScrabbleWord[] = [word1, word2];
    //         service.game.creatorPlayer = new LocalPlayer('Ariane');
    //         service.game.creatorPlayer.letters = [letter1];
    //         rackServiceSpy.rackLetters = [letter1];
    //         service.drawRack(words);
    //         expect(addRackLetterSpy).toHaveBeenCalled;
    //     });

    //     it('removeLetter should call rackService', () => {
    //         const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
    //         const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
    //         rackServiceSpy.rackLetters = [letter1, letter2];
    //         service.game.creatorPlayer = new LocalPlayer('Ariane');
    //         service.game.creatorPlayer.letters = [letter1, letter2];
    //         service.removeRackLetter(letter2);
    //         expect(rackServiceSpy.removeLetter).toHaveBeenCalled;
    //         expect(service.game.creatorPlayer.letters.length).toEqual(1);
    //     });
});
