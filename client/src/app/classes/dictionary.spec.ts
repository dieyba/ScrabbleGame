import { Dictionary, DictionaryType } from './dictionary';

describe('Dictionary', () => {
    const dictionary = new Dictionary(DictionaryType.Default);

    it('should create an instance', () => {
        expect(dictionary).toBeTruthy();
    });

    it('selectDictionary should call initializeDictionary', () => {
        const spy = spyOn(dictionary, 'initializeDictionary');
        dictionary.selectDictionary(DictionaryType.Default);

        expect(spy).toHaveBeenCalled();
    });
});
