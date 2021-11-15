// TODO : Integrate other dictionnaries and choices
import * as dict_path from '@app/assets/dictionnary.json';
export enum DictionaryType {
    Default = 0,
    English = 1,
    // Other dictionaries
}
export interface DictionaryInterface {
    idDict: number;
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
