import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { LetterStock } from '@app/services/letter-stock.service';
//import SpyObj = jasmine.SpyObj;

export const NUMBER_OF_LETTERS = 102;
// const VALUE_LETTER_0 = 0;
// const VALUE_LETTER_1 = 1;
// const VALUE_LETTER_2 = 2;
// const VALUE_LETTER_3 = 3;
// const VALUE_LETTER_4 = 4;
// const VALUE_LETTER_8 = 8;
const VALUE_LETTER_10 = 10;

// const OCCURENCE_NUMBER_1 = 1;
// const OCCURENCE_NUMBER_2 = 2;
// const OCCURENCE_NUMBER_3 = 3;
const OCCURENCE_NUMBER_5 = 5;
// const OCCURENCE_NUMBER_6 = 6;
// const OCCURENCE_NUMBER_8 = 8;
// const OCCURENCE_NUMBER_9 = 9;
// const OCCURENCE_NUMBER_15 = 15;

describe('LetterStock', () => {
  it('should create an instance', () => {
    expect(new LetterStock()).toBeTruthy();
  });

  it('should create an instance with 102 letters', () => {
    expect(new LetterStock().letterStock.length).toEqual(NUMBER_OF_LETTERS);
  });

  it('should call isEmpty when takeLettersFromStock is called', () => {
    let stock: LetterStock = new LetterStock();
    const spy = spyOn(stock, 'isEmpty').and.stub();
    stock.takeLettersFromStock(NUMBER_OF_LETTERS);

    expect(spy).toHaveBeenCalled();
  });

  it('should remove the right number of letter in the stock', () => {
    const stock: LetterStock = new LetterStock();
    stock.takeLettersFromStock(2);
    expect(stock.letterStock.length).toEqual(NUMBER_OF_LETTERS - 2);
  });

  it('should add the right number of letter in the stock', () => {
    const stock: LetterStock = new LetterStock();
    stock.addLettersToStock(new ScrabbleLetter('z', VALUE_LETTER_10), OCCURENCE_NUMBER_5);
    expect(stock.letterStock.length).toEqual(NUMBER_OF_LETTERS + OCCURENCE_NUMBER_5);
  });

  it('should check if the stock is empty or not', () => {
    const stock: LetterStock = new LetterStock();
    expect(stock.isEmpty()).toBeFalse();

    stock.takeLettersFromStock(NUMBER_OF_LETTERS);
    expect(stock.isEmpty()).toBeTrue();
  });

  it('takeLettersFromStock should stop if there is no more letters', () => {
    const stock: LetterStock = new LetterStock();
    stock.takeLettersFromStock(NUMBER_OF_LETTERS - 2);

    const remainingLetters: ScrabbleLetter[] = stock.takeLettersFromStock(OCCURENCE_NUMBER_5);

    expect(remainingLetters.length).toEqual(2);
  });

  it('should call takeLettersFromStock when exchangeLetters is called', () => {
    let stock: LetterStock = new LetterStock();
    let lettersToChange: ScrabbleLetter[] = [new ScrabbleLetter('a', 1), new ScrabbleLetter('j', 10)];

    const spy = spyOn(stock, 'takeLettersFromStock').and.stub();
    stock.exchangeLetters(lettersToChange);

    expect(spy).toHaveBeenCalled();
  });

  it('should exchange the given letters with the same number of letters in the letter stock', () => {
    let stock: LetterStock = new LetterStock();
    stock.letterStock = [];
    let lettersToExchangeWithStock: ScrabbleLetter[] = [new ScrabbleLetter('a', 1)];
    let lettersFromStock: ScrabbleLetter[] = [new ScrabbleLetter('z', 10)];
    stock.addLettersToStock(lettersFromStock[0], 1);

    expect(stock.exchangeLetters(lettersToExchangeWithStock)).toEqual(lettersFromStock);
    expect(stock.letterStock[0]).toEqual(lettersToExchangeWithStock[0]);
  });
});
