// import { TestBed } from '@angular/core/testing';
// import { BOARD_SIZE, ScrabbleBoard } from '@app/classes/scrabble-board/scrabble-board';
// import { SquareColor } from '@app/classes/square/square';
// import { Axis } from '@app/classes/utilities/utilities';
// import { Vec2 } from '@app/classes/vec2/vec2';
// import { ABSOLUTE_BOARD_SIZE, ACTUAL_SQUARE_SIZE } from '@app/services/grid.service/grid.service';
// import { MouseWordPlacerCompanionService } from '@app/services/mouse-word-placer-companion.service/mouse-word-placer-companion.service';

// describe('MouseWordPlacerCompanionService', () => {
//     let service: MouseWordPlacerCompanionService;
//     const H_POS = 260;
//     const SEVEN_POS = 300;
//     const H = 6;
//     const SEVEN = 7;
//     const hSevenPosition = new Vec2(SEVEN_POS, H_POS);
//     const ERROR = ABSOLUTE_BOARD_SIZE + ACTUAL_SQUARE_SIZE; // outside of the board
//     const errorVector = new Vec2(ERROR, ERROR);
//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(MouseWordPlacerCompanionService);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });
//     // TODO: fix this test
//     // it('convertPositionToGridIndex should be able to convert a mouse position on the canvas into a position in the board', () => {
//     //     const result = service.convertPositionToGridIndex(hSevenPosition);
//     //     expect(result.x).toBe(SEVEN);
//     //     expect(result[1]).toBe(H);
//     // });
//     // Test getLettersFromBoard

//     it('convertPositionToGridIndex should return an error array if the position is outside of the board', () => {
//         const result = service.convertPositionToGridIndex(errorVector);
//         expect(result.x).toBe(BOARD_SIZE);
//         expect(result[1]).toBe(BOARD_SIZE);
//     });
//     it('findNextSquare should return the next square in the board that is not occupied', () => {
//         const entryBoard = new ScrabbleBoard(false);
//         const resultHorizontal = service.findNextSquare(Axis.H, hSevenPosition, entryBoard);
//         expect(resultHorizontal.x).toBe(SEVEN_POS + ACTUAL_SQUARE_SIZE);
//         expect(resultHorizontal.y).toBe(H_POS);
//         const resultVertical = service.findNextSquare(Axis.V, hSevenPosition, entryBoard);
//         expect(resultVertical.x).toBe(SEVEN_POS);
//         expect(resultVertical.y).toBe(H_POS + ACTUAL_SQUARE_SIZE);
//         entryBoard.squares[SEVEN + 1][H].occupied = true;
//         const resultHorizontalOccupied = service.findNextSquare(Axis.H, hSevenPosition, entryBoard);
//         entryBoard.squares[H][SEVEN + 1].occupied = true;
//         const resultVerticalOccupied = service.findNextSquare(Axis.V, hSevenPosition, entryBoard);
//         expect(resultHorizontalOccupied.x).toBe(SEVEN_POS + ACTUAL_SQUARE_SIZE);
//         expect(resultHorizontalOccupied.y).toBe(H_POS);
//         expect(resultVerticalOccupied.x).toBe(SEVEN_POS);
//         expect(resultVerticalOccupied.y).toBe(H_POS + ACTUAL_SQUARE_SIZE);
//     });
//     it('findNextSquare should return a 0, 0 vector in the case of the next square being outside of the board', () => {
//         const entryBoard = new ScrabbleBoard(false);
//         const resultHorizontal = service.findNextSquare(Axis.H, errorVector, entryBoard);
//         const resultVertical = service.findNextSquare(Axis.V, errorVector, entryBoard);
//         expect(resultHorizontal).toEqual(new Vec2(0, 0));
//         expect(resultVertical).toEqual(new Vec2(0, 0));
//     });
//     it('findPreviousSquare should return the previous square in the board that is not occupied', () => {
//         const entryBoard = new ScrabbleBoard(false);
//         const resultHorizontal = service.findPreviousSquare(Axis.H, hSevenPosition, entryBoard);
//         expect(resultHorizontal.x).toBe(SEVEN_POS - ACTUAL_SQUARE_SIZE);
//         expect(resultHorizontal.y).toBe(H_POS);
//         const resultVertical = service.findPreviousSquare(Axis.V, hSevenPosition, entryBoard);
//         expect(resultVertical.x).toBe(SEVEN_POS);
//         expect(resultVertical.y).toBe(H_POS - ACTUAL_SQUARE_SIZE);
//         entryBoard.squares[SEVEN - 1][H].occupied = true;
//         const resultHorizontalOccupied = service.findPreviousSquare(Axis.H, hSevenPosition, entryBoard);
//         entryBoard.squares[H][SEVEN - 1].occupied = true;
//         const resultVerticalOccupied = service.findPreviousSquare(Axis.V, hSevenPosition, entryBoard);
//         expect(resultHorizontalOccupied.x).toBe(SEVEN_POS - ACTUAL_SQUARE_SIZE);
//         expect(resultHorizontalOccupied.y).toBe(H_POS);
//         expect(resultVerticalOccupied.x).toBe(SEVEN_POS);
//         expect(resultVerticalOccupied.y).toBe(H_POS - ACTUAL_SQUARE_SIZE);
//     });
//     it('findPreviousSquare should return a 0, 0 vector in the case of the previous square being outside of the board', () => {
//         const entryBoard = new ScrabbleBoard(false);
//         const negativeErrorVector = new Vec2(-ERROR, -ERROR);
//         const resultHorizontal = service.findPreviousSquare(Axis.H, negativeErrorVector, entryBoard);
//         const resultVertical = service.findPreviousSquare(Axis.V, negativeErrorVector, entryBoard);
//         expect(resultHorizontal).toEqual(new Vec2(0, 0));
//         expect(resultVertical).toEqual(new Vec2(0, 0));
//     });
//     it('samePosition should compare two vector and return if they have the same x and y values, respectively', () => {
//         const vector1 = new Vec2(1, 1);
//         const vector2 = new Vec2(1, 1);
//         expect(service.samePosition(vector1, vector2)).toBe(true);
//     });
//     it('convertColorToString should return a string representing a color', () => {
//         const none = SquareColor.None;
//         const teal = SquareColor.Teal;
//         const darkBlue = SquareColor.DarkBlue;
//         const pink = SquareColor.Pink;
//         const red = SquareColor.Red;
//         expect(service.convertColorToString(none)).toBe('white');
//         expect(service.convertColorToString(teal)).toBe('teal');
//         expect(service.convertColorToString(darkBlue)).toBe('dark blue');
//         expect(service.convertColorToString(pink)).toBe('pink');
//         expect(service.convertColorToString(red)).toBe('red');
//     });
//     it('changeFillStyleColor should change the context fillStyle using the string in parameter', () => {
//         const context = {
//             fillStyle: '',
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             fillRect: () => {},
//         } as unknown as CanvasRenderingContext2D;
//         service.changeFillStyleColor(context, 'white');
//         expect(context.fillStyle).toBe('white');
//         service.changeFillStyleColor(context, 'teal');
//         expect(context.fillStyle).toBe('#ACE3EE');
//         service.changeFillStyleColor(context, 'dark blue');
//         expect(context.fillStyle).toBe('#6AA0E0');
//         service.changeFillStyleColor(context, 'pink');
//         expect(context.fillStyle).toBe('#FFA7C7');
//         service.changeFillStyleColor(context, 'red');
//         expect(context.fillStyle).toBe('#E60000');
//     });
// });
