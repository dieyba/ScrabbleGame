// import { TestBed } from '@angular/core/testing';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { SquareColor } from '@app/classes/square';
// import { Colors, GridService } from '@app/services/grid.service';

// describe('GridService', () => {
//     let service: GridService;
//     let ctxStub: CanvasRenderingContext2D;

//     const DEFAULT_WIDTH = 600;
//     const DEFAULT_HEIGHT = 600;

//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(GridService);
//         ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
//         service.gridContext = ctxStub;
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it(' width should return the width of the grid canvas', () => {
//         expect(service.width).toEqual(DEFAULT_WIDTH);
//     });

//     it(' height should return the height of the grid canvas', () => {
//         expect(service.width).toEqual(DEFAULT_HEIGHT);
//     });

//     it(' drawGrid should call moveTo and lineTo 32 times', () => {
//         const expectedCallTimes = 32;
//         const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
//         const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
//         service.drawGrid();
//         expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
//         expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
//     });

//     it('drawColors should color pixels on the canvas', () => {
//         let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const beforeSize = imageData.filter((x) => x !== 0).length;
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         service.drawColors();
//         imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const afterSize = imageData.filter((x) => x !== 0).length;
//         expect(afterSize).toBeGreaterThan(beforeSize);
//         expect(fillTextSpy).toHaveBeenCalled();
//     });

//     it('drawLetter should call fillText on the canvas', () => {
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         let letter: ScrabbleLetter = new ScrabbleLetter('D', 1);
//         service.drawLetter(letter, 5, 6);
//         expect(fillTextSpy).toHaveBeenCalled();
//     });

//     it('drawLetter should handle double digits', () => {
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         let letter: ScrabbleLetter = new ScrabbleLetter('D', 11);
//         service.drawLetter(letter, 5, 6);
//         expect(fillTextSpy).toHaveBeenCalled();
//     });

//     it('drawLetters should handle double digits', () => {
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         let letter: ScrabbleLetter = new ScrabbleLetter('D', 11);
//         service.scrabbleBoard.squares[5][6].letter = letter;
//         service.drawLetters();
//         expect(fillTextSpy).toHaveBeenCalled();
//     });

//     it('drawLetters should call fillText on the canvas', () => {
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         let letter: ScrabbleLetter = new ScrabbleLetter('D', 1);
//         service.scrabbleBoard.squares[5][6].letter = letter;
//         service.drawLetters();
//         expect(fillTextSpy).toHaveBeenCalled();
//     });

//     it('sizeUpLetters should change font to a bigger font', () => {
//         service.sizeUpLetters();
//         expect(service.currentLetterFont).toEqual('35px system-ui');
//         expect(service.currentValueFont).toEqual('15px system-ui');
//     });

//     it('sizeDownLetters should change font to a smaller font', () => {
//         service.sizeDownLetters();
//         expect(service.currentLetterFont).toEqual('30px system-ui');
//         expect(service.currentValueFont).toEqual('11px system-ui');
//     });

//     it('drawSingleSquareColor should change fillStyle to white', () => {
//         service.scrabbleBoard.squares[6][6].color = SquareColor.None;
//         service.drawSingleSquareColor(6, 6);
//         expect(service.gridContext.fillStyle).toEqual('#ffffff');
//     });

//     it('removeSquare should change fillStyle to right color', () => {
//         service.scrabbleBoard.squares[0][3].color = SquareColor.Teal;
//         service.removeSquare(0, 3);
//         expect(service.gridContext.fillStyle).toEqual(Colors.Teal);
//     });

//     it('removeSquare should change fillStyle to right color', () => {
//         service.scrabbleBoard.squares[5][5].color = SquareColor.DarkBlue;
//         service.removeSquare(5, 5);
//         expect(service.gridContext.fillStyle).toEqual(Colors.DarkBlue);
//     });

//     it('removeSquare should change fillStyle to right color', () => {
//         service.scrabbleBoard.squares[0][3].color = SquareColor.Pink;
//         service.scrabbleBoard.squares[0][3].occupied = true;
//         service.removeSquare(0, 3);
//         expect(service.gridContext.fillStyle).toEqual(Colors.Pink);
//     });

//     it('removeSquare should change fillStyle to right color', () => {
//         service.scrabbleBoard.squares[0][3].color = SquareColor.Red;
//         service.removeSquare(0, 3);
//         expect(service.gridContext.fillStyle).toEqual(Colors.Red);
//     });
// });
