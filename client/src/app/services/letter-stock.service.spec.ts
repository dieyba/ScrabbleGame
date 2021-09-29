import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { LetterStock } from '@app/services/letter-stock.service';
// import SpyObj = jasmine.SpyObj;

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
  // CE TEST NE FONCTIONNE PAS ENCORE
  // it('should call isEmpty and randomNumber when takeLettersFromStock is called', () => {
  //   let spyStock: SpyObj<LetterStock> = jasmine.createSpyObj('LetterStock', ['takeLettersFromStock', 'randomNumber', 'isEmpty']);
  //   //let stock: LetterStock = new LetterStock();

  //   spyStock.takeLettersFromStock(4);

  //   expect(spyStock.isEmpty).toHaveBeenCalled();
  //   //expect(spyStock.randomNumber).toHaveBeenCalled();
  // });

  it('should create an instance', () => {
    expect(new LetterStock()).toBeTruthy();
  });

  it('should create an instance with 102 letters', () => {
    expect(new LetterStock().letterStock.length).toEqual(NUMBER_OF_LETTERS);
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
    // stock.letterStock = [];
    expect(stock.isEmpty()).toBeTrue();
  });

  it('takeLettersFromStock should stop if there is no more letters', () => {
    const stock: LetterStock = new LetterStock();
    stock.takeLettersFromStock(NUMBER_OF_LETTERS - 2);

    const remainingLetters: ScrabbleLetter[] = stock.takeLettersFromStock(OCCURENCE_NUMBER_5);

    expect(remainingLetters.length).toEqual(2);
  });
});
