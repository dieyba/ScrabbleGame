import { TestBed } from '@angular/core/testing';
import { PlaceParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { Player } from '@app/classes/player';
import { Column, Row, ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Axis } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';

describe('PlaceService', () => {
    let service: PlaceService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let playerMock: Player;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawLetter', 'drawLetters'], { scrabbleBoard: new ScrabbleBoard(false) });
        rackServiceSpy = jasmine.createSpyObj('RackService', [
            'gridContext',
            'drawLetter',
            'removeLetter',
            'addLetter',
            'rackLetters',
            'exchangeSelected',
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
            ],
        });
        service = TestBed.inject(PlaceService);

        playerMock = new Player('name');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('canPlaceWord should be false when word is outside of scrabble board', () => {
        const placeParams: PlaceParams = { position: new Vec2(Column.Fifteen, 0), orientation: Axis.H, word: 'myWord' };

        expect(service.canPlaceWord(placeParams)).toEqual(false);
    });

    it("'canPlaceWord' should be false if first the word is not in the middle or touching another word", () => {
        const placeParams: PlaceParams = { position: new Vec2(Column.Seven, Row.G), orientation: Axis.H, word: 'myWord' };
        expect(service.canPlaceWord(placeParams)).toEqual(false);
    });

    it("'canPlaceWord' should be true if first the word is in the middle", () => {
        const placeParams: PlaceParams = { position: new Vec2(Column.Seven, Row.H), orientation: Axis.H, word: 'myWord' };
        expect(service.canPlaceWord(placeParams)).toEqual(true);
    });

    it("'canPlaceWord' should be true if the word is touching another word", () => {
        // Placing first word
        const firstWord = 'maison';
        for (let i = 0; i < firstWord.length; i++) {
            // eslint-disable-next-line dot-notation
            service['gridService'].scrabbleBoard.squares[Column.Eight][Row.H + i].letter = new ScrabbleLetter(firstWord[i], 1);
            // eslint-disable-next-line dot-notation
            service['gridService'].scrabbleBoard.squares[Column.Eight][Row.H + i].occupied = true;
        }
        const placeParams: PlaceParams = { position: new Vec2(Column.Nine, Row.G), orientation: Axis.V, word: 'maison' };

        expect(service.canPlaceWord(placeParams)).toEqual(true);
    });

    it('"placeLetter" should remove letter from the rack and place it to the board', () => {
        const playerLetters: ScrabbleLetter[] = [];
        const letterA = new ScrabbleLetter('a', 1);
        const letterStar = new ScrabbleLetter('*', 0);
        playerMock.letters.push(letterA);
        playerMock.letters.push(letterStar);
        const letterToPlace = 'a';
        const coord = new Vec2(Column.Eight, Row.H);

        service.placeLetter(playerMock, letterToPlace, coord);

        // Searching letter in playerLetter
        let playerLetter: ScrabbleLetter | undefined;
        for (const letter of playerLetters) {
            if (letter.character === letterToPlace) {
                playerLetter = letter;
            }
        }
        expect(gridServiceSpy.drawLetter).toHaveBeenCalled();
        expect(rackServiceSpy.removeLetter).toHaveBeenCalled();
        expect(playerLetter).toEqual(undefined);
        // eslint-disable-next-line dot-notation
        expect(letterA.tile).toEqual(service['gridService'].scrabbleBoard.squares[coord.x][coord.y]);
    });

    it('"placeLetter" should remove letter from the rack and place it to the board', () => {
        const playerLetters: ScrabbleLetter[] = [];
        const letterA = new ScrabbleLetter('a', 1);
        const letterStar = new ScrabbleLetter('*', 0);
        playerMock.letters.push(letterA);
        playerMock.letters.push(letterStar);
        const letterToPlace = 'A';
        const coord = new Vec2(Column.Eight, Row.H);

        service.placeLetter(playerMock, letterToPlace, coord);

        // Searching letter in playerLetter
        let playerLetter: ScrabbleLetter | undefined;
        for (const letter of playerLetters) {
            if (letter.character === letterToPlace) {
                playerLetter = letter;
            }
        }
        expect(gridServiceSpy.drawLetter).toHaveBeenCalled();
        expect(rackServiceSpy.removeLetter).toHaveBeenCalled();
        expect(playerLetter).toEqual(undefined);
        // eslint-disable-next-line dot-notation
        expect(letterStar.tile).toEqual(service['gridService'].scrabbleBoard.squares[coord.x][coord.y]);
    });

    it('"placeLetter" should not place letter if the letter is already a there', () => {
        const playerLetters: ScrabbleLetter[] = [];
        const letterA = new ScrabbleLetter('a', 1);
        const letterStar = new ScrabbleLetter('*', 0);
        playerMock.letters.push(letterA);
        playerMock.letters.push(letterStar);
        const letterToPlace = 'a';
        const coord = new Vec2(Column.Eight, Row.H);

        // eslint-disable-next-line dot-notation
        service['gridService'].scrabbleBoard.squares[coord.x][coord.y].occupied = true; // No need to place a real letter
        service.placeLetter(playerMock, letterToPlace, coord);

        // Searching letter in playerLetter
        let playerLetter: ScrabbleLetter | undefined;
        for (const letter of playerLetters) {
            if (letter.character === letterToPlace) {
                playerLetter = letter;
            }
        }
        expect(gridServiceSpy.drawLetter).not.toHaveBeenCalled();
        expect(rackServiceSpy.removeLetter).not.toHaveBeenCalled();
        expect(playerLetter).toEqual(letterA);
        // When coord are negative, it means that the letter is not placed
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(letterA.tile.position.x).toEqual(-1);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(letterA.tile.position.y).toEqual(-1);
    });

    it('"place" should return a syntax error if it\'s not possible to place the word', () => {
        spyOn(service, 'canPlaceWord').and.returnValue(false);

        playerMock.isActive = true;
        const placeParams = { position: new Vec2(Column.Seven, Row.H), orientation: Axis.H, word: 'myWord' };

        expect(service.place(playerMock, placeParams)).toEqual(ErrorType.SyntaxError);
    });
});
