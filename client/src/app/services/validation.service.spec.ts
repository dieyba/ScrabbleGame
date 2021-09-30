import { TestBed } from '@angular/core/testing';
import { Dictionary, DictionaryType } from '@app/classes/dictionary';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { ValidationService } from '@app/services/validation.service';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('ValidationService', () => {
    let service: ValidationService;
    let isWordValidSpy: jasmine.SpyObj<any>;
    let convertScrabbleWordToStringSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValidationService);

        isWordValidSpy = spyOn<any>(service, 'isWordValid').and.callThrough();
        convertScrabbleWordToStringSpy = spyOn<any>(service, 'convertScrabbleWordToString').and.callThrough();
        service.dictionary = new Dictionary(DictionaryType.Default);
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
        const secondLetter: ScrabbleLetter = new ScrabbleLetter("'", 1);
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter('i', 1);
        const word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter]; // J'ai - non valide
        const word2: ScrabbleWord = new ScrabbleWord();
        word2.content = [firstLetter, thirdLetter, fourthLetter]; // Jai - valide
        const words: ScrabbleWord[] = [word1, word2];
        expect(service.validateWordsAndCalculateScore(words)).toEqual(0);
    });

    /* it('newLettersCount adds a bonus if equals 7', () => {
        let letter1: ScrabbleLetter = new ScrabbleLetter('a', 1);
        let letter2: ScrabbleLetter = new ScrabbleLetter('b', 1);
        let letter3: ScrabbleLetter = new ScrabbleLetter('a', 1);
        let letter4: ScrabbleLetter = new ScrabbleLetter('j', 1);
        let letter5: ScrabbleLetter = new ScrabbleLetter('o', 1);
        let letter6: ScrabbleLetter = new ScrabbleLetter('u', 1);
        let letter7: ScrabbleLetter = new ScrabbleLetter('e', 1);
        let letters: ScrabbleLetter[] = [letter1, letter2, letter3, letter4, letter5, letter6, letter7];
        let word: ScrabbleWord = new ScrabbleWord();
        word.content = letters;
        expect(service.validateWordsAndCalculateScore([word])).toEqual(7);
    }); */
});
