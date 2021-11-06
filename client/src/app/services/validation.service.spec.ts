import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { ValidationService, WAIT_TIME } from '@app/services/validation.service';
import * as io from 'socket.io-client';
import { GridService } from './grid.service';
class SocketMock {
    id: string = 'Socket mock';
    events: Map<string, CallableFunction> = new Map();
    on(eventName: string, cb: CallableFunction) {
        this.events.set(eventName, cb);
    }

    triggerEvent(eventName: string, ...args: any[]) {
        const arrowFunction = this.events.get(eventName) as CallableFunction;
        arrowFunction(...args);
    }

    join(...args: any[]) {
        return;
    }
    emit(...args: any[]) {
        return;
    }

    disconnect() {
        return;
    }
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('ValidationService', () => {
    let service: ValidationService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let socketMock: SocketMock;
    let socketOnMockSpy: jasmine.SpyObj<any>;
    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', { scrabbleBoard: new ScrabbleBoard(false), removeSquare() {} });
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        });
        service = TestBed.inject(ValidationService);
        socketMock = new SocketMock();
        service['socket'] = socketMock as unknown as io.Socket;
        socketOnMockSpy = spyOn(socketMock, 'on').and.callThrough();
        service.dictionary = new Dictionary(DictionaryType.Default);
        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('socketOnConnect should handle socket.on event update board', () => {
        service.wordsValid();
        // let board = new ScrabbleBoard(false);
        // board.word
        socketMock.triggerEvent('areWordsValid', true);
        expect(socketOnMockSpy).toHaveBeenCalled();
    });

    it('if one word is not valid, areWordsValid should be false', () => {
        const firstLetter: ScrabbleLetter = new ScrabbleLetter('J', 1);
        const secondLetter: ScrabbleLetter = new ScrabbleLetter("'", 1);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter('i', 1);
        const word1: ScrabbleWord = new ScrabbleWord();
        const word2: ScrabbleWord = new ScrabbleWord();
        word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter]; // J'ai - non valide word.startPosition= {x:0, y:0};
        word1.orientation = Axis.V;
        word1.startPosition = new Vec2(0, 0);
        word2.content = [thirdLetter, fourthLetter]; // ai - valide word.startPosition= {x:0, y:0};
        word2.orientation = Axis.H;
        word2.startPosition = new Vec2(0, 0);
        const words: ScrabbleWord[] = [word1, word2];
        service.validateWords(words)
        expect(service.areWordsValid).toEqual(false);
    });
    // TODO : Not working
    it('if letters added total is 8, calculateScore should return 0', () => {
        const letter1: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const letter2: ScrabbleLetter = new ScrabbleLetter('p', 1);
        const letter3: ScrabbleLetter = new ScrabbleLetter('e', 1);
        const letter4: ScrabbleLetter = new ScrabbleLetter('l', 1);
        const letter5: ScrabbleLetter = new ScrabbleLetter('s', 1);
        gridServiceSpy.scrabbleBoard.squares[0][0].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][0].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][1].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][1].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][2].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][2].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][3].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][3].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][4].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][4].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][5].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][5].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][6].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][6].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][7].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][7].isValidated = false;
        const word: ScrabbleWord = new ScrabbleWord();
        word.content = [letter1, letter2, letter2, letter3, letter4, letter4, letter3, letter5];
        word.orientation = Axis.V;
        word.startPosition = new Vec2(0, 0);
        const words: ScrabbleWord[] = [word];
        expect(service.newLettersCount()).toEqual(8);
        expect(service.calculateScore(words)).toEqual(-1);
    });

    it('if letters added total is 7, validateWordsAndCalculateScore should add 50 pts bonus', () => {
        const letter1: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const letter2: ScrabbleLetter = new ScrabbleLetter('p', 1);
        const letter3: ScrabbleLetter = new ScrabbleLetter('e', 1);
        const letter4: ScrabbleLetter = new ScrabbleLetter('l', 1);
        gridServiceSpy.scrabbleBoard.squares[0][0].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][0].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][1].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][1].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][2].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][2].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][3].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][3].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][4].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][4].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][5].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][5].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][6].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][6].isValidated = false;
        const word: ScrabbleWord = new ScrabbleWord();
        word.content = [letter1, letter2, letter2, letter3, letter4, letter4, letter3];
        word.orientation = Axis.V;
        word.startPosition = new Vec2(0, 0);
        const words: ScrabbleWord[] = [word];
        expect(service.newLettersCount()).toEqual(7);
        expect(service.calculateScore(words)).toEqual(74); // 24 + 50
    });

    it('updatePlayerScore should use bonus when word is valid', fakeAsync(() => {
        const player = new LocalPlayer('Ariane');
        const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
        const letter2: ScrabbleLetter = new ScrabbleLetter('é', 1);
        const letter3: ScrabbleLetter = new ScrabbleLetter('j', 1);
        const letter4: ScrabbleLetter = new ScrabbleLetter('à', 1);
        gridServiceSpy.scrabbleBoard.squares[0][0].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][0].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][1].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][1].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][2].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][2].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][3].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][3].isValidated = false;
        const word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [letter1, letter2, letter3, letter4];
        word1.orientation = Axis.H;
        word1.startPosition = new Vec2(0, 0);
        const words: ScrabbleWord[] = [word1];
        service.areWordsValid = true;
        expect(service.calculateScore(words)).toEqual(15); // red bonus x 5 points (1+1+1+2(blue bonus))
        service.updatePlayerScore(words, player);
        tick(WAIT_TIME);
        expect(player.score).toEqual(15);
        expect(word1.content[0].tile.isValidated).toEqual(true);
        expect(word1.content[1].tile.isValidated).toEqual(true);
        expect(word1.content[2].tile.isValidated).toEqual(true);
        expect(word1.content[3].tile.isValidated).toEqual(true);
        expect(service.isTimerElapsed).toEqual(true);
    }));

    it('updatePlayerScore should not use bonus when word is not valid', fakeAsync(() => {
        const player = new LocalPlayer('Ariane');
        const letter1: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const letter2: ScrabbleLetter = new ScrabbleLetter('p', 1);
        const letter3: ScrabbleLetter = new ScrabbleLetter('e', 1);
        const letter4: ScrabbleLetter = new ScrabbleLetter('l', 1);
        const letter5: ScrabbleLetter = new ScrabbleLetter('s', 1);
        gridServiceSpy.scrabbleBoard.squares[0][0].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][0].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][1].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][1].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][2].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][2].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][3].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][3].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][4].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][4].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][5].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][5].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][6].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][6].isValidated = false;
        gridServiceSpy.scrabbleBoard.squares[0][7].occupied = true;
        gridServiceSpy.scrabbleBoard.squares[0][7].isValidated = false;
        const word: ScrabbleWord = new ScrabbleWord();
        word.content = [letter1, letter2, letter2, letter3, letter4, letter4, letter3, letter5];
        word.orientation = Axis.V;
        word.startPosition = new Vec2(0, 0);
        const words: ScrabbleWord[] = [word];
        service.areWordsValid = true;
        expect(service.calculateScore(words)).toEqual(-1); // 3 pts x red bonus
        service.updatePlayerScore(words, player);
        tick(WAIT_TIME);
        expect(player.score).toEqual(0);
        expect(gridServiceSpy.removeSquare).toHaveBeenCalled();
        expect(service.isTimerElapsed).toEqual(true);
    }));

});
