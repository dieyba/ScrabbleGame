import { TestBed } from '@angular/core/testing';
import { ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { SquareColor } from '@app/classes/square/square';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { BonusService } from '@app/services/bonus.service';
import { GridService } from '@app/services/grid.service/grid.service';

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
        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
        gridServiceSpy.scrabbleBoard.generateBoard(false);
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
        word.orientation = Axis.H;
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
        word.orientation = Axis.V;
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
        word.startPosition = new Vec2(1, 1);
        word.orientation = Axis.H;
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
        word.orientation = Axis.V;
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
        word.orientation = Axis.H;
        word.content = [letter1, letter2, letter3];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.totalValue(word);
        expect(word.value).toEqual(3);
    });

    it('totalValue should be null when no word orientation has been set', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(5, 5);
        word.content = [letter1, letter2, letter3];
        service.totalValue(word);
        expect(word.value).toEqual(-1);
    });

    it('useBonus should handle horizontal and vertical words', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(5, 5);
        word.orientation = Axis.H;
        word.content = [letter1, letter2, letter3];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[5][5].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[6][5].isBonusUsed).toEqual(false);
        expect(gridServiceSpy.scrabbleBoard.squares[7][5].isBonusUsed).toEqual(false);
    });

    it('useVerticalWordBonus should set the square isBonusUsed to true (dark blue)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.DarkBlue;
        const letter2 = new ScrabbleLetter('b', 1);
        const letter3 = new ScrabbleLetter('c', 1);
        const letter4 = new ScrabbleLetter('d', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(5, 5);
        word.orientation = Axis.V;
        word.content = [letter1, letter2, letter3, letter4];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[5][5].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[5][6].isBonusUsed).toEqual(false);
        expect(gridServiceSpy.scrabbleBoard.squares[5][7].isBonusUsed).toEqual(false);
        expect(gridServiceSpy.scrabbleBoard.squares[5][8].isBonusUsed).toEqual(false);
    });

    it('useVerticalWordBonus should set the square isBonusUsed to true (teal)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Teal;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(6, 6);
        word.orientation = Axis.V;
        word.content = [letter1, letter2];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[6][6].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[6][7].isBonusUsed).toEqual(false);
    });

    it('useVerticalWordBonus should set the square isBonusUsed to true (pink)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(1, 1);
        word.orientation = Axis.V;
        word.content = [letter1, letter2];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[1][1].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[1][2].isBonusUsed).toEqual(false);
    });

    it('useVerticalWordBonus should set the square isBonusUsed to true (red)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Red;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(0, 0);
        word.orientation = Axis.V;
        word.content = [letter1, letter2];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[0][0].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[0][1].isBonusUsed).toEqual(false);
    });

    it('useHorizontalWordBonus should set the square isBonusUsed to true (teal)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Teal;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(6, 6);
        word.orientation = Axis.H;
        word.content = [letter1, letter2];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[6][6].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[7][6].isBonusUsed).toEqual(false);
    });

    it('useHorizontalWordBonus should set the square isBonusUsed to true (pink)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(1, 1);
        word.orientation = Axis.H;
        word.content = [letter1, letter2];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[1][1].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[2][1].isBonusUsed).toEqual(false);
    });

    it('useHorizontalWordBonus should set the square isBonusUsed to true (red)', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Red;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(0, 0);
        word.orientation = Axis.H;
        word.content = [letter1, letter2];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[0][0].isBonusUsed).toEqual(true);
        // No color, no bonus to use
        expect(gridServiceSpy.scrabbleBoard.squares[1][0].isBonusUsed).toEqual(false);
    });

    it('useVerticalWordBonus should keep the square isBonusUsed to true when already true', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Pink;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(2, 2);
        word.orientation = Axis.V;
        word.content = [letter1, letter2];
        gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed = true;
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[2][2].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[2][3].isBonusUsed).toEqual(false);
    });

    it('useHorizontalBonus should keep the square isBonusUsed to true when is already true', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Teal;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(6, 6);
        word.orientation = Axis.H;
        word.content = [letter1, letter2];
        gridServiceSpy.scrabbleBoard.squares[6][6].isBonusUsed = true;
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[6][6].isBonusUsed).toEqual(true);
        expect(gridServiceSpy.scrabbleBoard.squares[7][6].isBonusUsed).toEqual(false);
    });

    it('useBonus should not set the square isBonusUsed to true when no orientation is set', () => {
        const letter1 = new ScrabbleLetter('a', 1);
        letter1.color = SquareColor.Teal;
        const letter2 = new ScrabbleLetter('b', 1);
        const word = new ScrabbleWord();
        word.startPosition = new Vec2(6, 6);
        word.content = [letter1, letter2];
        service.useBonus(word);
        expect(gridServiceSpy.scrabbleBoard.squares[6][6].isBonusUsed).toEqual(false);
        expect(gridServiceSpy.scrabbleBoard.squares[7][6].isBonusUsed).toEqual(false);
    });
});
