import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';

// TODO : Integrate other dictionnaries and choices
const dictionary = './assets/dictionnary.json';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    currentDictionary: Dictionary;

    constructor() {
        this.initializeDictionaries('normal');
    }

    initializeDictionaries(name: string): void {
        switch (name) {
            case 'normal':
                this.currentDictionary = this.parseDictionary(dictionary);
        }
    }

    parseDictionary(dict: string): Dictionary {
        const jsonObj: unknown = JSON.parse(dict); // string to generic object first
        const dictionaryParsed: Dictionary = jsonObj as Dictionary; // generic object to interface
        return dictionaryParsed;
    }
}
