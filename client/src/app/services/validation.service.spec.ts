import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { ValidationService } from '@app/services/validation.service';
import dictionary from 'src/assets/dictionnary.json';

describe('ValidationService', () => {
    let service: ValidationService;
    let validationServiceSpy: jasmine.SpyObj<ValidationService>;
    let isWordValidSpy: jasmine.SpyObj<unknown>;
    let convertScrabbleWordToStringSpy: jasmine.SpyObj<unknown>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ValidationService, useValue: validationServiceSpy }],
        });
        service = TestBed.inject(ValidationService);

        isWordValidSpy = spyOn<unknown>(service, 'isWordValid').and.callThrough();
        convertScrabbleWordToStringSpy = spyOn<unknown>(service, 'convertScrabbleWordToString').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('isWordValid should return true if word is valid', () => {
        const validWord = 'portée';
        service.dictionary = dictionary as Dictionary;
        expect(service.isWordValid(validWord)).toEqual(true);
    });

    it('isWordValid should return false if word is invalid', () => {
        const validWord = 'porte-feuille';
        service.dictionary = dictionary as Dictionary;
        expect(service.isWordValid(validWord)).toEqual(false);
    });

    it('convertScrabbleWordToString should return a string of the scrabble word', () => {
        const firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'D';
        const secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = 'é';
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'j';
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'à';
        const word: ScrabbleLetter[] = [firstLetter, secondLetter, thirdLetter, fourthLetter];
        expect(service.convertScrabbleWordToString(word)).toEqual('deja');
    });

    it('if words is not null, validateWordsAndCalculateScore should call convertScrabbleWordToString and isWordValid', () => {
        const firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'D';
        const secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = 'é';
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'j';
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'à';
        const word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter];
        const word2: ScrabbleWord = new ScrabbleWord();
        word2.content = [firstLetter, secondLetter, thirdLetter, fourthLetter];
        const words: ScrabbleWord[] = [word1, word2];
        service.validateWordsAndCalculateScore(words);
        expect(convertScrabbleWordToStringSpy).toHaveBeenCalled();
        expect(isWordValidSpy).toHaveBeenCalled();
    });

    it('if one word is not valid, validateWordsAndCalculateScore should return 0', () => {
        const firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'J';
        const secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = "'";
        const thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'a';
        const fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'i';
        const fifthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 's';
        const word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter]; // J'ai - non valide
        const word2: ScrabbleWord = new ScrabbleWord();
        word2.content = [firstLetter, thirdLetter, fourthLetter, fifthLetter]; // Jais - valide
        const words: ScrabbleWord[] = [word1, word2];
        expect(service.validateWordsAndCalculateScore(words)).toEqual(0);
    });
});
