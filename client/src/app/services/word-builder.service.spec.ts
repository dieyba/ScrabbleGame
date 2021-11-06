import { TestBed } from '@angular/core/testing';
import { BOARD_SIZE, Column, Row, ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { Square } from '@app/classes/square';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';
import { WordBuilderService } from './word-builder.service';

const TOWARD_START = true;

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('WordBuilderService', () => {
    let service: WordBuilderService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', { scrabbleBoard: ScrabbleBoard });
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        });
        service = TestBed.inject(WordBuilderService);
        gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // findWordEdge
    it('should return initial coordinates passed in', () => {
        const centerCoord = new Vec2(Column.Eight, Row.H);
        const emptySquareCoord = new Vec2(Column.One, Row.A);
        const outsideBoardCoord = new Vec2(-BOARD_SIZE, BOARD_SIZE + 1);

        // only putting one letter in the center
        gridServiceSpy.scrabbleBoard.squares[centerCoord.x][centerCoord.y].letter = new ScrabbleLetter('a', 1);
        gridServiceSpy.scrabbleBoard.squares[centerCoord.x][centerCoord.y].occupied = true;

        expect(service.findWordEdge(centerCoord, Axis.H, TOWARD_START)).toEqual(centerCoord);
        expect(service.findWordEdge(centerCoord, Axis.H, !TOWARD_START)).toEqual(centerCoord);
        expect(service.findWordEdge(centerCoord, Axis.V, TOWARD_START)).toEqual(centerCoord);
        expect(service.findWordEdge(centerCoord, Axis.V, !TOWARD_START)).toEqual(centerCoord);
        expect(service.findWordEdge(emptySquareCoord, Axis.H, TOWARD_START)).toEqual(emptySquareCoord);
        expect(service.findWordEdge(outsideBoardCoord, Axis.V, !TOWARD_START)).toEqual(outsideBoardCoord);
    });

    it('should find coordinates of first and last horizontal letter', () => {
        const initialCoord = new Vec2(Column.Seven, Row.B);
        const startCoord = new Vec2(Column.Five, Row.B);
        const endCoordHorizontal = new Vec2(Column.Nine, Row.B);
        const lenght = endCoordHorizontal.x - startCoord.x;

        for (let i = 0; i <= lenght; i++) {
            gridServiceSpy.scrabbleBoard.squares[startCoord.x + i][startCoord.y].letter = new ScrabbleLetter('a', 1);
            gridServiceSpy.scrabbleBoard.squares[startCoord.x + i][startCoord.y].occupied = true;
        }
        expect(service.findWordEdge(initialCoord, Axis.H, TOWARD_START)).toEqual(startCoord);
        expect(service.findWordEdge(initialCoord, Axis.H, !TOWARD_START)).toEqual(endCoordHorizontal);
    });

    it('should find coordinates of first and last vertical letter', () => {
        const initialCoord = new Vec2(Column.Seven, Row.D);
        const startCoord = new Vec2(Column.Seven, Row.A);
        const endCoordHorizontal = new Vec2(Column.Seven, Row.F);
        const lenght = endCoordHorizontal.y - startCoord.y;
        for (let i = 0; i <= lenght; i++) {
            gridServiceSpy.scrabbleBoard.squares[startCoord.x][startCoord.y + i].letter = new ScrabbleLetter('b', 1);
            gridServiceSpy.scrabbleBoard.squares[startCoord.x][startCoord.y + i].occupied = true;
        }
        expect(service.findWordEdge(initialCoord, Axis.V, TOWARD_START)).toEqual(startCoord);
        expect(service.findWordEdge(initialCoord, Axis.V, !TOWARD_START)).toEqual(endCoordHorizontal);
    });

    it('should stop looking for the edge coordinates at the boards border', () => {
        const topCenter = new Vec2(Column.Eight, Row.A);
        const topLeft = new Vec2(Column.One, Row.A);
        const topRight = new Vec2(Column.Fifteen, Row.A);
        for (let i = 0; i <= Column.Fifteen; i++) {
            gridServiceSpy.scrabbleBoard.squares[i][0].letter = new ScrabbleLetter('a', 1);
            gridServiceSpy.scrabbleBoard.squares[i][0].occupied = true;
        }
        expect(service.findWordEdge(topCenter, Axis.H, TOWARD_START)).toEqual(topLeft);
        expect(service.findWordEdge(topCenter, Axis.H, !TOWARD_START)).toEqual(topRight);
    });

    it('should return horizontal scrabble word', () => {
        const startCoord = new Vec2(Column.Seven, Row.C);
        const midCoord = new Vec2(Column.Nine, Row.C);
        const endCoord = new Vec2(Column.Ten, Row.C);

        const letters: ScrabbleLetter[] = [
            new ScrabbleLetter('w', 0),
            new ScrabbleLetter('o', 0),
            new ScrabbleLetter('r', 0),
            new ScrabbleLetter('d', 0),
        ];

        for (let i = 0; i < letters.length; i++) {
            gridServiceSpy.scrabbleBoard.squares[startCoord.x + i][Row.C].letter = letters[i];
            gridServiceSpy.scrabbleBoard.squares[startCoord.x + i][Row.C].occupied = true;
            gridServiceSpy.scrabbleBoard.squares[startCoord.x + i][Row.C].letter.tile = new Square(startCoord.x + i, Row.C);
            gridServiceSpy.scrabbleBoard.squares[startCoord.x + i][Row.C].letter.tile.occupied = true;
        }
        expect(service.buildScrabbleWord(startCoord, Axis.H).content).toEqual(letters);
        expect(service.buildScrabbleWord(endCoord, Axis.H).content).toEqual(letters);
        expect(service.buildScrabbleWord(midCoord, Axis.H).content).toEqual(letters);
        expect(service.buildScrabbleWord(midCoord, Axis.V).stringify()).toEqual('r');
    });

    it('should return empty scrabble word', () => {
        const emptyCoord = new Vec2(Column.Seven, Row.C);
        const singleLetterCoord = new Vec2(Column.Eight, Row.C);
        const outOfBoundCoord = new Vec2(Column.One - 1, Row.O + 1);

        gridServiceSpy.scrabbleBoard.squares[singleLetterCoord.x][singleLetterCoord.y].letter = new ScrabbleLetter('z', 10);
        expect(service.buildScrabbleWord(emptyCoord, Axis.V).content).toEqual([]);
        expect(service.buildScrabbleWord(singleLetterCoord, Axis.V).content).toEqual([]);
        expect(service.buildScrabbleWord(singleLetterCoord, Axis.H).content).toEqual([]);
        expect(service.buildScrabbleWord(outOfBoundCoord, Axis.H).content).toEqual([]);
    });

    it('should not build from coordinates out of range', () => {
        const outOfBoundCoord = new Vec2(Column.Seven, Row.C);
        expect(service.buildWordsOnBoard('somerandomword', outOfBoundCoord, Axis.H)).toEqual([]);
    });

    it('should only build the new words formed by the new letters placed', () => {
        const startCoord = new Vec2(1, 1);
        // letters on the board, all the 'a' were newly placed, the others have already been validated
        const letters = [
            [
                new ScrabbleLetter('e', 0),
                new ScrabbleLetter('l', 0),
                new ScrabbleLetter('e', 0),
                new ScrabbleLetter('v', 0),
                new ScrabbleLetter('e', 0),
            ],
            [
                new ScrabbleLetter('t', 0),
                new ScrabbleLetter('a', 0),
                new ScrabbleLetter('a', 0),
                new ScrabbleLetter('a', 0),
                new ScrabbleLetter('t', 0),
            ],
            [
                new ScrabbleLetter('e', 0),
                new ScrabbleLetter('l', 0),
                new ScrabbleLetter('e', 0),
                new ScrabbleLetter('v', 0),
                new ScrabbleLetter('e', 0),
            ],
        ];
        // words that should be created
        const taaat = new ScrabbleWord();
        const lal = new ScrabbleWord();
        const eae = new ScrabbleWord();
        const vav = new ScrabbleWord();
        taaat.content = letters[1];
        lal.content = [letters[0][1], letters[1][1], letters[2][1]];
        eae.content = [letters[0][2], letters[1][2], letters[2][2]];
        vav.content = [letters[0][3], letters[1][3], letters[2][3]];
        const expectedWords: ScrabbleWord[] = [taaat, lal, eae, vav];

        // placing letters on board
        for (let y = 0; y < letters.length; y++) {
            for (let x = 0; x < letters[0].length; x++) {
                gridServiceSpy.scrabbleBoard.squares[x][y].letter = letters[y][x];
                gridServiceSpy.scrabbleBoard.squares[x][y].occupied = true;
                gridServiceSpy.scrabbleBoard.squares[x][y].letter.tile = new Square(x, y);
                gridServiceSpy.scrabbleBoard.squares[x][y].letter.tile.occupied = true;
                if (gridServiceSpy.scrabbleBoard.squares[x][y].letter.character !== 'a') {
                    gridServiceSpy.scrabbleBoard.squares[x][y].isValidated = true;
                }
            }
        }
        const wordsBuilt = service.buildWordsOnBoard('aaa', startCoord, Axis.H);
        expect(wordsBuilt.length).toEqual(expectedWords.length);
        for (let i = 0; i < wordsBuilt.length; i++) {
            expect(wordsBuilt[i].content).toEqual(expectedWords[i].content);
        }
    });
});
