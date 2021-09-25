import { TestBed } from '@angular/core/testing'; /*
import { Dictionary } from '@app/classes/dictionary';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word';*/
import { ValidationService } from '@app/services/validation.service';
// import dictionary from '../../assets/dictionnary.json';

describe('ValidationService', () => {
    // let service: ValidationService;
    let validationServiceSpy: jasmine.SpyObj<ValidationService>;
    // let isWordValidSpy: jasmine.SpyObj<any>;
    // let convertScrabbleWordToStringSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ValidationService, useValue: validationServiceSpy }],
        });
        // service = TestBed.inject(ValidationService);

        // isWordValidSpy = spyOn<any>(service, 'isWordValid').and.callThrough();
        // convertScrabbleWordToStringSpy = spyOn<any>(service, 'convertScrabbleWordToString').and.callThrough();
    });

    /* it('should be created', () => {
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
        let firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'D';
        let secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = 'é';
        let thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'j';
        let fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'à';
        let word: ScrabbleLetter[] = [firstLetter, secondLetter, thirdLetter, fourthLetter];
        expect(service.convertScrabbleWordToString(word)).toEqual('deja');
    });

    it('if words is not null, validateWordsAndCalculateScore should call convertScrabbleWordToString and isWordValid', () => {
        let firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'D';
        let secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = 'é';
        let thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'j';
        let fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'à';
        let word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter];
        let word2: ScrabbleWord = new ScrabbleWord();
        word2.content = [firstLetter, secondLetter, thirdLetter, fourthLetter];
        let words: ScrabbleWord[] = [word1, word2];
        service.validateWordsAndCalculateScore(words);
        expect(convertScrabbleWordToStringSpy).toHaveBeenCalled();
        expect(isWordValidSpy).toHaveBeenCalled();
    });

    it('if one word is not valid, validateWordsAndCalculateScore should return 0', () => {
        let firstLetter: ScrabbleLetter = new ScrabbleLetter();
        firstLetter.character = 'J';
        let secondLetter: ScrabbleLetter = new ScrabbleLetter();
        secondLetter.character = "'";
        let thirdLetter: ScrabbleLetter = new ScrabbleLetter();
        thirdLetter.character = 'a';
        let fourthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 'i';
        let fifthLetter: ScrabbleLetter = new ScrabbleLetter();
        fourthLetter.character = 's';
        let word1: ScrabbleWord = new ScrabbleWord();
        word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter]; // J'ai - non valide
        let word2: ScrabbleWord = new ScrabbleWord();
        word2.content = [firstLetter, thirdLetter, fourthLetter, fifthLetter]; // Jais - valide
        let words: ScrabbleWord[] = [word1, word2];
        expect(service.validateWordsAndCalculateScore(words)).toEqual(0);
    }); */
});
