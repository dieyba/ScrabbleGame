import { TestBed } from '@angular/core/testing';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { GridService } from './grid.service';
import { WordBuilderService } from './word-builder.service';

// const TOWARD_START = true;

// disable dot notation to allow access to wordBuilder's private gridService
/* eslint-disable  dot-notation */
describe('WordBuilderService', () => {
    let service: WordBuilderService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', { scrabbleBoard: new ScrabbleBoard() });
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        });
        service = TestBed.inject(WordBuilderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // findWordEdge
    // it('should return initial coordinates passed in', () => {
    //     const centerCoord = new Vec2(Column.Eight, Row.H);
    //     const emptySquareCoord = new Vec2(Column.One, Row.A);
    //     const outsideBoardCoord = new Vec2(-BOARD_SIZE, BOARD_SIZE + 1);

    //     // only putting one letter in the center
    //     service['gridService'].scrabbleBoard.squares[centerCoord.x][centerCoord.y].letter = new ScrabbleLetter('a', 1);
    //     service['gridService'].scrabbleBoard.squares[centerCoord.x][centerCoord.y].occupied = true;

    //     expect(service.findWordEdge(centerCoord, Axis.H, TOWARD_START)).toEqual(centerCoord);
    //     expect(service.findWordEdge(centerCoord, Axis.H, !TOWARD_START)).toEqual(centerCoord);
    //     expect(service.findWordEdge(centerCoord, Axis.V, TOWARD_START)).toEqual(centerCoord);
    //     expect(service.findWordEdge(centerCoord, Axis.V, !TOWARD_START)).toEqual(centerCoord);
    //     expect(service.findWordEdge(emptySquareCoord, Axis.H, TOWARD_START)).toEqual(emptySquareCoord);
    //     expect(service.findWordEdge(outsideBoardCoord, Axis.V, !TOWARD_START)).toEqual(outsideBoardCoord);
    // });

    // it('should find coordinates of first and last horizontal letter', () => {
    //     const initialCoord = new Vec2(Column.Five, Row.D);
    //     const startCoord = new Vec2(Column.Five, Row.B);
    //     const endCoordHorizontal = new Vec2(Column.Nine, Row.B);
    //     const lenght = Column.Nine - Column.Five;
    //     for (let i = 0; i < lenght; i++) {
    //         service['gridService'].scrabbleBoard.squares[startCoord.x + i][startCoord.y].letter = new ScrabbleLetter('a', 1);
    //         service['gridService'].scrabbleBoard.squares[startCoord.x + i][startCoord.y].occupied = true;
    //     }

    //     expect(service.findWordEdge(initialCoord, Axis.H, TOWARD_START)).toEqual(startCoord);
    //     expect(service.findWordEdge(initialCoord, Axis.H, !TOWARD_START)).toEqual(endCoordHorizontal);
    // });

    // it('should find coordinates of first and last vertical letter', () => {
    //     const initialCoord = new Vec2(Column.Five, Row.D);
    //     const startCoord = new Vec2(Column.Five, Row.B);
    //     const endCoordVertical = new Vec2(Column.Five, Row.F);
    //     const lenght = Row.F - Row.B;
    //     for (let j = 0; j < lenght; j++) {
    //         service['gridService'].scrabbleBoard.squares[startCoord.x][startCoord.y + j].letter = new ScrabbleLetter('a', 1);
    //         service['gridService'].scrabbleBoard.squares[startCoord.x][startCoord.y + j].occupied = true;
    //     }

    //     expect(service.findWordEdge(initialCoord, Axis.V, TOWARD_START)).toEqual(startCoord);
    //     expect(service.findWordEdge(initialCoord, Axis.V, !TOWARD_START)).toEqual(endCoordVertical);
    // });

    // wip
    // it('should stop looking for the edge coordinates at the boards border', () => {
    //     const topCenter = new Vec2(Column.Eight, 0);
    //     const topLeft = new Vec2(0, 0);
    //     const topRight = new Vec2(BOARD_SIZE, 0);
    //     for (let i = 0; i < BOARD_SIZE; i++) {
    //         service['gridService'].scrabbleBoard.squares[i][0].letter = new ScrabbleLetter('a', 1);
    //         service['gridService'].scrabbleBoard.squares[i][0].occupied = true;
    //     }
    //     expect(service.findWordEdge(topCenter, Axis.H, TOWARD_START)).toEqual(topLeft);
    //     expect(service.findWordEdge(topCenter, Axis.H, !TOWARD_START)).toEqual(topRight);
    // });

    // buildScrabbleWord(word: string, coord: Vec2, axis: Axis)
    // build word from empty square = should be empty word
    // build word from one letter square = should be empty word
    // try build from out of bound coord = should be empty word
    // build normal word in both orientation = should return scrabble word of the word

    // buildWordsOnBoard(coord: Vec2, axis: Axis):
    // try putting out of bound coord
    // put word surrounded by tiles = should be all those words
    // put words surrounded by tiles, first placed letter already validated
    // = should be all execpt opposite orientation word build from that first placed letter
    // put word isolated on all side by on square = should only be center
});
