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
        let jsonObj: any = JSON.parse(dict); // string to generic object first
        let dictionary: Dictionary = <Dictionary>jsonObj; // generic object to interface
        return dictionary;
    }
}
