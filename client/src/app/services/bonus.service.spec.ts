import { TestBed } from '@angular/core/testing';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { BonusService } from './bonus.service';
import { GridService } from './grid.service';

describe('BonusService', () => {
    let service: BonusService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['scrabbleBoard']);
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        });
        service = TestBed.inject(BonusService);
        gridServiceSpy.scrabbleBoard = new ScrabbleBoard();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('totalValue should apply the right bonuses (red + teal)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Teal;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const letter4 = new ScrabbleLetter('d', 1);
        letter4.color = SquareColor.Red;
        const word = new ScrabbleWord();
        word.startPosition = { x: 11, y: 0 };
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2, letter3, letter4];
        service.totalValue(word);
        expect(word.value).toEqual(15);
    });

    it('totalValue should apply the right bonuses (red + teal)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Red;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const letter4 = new ScrabbleLetter('d', 1);
        letter4.color = SquareColor.Teal;
        const word = new ScrabbleWord();
        word.startPosition = { x: 0, y: 0 };
        word.orientation = WordOrientation.Vertical;
        word.content = [letter1, letter2, letter3, letter4];
        service.totalValue(word);
        expect(word.value).toEqual(15);
    });

    it('totalValue should apply the right bonuses (darkblue)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = { x: 5, y: 5 };
        word.orientation = WordOrientation.Vertical;
        word.content = [letter1, letter2, letter3];
        service.totalValue(word);
        expect(word.value).toEqual(5);
    });

    it('totalValue should apply the right bonuses (darkblue)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = { x: 5, y: 5 };
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2, letter3];
        service.totalValue(word);
        expect(word.value).toEqual(5);
    });

    it('totalValue should apply the right bonuses (pink)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = { x: 2, y: 2 };
        word.orientation = WordOrientation.Vertical;
        word.content = [letter1, letter2, letter3];
        service.totalValue(word);
        expect(word.value).toEqual(6);
    });

    it('totalValue should apply the right bonuses (pink)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = { x: 2, y: 2 };
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2, letter3];
        service.totalValue(word);
        expect(word.value).toEqual(6);
    });

    it('totalValue should apply the right bonuses when bonus is already taken (pink)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = { x: 2, y: 2 };
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2, letter3];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.totalValue(word);
        expect(word.value).toEqual(3);
    });

    it('totalValue should apply the right bonuses when bonus is already taken (pink)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = { x: 2, y: 2 };
        word.orientation = WordOrientation.Vertical;
        word.content = [letter1, letter2, letter3];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.totalValue(word);
        expect(word.value).toEqual(3);
    });
});
