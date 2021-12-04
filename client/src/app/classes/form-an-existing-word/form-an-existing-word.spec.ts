import { createFormAnExistingWord, FormAnExistingWord } from '@app/classes/form-an-existing-word/form-an-existing-word';
import { GoalPoints } from '@app/classes/goal/goal';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { ScrabbleWord } from '@app/classes/scrabble-word/scrabble-word';
import { Axis } from '@app/classes/utilities/utilities';
import { Vec2 } from '@app/classes/vec2/vec2';
import { ValidationService } from '@app/services/validation.service/validation.service';

describe('FormAnExistingWord', () => {
    let formAnExistingWord: FormAnExistingWord;
    let validationServiceSpy: jasmine.SpyObj<ValidationService>;

    beforeEach(() => {
        formAnExistingWord = new FormAnExistingWord();
        validationServiceSpy = jasmine.createSpyObj('ValidationService', ['validWordsFormed']);
        formAnExistingWord.initialize(validationServiceSpy);
        formAnExistingWord.isAchieved = false;
    });

    it('should create an instance', () => {
        expect(new FormAnExistingWord()).toBeTruthy();
    });

    it('initialise should set validationService', () => {
        expect(formAnExistingWord.validationService).toEqual(validationServiceSpy);
    });

    it('achieve should return 20 points when wordsFormed contains an existing word', () => {
        validationServiceSpy.validWordsFormed = ['sa', 'rouge', 'bleu', 'rouge'];
        const letter1 = new ScrabbleLetter('r', 1);
        const letter2 = new ScrabbleLetter('o', 1);
        const letter3 = new ScrabbleLetter('u', 1);
        const letter4 = new ScrabbleLetter('g', 1);
        const letter5 = new ScrabbleLetter('e', 1);
        const newWord = new ScrabbleWord();
        newWord.content = [letter1, letter2, letter3, letter4, letter5];
        newWord.orientation = Axis.V;
        newWord.startPosition = new Vec2(0, 0);
        expect(formAnExistingWord.achieve([newWord])).toEqual(GoalPoints.FormAnExistingWord);
    });

    it('achieve should return 0 points when wordsFormed contains an existing word (less than 5 letters)', () => {
        validationServiceSpy.validWordsFormed = ['sa', 'rouge', 'bleu', 'rouge'];
        const letter1 = new ScrabbleLetter('s', 1);
        const letter2 = new ScrabbleLetter('a', 1);
        const newWord = new ScrabbleWord();
        newWord.content = [letter1, letter2];
        newWord.orientation = Axis.V;
        newWord.startPosition = new Vec2(0, 0);
        expect(formAnExistingWord.achieve([newWord])).toEqual(0);
    });

    it('achieve should return 0 points when wordsFormed goals is already achieved', () => {
        validationServiceSpy.validWordsFormed = ['sa', 'rouge', 'bleu', 'rouge'];
        const letter1 = new ScrabbleLetter('r', 1);
        const letter2 = new ScrabbleLetter('o', 1);
        const letter3 = new ScrabbleLetter('u', 1);
        const letter4 = new ScrabbleLetter('g', 1);
        const letter5 = new ScrabbleLetter('e', 1);
        const newWord = new ScrabbleWord();
        newWord.content = [letter1, letter2, letter3, letter4, letter5];
        newWord.orientation = Axis.V;
        newWord.startPosition = new Vec2(0, 0);
        formAnExistingWord.isAchieved = true;
        expect(formAnExistingWord.achieve([newWord])).toEqual(0);
    });

    it('createFormAnExistingWord should create an instance', () => {
        expect(createFormAnExistingWord()).toBeTruthy();
    });
});
