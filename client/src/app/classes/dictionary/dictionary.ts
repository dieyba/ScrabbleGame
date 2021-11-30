import dict_path from 'src/assets/dictionnary.json';

export enum DictionaryType {
    Default = 'Français',
    English = 'Anglais',
    // Other dictionaries
}

export interface DictionaryInterface {
    title: string;
    description: string;
    words: string[];
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
        const currentDictionary = dict;
        this.title = currentDictionary.title;
        this.description = currentDictionary.description;
        this.words = currentDictionary.words;
    }
}
