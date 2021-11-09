// TODO : Integrate other dictionnaries and choices
import * as dict_path from '@app/assets/dictionnary.json';
export enum DictionaryType {
    Default = 'Français',
    English = 'Anglais', // TODO: see if we need to give each type a name instead of number (to display in forms when selecting a dictionary)
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
        const currentDictionary = dict;
        this.title = currentDictionary.title;
        this.description = currentDictionary.description;
        this.words = currentDictionary.words;
    }
}
