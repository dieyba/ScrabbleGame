import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';

// TODO : Integrate other dictionnaries and choices
import dict_url from '../../assets/dictionnary.json';

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
                this.currentDictionary = dict_url as Dictionary;
        }
    }
}
