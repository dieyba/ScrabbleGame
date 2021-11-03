import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { expect } from 'chai';
import { LetterStock } from './letter-stock.service';
import sinon = require('sinon');
const VALUE_LETTER_10 = 10;
const OCCURENCE_NUMBER_5 = 5;
export const NUMBER_OF_LETTERS = 102;

describe('LetterStock', () => {
    let service: LetterStock;

    beforeEach(() => {
        service = new LetterStock();
    });

    it('should be created', () => {
        expect(service).to.exist;
    });

    it('should create an instance with 102 letters', () => {
        expect(service.letterStock.length).to.equal(NUMBER_OF_LETTERS);
    });

    it('should call isEmpty when takeLettersFromStock is called', () => {
        const isEmptyStub = sinon.stub(service, 'isEmpty'); // Making stub
        service.takeLettersFromStock(NUMBER_OF_LETTERS);

        isEmptyStub.restore(); // Restore stub to original method
        sinon.assert.called(isEmptyStub);
    });

    it('should remove the right number of letter in the stock', () => {
        service.takeLettersFromStock(2);
        expect(service.letterStock.length).to.equal(NUMBER_OF_LETTERS - 2);
    });

    it('should add the right number of letter in the stock', () => {
        service.addLettersToStock(new ScrabbleLetter('z', VALUE_LETTER_10), OCCURENCE_NUMBER_5);
        expect(service.letterStock.length).to.equal(NUMBER_OF_LETTERS + OCCURENCE_NUMBER_5);
    });

    it('should check if the stock is empty or not', () => {
        expect(service.isEmpty()).to.be.false;

        service.takeLettersFromStock(NUMBER_OF_LETTERS);
        expect(service.isEmpty()).to.be.true;
    });

    it('takeLettersFromStock should stop if there is no more letters', () => {
        service.takeLettersFromStock(NUMBER_OF_LETTERS - 2);

        const remainingLetters: ScrabbleLetter[] = service.takeLettersFromStock(OCCURENCE_NUMBER_5);

        expect(remainingLetters.length).to.equal(2);
    });

    it('should call takeLettersFromStock when exchangeLetters is called', () => {
        const lettersToChange: ScrabbleLetter[] = [new ScrabbleLetter('a', 1), new ScrabbleLetter('j', VALUE_LETTER_10)];

        const takeLettersFromStockStub = sinon.stub(service, 'takeLettersFromStock');
        service.exchangeLetters(lettersToChange);

        takeLettersFromStockStub.restore();
        sinon.assert.called(takeLettersFromStockStub);
    });

    // it('should exchange the given letters with the same number of letters in the letter stock', () => {
    //     service.letterStock = [];
    //     const lettersToExchangeWithStock: ScrabbleLetter[] = [new ScrabbleLetter('a', 1)];
    //     const lettersFromStock: ScrabbleLetter[] = [new ScrabbleLetter('z', VALUE_LETTER_10)];
    //     service.addLettersToStock(lettersFromStock[0], 1);

    //     expect(service.exchangeLetters(lettersToExchangeWithStock)).to.equal(lettersFromStock);
    //     expect(service.letterStock[0]).to.equal(lettersToExchangeWithStock[0]);
    // });
});
