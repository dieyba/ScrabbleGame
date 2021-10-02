import { TestBed } from '@angular/core/testing';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';
import { Vec2 } from '@app/classes/vec2';
import { BonusService } from '@app/services/bonus.service';
import { GridService } from '@app/services/grid.service';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
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
        gridServiceSpy.scrabbleBoard.generateBoard();
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
        word.orientation = WordOrientation.Horizontal;
        word.startPosition = new Vec2(11, 0);
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
        word.startPosition = new Vec2(5, 5);
        word.orientation = WordOrientation.Vertical;
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
        word.startPosition = new Vec2(5, 5);
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2, letter3];
        service.totalValue(word);
        expect(word.value).toEqual(6);
    });

    it('totalValue should apply the right bonuses when bonus is already taken (pink/vertical)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(2, 2);
        word.orientation = WordOrientation.Vertical;
        word.content = [letter1, letter2, letter3];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.totalValue(word);
        expect(word.value).toEqual(3);
    });

    it('totalValue should apply the right bonuses when bonus is already taken (pink/horizontal)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(2, 2);
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2, letter3];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.totalValue(word);
        expect(word.value).toEqual(3);
    });

    it('useBonus should handle horizontal and vertical words', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(2, 2);
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2, letter3];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[3][2].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[4][2].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[5][2].isBonusUsed).toEqual(true);
    });

    it('useVerticalWordBonus should set the square isBonusUsed to true', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        letter2.color = SquareColor.Pink;
        const letter3 = new ScrabbleLetter('c', 1);
        letter3.color = SquareColor.Red;
        const letter4 = new ScrabbleLetter('d', 1);
        letter4.color = SquareColor.Teal;
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(2, 2);
        word.orientation = WordOrientation.Vertical;
        word.content = [letter1, letter2, letter3, letter4];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[2][3].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[2][4].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[2][5].isBonusUsed).toEqual(true);
    });

    it('useVerticalWordBonus should keep the square isBonusUsed to true when already true', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        letter2.color = SquareColor.Pink;
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(2, 2);
        word.orientation = WordOrientation.Vertical;
        word.content = [letter1, letter2];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[2][3].isBonusUsed).toEqual(true);
    });

    it('useHorizontalBonus should keep the square isBonusUsed to true when is already true', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        letter2.color = SquareColor.Pink;
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(2, 2);
        word.orientation = WordOrientation.Horizontal;
        word.content = [letter1, letter2];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[3][2].isBonusUsed).toEqual(true);
    });
});
