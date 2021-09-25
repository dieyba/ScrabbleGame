// TODO : Integrate other dictionnaries and choices
import dict_path from 'src/assets/dictionnary.json';

export enum DictionaryType {
    Default = 0,
    English = 1,
    // Other dictionaries
}

export class Dictionary {
    title: string;
    description: string;
    words: string[];
    constructor(type: DictionaryType) {
        this.selectDictionary(type);
    }

    selectDictionary(type: DictionaryType): void {
        switch (type) {
            case DictionaryType.Default:
                this.initializeDictionary(dict_path as Dictionary);
        }
    }

    initializeDictionary(dict: Dictionary) {
        let currentDictionary = dict_path as Dictionary;
        this.title = currentDictionary.title;
        this.description = currentDictionary.description;
        this.words = currentDictionary.words;
    }
}
