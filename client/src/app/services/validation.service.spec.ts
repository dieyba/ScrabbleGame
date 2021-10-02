import { TestBed } from '@angular/core/testing';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { ValidationService } from '@app/services/validation.service';
import { GridService } from './grid.service';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('ValidationService', () => {
    let service: ValidationService;
    let isWordValidSpy: jasmine.SpyObj<any>;
    let convertScrabbleWordToStringSpy: jasmine.SpyObj<any>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        });
        service = TestBed.inject(ValidationService);

        gridServiceSpy = jasmine.createSpyObj('GridService', ['scrabbleBoard', 'drawLetter']);
        isWordValidSpy = spyOn<any>(service, 'isWordValid').and.callThrough();
        convertScrabbleWordToStringSpy = spyOn<any>(service, 'convertScrabbleWordToString').and.callThrough();
        service.dictionary = new Dictionary(DictionaryType.Default);

        gridServiceSpy.scrabbleBoard = new ScrabbleBoard();
        gridServiceSpy.scrabbleBoard.generateBoard();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('isWordValid should return true if word is valid', () => {
        const validWord = 'portee';
        expect(service.isWordValid(validWord)).toEqual(true);
    });

    it('isWordValid should return false if word is invalid', () => {
        const validWord = 'porte-feuille';
        expect(service.isWordValid(validWord)).toEqual(false);
    });

    it('convertScrabbleWordToString should return a string of the scrabble word', () => {
        const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
        const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
        const letter3: ScrabbleLetter = new ScrabbleLetter('j', 4);
        const letter4: ScrabbleLetter = new ScrabbleLetter('à', 3);
        const word: ScrabbleLetter[] = [letter1, letter2, letter3, letter4];
        expect(service.convertScrabbleWordToString(word)).toEqual('deja');
    });

    it('if words is not null, validateWordsAndCalculateScore should call convertScrabbleWordToString and isWordValid', () => {
        const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
        const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
        const letter3: ScrabbleLetter = new ScrabbleLetter('j', 4);
        const letter4: ScrabbleLetter = new ScrabbleLetter('à', 3);
        const word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [letter1, letter2, letter3, letter4];
        const word2: ScrabbleWord = new ScrabbleWord();
        word2.content = [letter1, letter2, letter3, letter4];
        const words: ScrabbleWord[] = [word1, word2];
        service.validateWordsAndCalculateScore(words);
        expect(convertScrabbleWordToStringSpy).toHaveBeenCalled();
        expect(isWordValidSpy).toHaveBeenCalled();
    });

    it('if one word is not valid, validateWordsAndCalculateScore should return 0', () => {
        const firstLetter: ScrabbleLetter = new ScrabbleLetter('J', 1);
        gridServiceSpy.scrabbleBoard.squares[0][0].occupied = true;
        const secondLetter: ScrabbleLetter = new ScrabbleLetter("'", 1);
        gridServiceSpy.scrabbleBoard.squares[0][1].occupied = true;
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        gridServiceSpy.scrabbleBoard.squares[0][2].occupied = true;
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter('i', 1);
        gridServiceSpy.scrabbleBoard.squares[0][3].occupied = true;
        const word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter]; // J'ai - non valideword.startPosition= {x:0, y:0};
        word1.orientation = WordOrientation.Vertical;
        const word2: ScrabbleWord = new ScrabbleWord();
        word2.content = [firstLetter, thirdLetter, fourthLetter]; // Jai - valideword.startPosition= {x:0, y:0};
        word1.orientation = WordOrientation.Vertical;
        const words: ScrabbleWord[] = [word1, word2];
        expect(service.validateWordsAndCalculateScore(words)).toEqual(0);
    });
});
