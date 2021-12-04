import { DictionaryInterface } from './dictionary';

describe('Dictionary', () => {
    const dictionaryInterface: DictionaryInterface = {
        _id: 123456, // False ID
        title: 'Dictionary title',
        description: 'Dictionary description',
        words: ['word1', 'word2'],
    };

    it('should create an instance', () => {
        expect(dictionaryInterface).toBeTruthy();
    });
});
