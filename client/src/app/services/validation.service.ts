import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { ScrabbleWord } from '@app/classes/scrabble-word';

// TODO : Integrate other dictionnaries and choices
let dict = './assets/dictionnary.json';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    parseDictionary(): void {
        let jsonObj: any = JSON.parse(dict); // string to generic object first
        let dictionary: Dictionary = <Dictionary>jsonObj; // generic object to interface
        console.log(dictionary);
    }

    // TODO
    /*
    Bleu pâle : LETTRE x2
    Bleu foncé : LETTRE x3
    Rose : MOT x2
    Rouge : MOT x3
    
    1. Vérifier que mot est dans dictionnaire
    2. Identifier points lettre par lettre
	3. If case bleue, multiplier points lettre
	4. Additionner points des lettres
	5. If case rose, multiplier point mot
    6. If 7 lettres utilisées, bonus 50 pts*/
}
