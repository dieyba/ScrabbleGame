import { LetterStock } from './letter-stock';
import { ScrabbleLetter } from './scrabble-letter';
//import SpyObj = jasmine.SpyObj;

export const NUMBER_OF_LETTERS = 102;

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

  it('should decrease the size of the tab', () => {
    let stock: LetterStock = new LetterStock();
    stock.resize(4);
    expect(stock.letterStock.length).toBeLessThan(NUMBER_OF_LETTERS);
  });

  it('should move each element of the tab to the left from the given index', () => {
    let stock: LetterStock = new LetterStock();
    let index: number = 4;
    let oldLetter: ScrabbleLetter = stock.letterStock[index]
    stock.resize(index);
    expect(stock.letterStock[index + 1]).toEqual(oldLetter);
  });

  it('should remove the right number of letter in the stock', () => {
    let stock: LetterStock = new LetterStock();
    stock.takeLettersFromStock(2);
    expect(stock.letterStock.length).toEqual(NUMBER_OF_LETTERS - 2);
  });

  it('should add the right number of letter in the stock', () => {
    let stock: LetterStock = new LetterStock();
    stock.addLettersToStock(new ScrabbleLetter('z', 10), 4);
    expect(stock.letterStock.length).toEqual(NUMBER_OF_LETTERS + 4);
  });

  it('should check if the stock is empty or not', () => {
    let stock: LetterStock = new LetterStock();
    expect(stock.isEmpty()).toBeFalse();

    stock.takeLettersFromStock(NUMBER_OF_LETTERS);
    //stock.letterStock = [];
    expect(stock.isEmpty()).toBeTrue();
  });

  it('takeLettersFromStock should stop if there is no more letters', () => {
    let stock: LetterStock = new LetterStock();
    stock.takeLettersFromStock(NUMBER_OF_LETTERS - 2);

    let remainingLetters: ScrabbleLetter[] = stock.takeLettersFromStock(5);

    expect(remainingLetters.length).toEqual(2);
  });
});
