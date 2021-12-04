import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import { ValidationService } from './validation.service';
describe('ValidationService service', () => {
    let validationService: ValidationService;
    let dictionary: DictionaryInterface = { _id: new ObjectId(), title: 'title', description: 'description', words: ['cours', 'velo', 'maison', 'local', 'ouvrir'] };
    beforeEach(async () => {

        validationService = new ValidationService();
    });
    it('should create playerManagerService', () => {
        /* eslint-disable @typescript-eslint/no-unused-expressions*/
        /* eslint-disable  no-unused-expressions */
        expect(validationService).to.exist;
    });
    it('ValidateWords should return true', () => {
        const newWords = ['velo', 'maison', 'local', 'ouvrir'];
        expect(validationService.validateWords(newWords, dictionary)).to.equal(true);
    });
    it('ValidateWords should return false', () => {
        const newWords = ['velo', 'maison', 'local', 'sjdg'];
        expect(validationService.validateWords(newWords, dictionary)).to.equal(false);
    });
    it('isWordValid should return true', () => {
        const newWords = 'cours';
        expect(validationService.isWordValid(newWords, dictionary)).to.equal(true);
    });
});
