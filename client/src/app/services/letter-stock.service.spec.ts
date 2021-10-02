import { TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { LetterStock } from '@app/services/letter-stock.service';

const VALUE_LETTER_10 = 10;
const OCCURENCE_NUMBER_5 = 5;
export const NUMBER_OF_LETTERS = 102;

describe('LetterStock', () => {
    let stock: LetterStock;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        stock = TestBed.inject(LetterStock);
    });

    it('should be created', () => {
        expect(stock).toBeTruthy();
    });

    it('should create an instance with 102 letters', () => {
        expect(stock.letterStock.length).toEqual(NUMBER_OF_LETTERS);
    });

    it('should call isEmpty when takeLettersFromStock is called', () => {
        const spy = spyOn(stock, 'isEmpty').and.stub();
        stock.takeLettersFromStock(NUMBER_OF_LETTERS);

        expect(spy).toHaveBeenCalled();
    });

    it('should remove the right number of letter in the stock', () => {
        stock.takeLettersFromStock(2);
        expect(stock.letterStock.length).toEqual(NUMBER_OF_LETTERS - 2);
    });

    it('should add the right number of letter in the stock', () => {
        stock.addLettersToStock(new ScrabbleLetter('z', VALUE_LETTER_10), OCCURENCE_NUMBER_5);
        expect(stock.letterStock.length).toEqual(NUMBER_OF_LETTERS + OCCURENCE_NUMBER_5);
    });

    it('should check if the stock is empty or not', () => {
        expect(stock.isEmpty()).toBeFalse();

        stock.takeLettersFromStock(NUMBER_OF_LETTERS);
        expect(stock.isEmpty()).toBeTrue();
    });

    it('takeLettersFromStock should stop if there is no more letters', () => {
        stock.takeLettersFromStock(NUMBER_OF_LETTERS - 2);

        const remainingLetters: ScrabbleLetter[] = stock.takeLettersFromStock(OCCURENCE_NUMBER_5);

        expect(remainingLetters.length).toEqual(2);
    });

    it('should call takeLettersFromStock when exchangeLetters is called', () => {
        let lettersToChange: ScrabbleLetter[] = [new ScrabbleLetter('a', 1), new ScrabbleLetter('j', 10)];

        const spy = spyOn(stock, 'takeLettersFromStock').and.stub();
        stock.exchangeLetters(lettersToChange);

        expect(spy).toHaveBeenCalled();
    });

    it('should exchange the given letters with the same number of letters in the letter stock', () => {
        stock.letterStock = [];
        let lettersToExchangeWithStock: ScrabbleLetter[] = [new ScrabbleLetter('a', 1)];
        let lettersFromStock: ScrabbleLetter[] = [new ScrabbleLetter('z', 10)];
        stock.addLettersToStock(lettersFromStock[0], 1);

        expect(stock.exchangeLetters(lettersToExchangeWithStock)).toEqual(lettersFromStock);
        expect(stock.letterStock[0]).toEqual(lettersToExchangeWithStock[0]);
    });
});
