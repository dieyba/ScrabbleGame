
import { expect } from 'chai';
import { ValidationService } from './validation.service';
;

describe('ValidationService service', () => {
    let validationService: ValidationService;
    beforeEach(async () => {
        validationService = new ValidationService();
    });
    it('should create playerManagerService', () => {
        expect(validationService).to.exist;
    });
    it('ValidateWords should return true', () => {
        let newWords = ['velo', 'maison', 'local', 'ouvrir']
        expect(validationService.validateWords(newWords)).to.equal(true)
    });
    it('ValidateWords should return false', () => {
        let newWords = ['velo', 'maison', 'local', 'sjdg']
        expect(validationService.validateWords(newWords)).to.equal(false)
    });
    it('isWordValid should return true', () => {
        let newWords = 'cours';
        expect(validationService.isWordValid(newWords)).to.equal(true)
    });

});