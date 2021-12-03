import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import dict_path from 'src/assets/dictionnary.json';
import { Trie } from './trie';

describe('Trie', () => {
    it('should create an instance', () => {
        expect(new Trie(dict_path as DictionaryInterface)).toBeTruthy();
    });
});
