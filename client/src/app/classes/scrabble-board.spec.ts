import { ScrabbleBoard } from './scrabble-board';
import { ScrabbleLetter } from './scrabble-letter';
import { Vec2 } from './vec2';

describe('ScrabbleBoard', () => {
    let board: ScrabbleBoard;
    let position: Vec2;
    let orientation: string;
    let motAPlacer: string;

    beforeEach(() => {
        board = new ScrabbleBoard();
        position = new Vec2(); // x = 0 et y = 0
        orientation = 'h';
        motAPlacer = 'maison';
    });

    it('should create an instance', () => {
        expect(board).toBeTruthy();
    });

    it('isCoordInsideBoard should return true if the coordinates are inside the board', () => {
        position.x = 5;
        position.y = 6;
        expect(board.isCoordInsideBoard(position)).toBeTrue();
    });

    it('isCoordInsideBoard should return false if the coordinates are not inside the board', () => {
        position.x = -1;
        position.y = 6;
        expect(board.isCoordInsideBoard(position)).toBeFalse();
    });

    it('isWordInsideBoard should call isCoordInsideBoard', () => {
        const spy = spyOn(board, 'isCoordInsideBoard');
        board.isCoordInsideBoard(position);
        expect(spy).toHaveBeenCalled();
    });

    it('isWordInsideBoard should return false if the coordinates of the first letter are not inside the board', () => {
        position.x = -1;
        position.y = 6;
        expect(board.isWordInsideBoard(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordInsideBoard should return false if the word is not completely inside the board', () => {
        position.x = 10;
        position.y = 10;
        expect(board.isWordInsideBoard(motAPlacer, position, orientation)).toBeFalse();

        orientation = 'v';
        expect(board.isWordInsideBoard(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordInsideBoard should return true if the word inside the board', () => {
        expect(board.isWordInsideBoard(motAPlacer, position, orientation)).toBeTrue();
    });

    it('isWordPassingInCenter should return true if the word pass in the middle', () => {
        position.x = 4;
        position.y = 7;
        expect(board.isWordPassingInCenter(motAPlacer, position, orientation)).toBeTrue();

        position.x = 7;
        position.y = 4;
        orientation = 'v';
        expect(board.isWordPassingInCenter(motAPlacer, position, orientation)).toBeTrue();

        motAPlacer = 'oui'; // le mot est trop court donc il ne passe pas par le milieu
        expect(board.isWordPassingInCenter(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordPartOfAnotherWord should return true if the word is part of another word on the board', () => {
        let letterAlreadyPlaced = new ScrabbleLetter('m', 1);
        board.squares[0][0].letter = letterAlreadyPlaced;
        board.squares[0][0].occupied = true;
        expect(board.isWordPartOfAnotherWord(motAPlacer, position, orientation)).toBeTrue();

        orientation = 'v';
        expect(board.isWordPartOfAnotherWord(motAPlacer, position, orientation)).toBeTrue();

        letterAlreadyPlaced = new ScrabbleLetter('a', 1);
        board.squares[0][0].letter = letterAlreadyPlaced;
        expect(board.isWordPartOfAnotherWord(motAPlacer, position, orientation)).toBeFalse();

        position.y = 4;
        expect(board.isWordPartOfAnotherWord(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordTouchingOtherWord should return true if the word touch another word on the board on the left or the right (word horizontale)', () => {
        const letterAlreadyPlaced = new ScrabbleLetter('a', 1);
        board.squares[0][0].letter = letterAlreadyPlaced;
        board.squares[0][0].occupied = true;
        position.x = 1;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();

        board.squares[0][0].occupied = false;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeFalse();

        board.squares[position.x + motAPlacer.length][0].letter = letterAlreadyPlaced;
        board.squares[position.x + motAPlacer.length][0].occupied = true;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();
    });

    it('isWordTouchingOtherWord should return true if the word touch another word on the board on the top or the bottom (word verticale)', () => {
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeFalse();
        const letterAlreadyPlaced = new ScrabbleLetter('a', 1);
        board.squares[0][0].letter = letterAlreadyPlaced;
        board.squares[0][0].occupied = true;
        orientation = 'v';
        position.y = 1;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();

        board.squares[0][0].occupied = false;

        board.squares[0][position.y + motAPlacer.length].letter = letterAlreadyPlaced;
        board.squares[0][position.y + motAPlacer.length].occupied = true;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();
    });

    it('isWordTouchingOtherWord should return true if the word touch another word on the board above it (word horizontal)', () => {
        const letterAlreadyPlaced = new ScrabbleLetter('a', 1);
        board.squares[5][0].letter = letterAlreadyPlaced;
        board.squares[5][0].occupied = true;
        position.y = 1;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();

        board.squares[5][0].occupied = false;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordTouchingOtherWord should return true if the word touch another word on the board below it (word horizontal)', () => {
        const letterAlreadyPlaced = new ScrabbleLetter('a', 1);
        board.squares[5][2].letter = letterAlreadyPlaced;
        board.squares[5][2].occupied = true;
        position.y = 1;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();

        board.squares[5][2].occupied = false;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordTouchingOtherWord should return true if the word touch another word on the board on the left (word vertical)', () => {
        const letterAlreadyPlaced = new ScrabbleLetter('a', 1);
        board.squares[0][5].letter = letterAlreadyPlaced;
        board.squares[0][5].occupied = true;
        orientation = 'v';
        position.x = 1;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();

        board.squares[0][5].occupied = false;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordTouchingOtherWord should return true if the word touch another word on the board on the right (word vertical)', () => {
        const letterAlreadyPlaced = new ScrabbleLetter('a', 1);
        board.squares[2][5].letter = letterAlreadyPlaced;
        board.squares[2][5].occupied = true;
        orientation = 'v';
        position.x = 1;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeTrue();

        board.squares[2][5].occupied = false;
        expect(board.isWordTouchingOtherWord(motAPlacer, position, orientation)).toBeFalse();
    });

    it('isWordTouchingOtherWord should call isCoordInsideBoard', () => {
        const spy = spyOn(board, 'isCoordInsideBoard');
        board.isWordTouchingOtherWord(motAPlacer, position, orientation);
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
