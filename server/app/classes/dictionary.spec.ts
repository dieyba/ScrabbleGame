import { expect } from 'chai';
import * as sinon from 'sinon';
import { Dictionary, DictionaryType } from './dictionary';

describe('Dictionary', () => {
    const dictionary = new Dictionary(DictionaryType.Default);

    it('should create an instance', () => {
        expect(dictionary).to.exist;
    });

    it('selectDictionary should call initializeDictionary', () => {
        const spy = sinon.spy(dictionary, 'initializeDictionary');
        dictionary.selectDictionary(DictionaryType.Default);
        sinon.assert.called(spy);
    });
});
