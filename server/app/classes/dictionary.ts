import * as dict_path from '@app/assets/dictionnary.json';
// import { ObjectId } from 'bson';
export enum DictionaryType {
    Default = 'Français',
    English = 'Anglais',
    // Other dictionaries
}
export interface DictionaryInterface {
    // _id: ObjectId;
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
