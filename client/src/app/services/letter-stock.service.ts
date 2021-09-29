import { Injectable } from '@angular/core';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';

const VALUE_LETTER_0 = 0;
const VALUE_LETTER_1 = 1;
const VALUE_LETTER_2 = 2;
const VALUE_LETTER_3 = 3;
const VALUE_LETTER_4 = 4;
const VALUE_LETTER_8 = 8;
const VALUE_LETTER_10 = 10;

const OCCURENCE_NUMBER_1 = 1;
const OCCURENCE_NUMBER_2 = 2;
const OCCURENCE_NUMBER_3 = 3;
const OCCURENCE_NUMBER_5 = 5;
const OCCURENCE_NUMBER_6 = 6;
const OCCURENCE_NUMBER_8 = 8;
const OCCURENCE_NUMBER_9 = 9;
const OCCURENCE_NUMBER_15 = 15;

@Injectable({
  providedIn: 'root',
})
export class LetterStock {
  letterStock: ScrabbleLetter[];

  constructor() {
    this.letterStock = [];
    this.addLettersToStock(new ScrabbleLetter('a', VALUE_LETTER_1), OCCURENCE_NUMBER_9); // A
    this.addLettersToStock(new ScrabbleLetter('b', VALUE_LETTER_3), OCCURENCE_NUMBER_2); // B
    this.addLettersToStock(new ScrabbleLetter('c', VALUE_LETTER_3), OCCURENCE_NUMBER_2); // C
    this.addLettersToStock(new ScrabbleLetter('d', VALUE_LETTER_2), OCCURENCE_NUMBER_3); // D
    this.addLettersToStock(new ScrabbleLetter('e', VALUE_LETTER_1), OCCURENCE_NUMBER_15); // E
    this.addLettersToStock(new ScrabbleLetter('f', VALUE_LETTER_4), OCCURENCE_NUMBER_2); // F
    this.addLettersToStock(new ScrabbleLetter('g', VALUE_LETTER_2), OCCURENCE_NUMBER_2); // G
    this.addLettersToStock(new ScrabbleLetter('h', VALUE_LETTER_4), OCCURENCE_NUMBER_2); // H
    this.addLettersToStock(new ScrabbleLetter('i', VALUE_LETTER_1), OCCURENCE_NUMBER_8); // I
    this.addLettersToStock(new ScrabbleLetter('j', VALUE_LETTER_8), OCCURENCE_NUMBER_1); // J
    this.addLettersToStock(new ScrabbleLetter('k', VALUE_LETTER_10), OCCURENCE_NUMBER_1); // K
    this.addLettersToStock(new ScrabbleLetter('l', VALUE_LETTER_1), OCCURENCE_NUMBER_5); // L
    this.addLettersToStock(new ScrabbleLetter('m', VALUE_LETTER_2), OCCURENCE_NUMBER_3); // M
    this.addLettersToStock(new ScrabbleLetter('n', VALUE_LETTER_1), OCCURENCE_NUMBER_6); // N
    this.addLettersToStock(new ScrabbleLetter('o', VALUE_LETTER_1), OCCURENCE_NUMBER_6); // O
    this.addLettersToStock(new ScrabbleLetter('p', VALUE_LETTER_3), OCCURENCE_NUMBER_2); // P
    this.addLettersToStock(new ScrabbleLetter('q', VALUE_LETTER_8), OCCURENCE_NUMBER_1); // Q
    this.addLettersToStock(new ScrabbleLetter('r', VALUE_LETTER_1), OCCURENCE_NUMBER_6); // R
    this.addLettersToStock(new ScrabbleLetter('s', VALUE_LETTER_1), OCCURENCE_NUMBER_6); // S
    this.addLettersToStock(new ScrabbleLetter('t', VALUE_LETTER_1), OCCURENCE_NUMBER_6); // T
    this.addLettersToStock(new ScrabbleLetter('u', VALUE_LETTER_1), OCCURENCE_NUMBER_6); // U
    this.addLettersToStock(new ScrabbleLetter('v', VALUE_LETTER_4), OCCURENCE_NUMBER_2); // V
    this.addLettersToStock(new ScrabbleLetter('w', VALUE_LETTER_10), OCCURENCE_NUMBER_1); // W
    this.addLettersToStock(new ScrabbleLetter('x', VALUE_LETTER_10), OCCURENCE_NUMBER_1); // X
    this.addLettersToStock(new ScrabbleLetter('y', VALUE_LETTER_10), OCCURENCE_NUMBER_1); // Y
    this.addLettersToStock(new ScrabbleLetter('z', VALUE_LETTER_10), OCCURENCE_NUMBER_1); // Z
    this.addLettersToStock(new ScrabbleLetter('*', VALUE_LETTER_0), OCCURENCE_NUMBER_2); // *
  }

  isEmpty(): boolean {
    return this.letterStock.length == 0;
  }

  addLettersToStock(letter: ScrabbleLetter, number: number): void {
    for (let i = 0; i < number; i++) {
      this.letterStock.push(letter);
    }
  }

  takeLettersFromStock(number: number): ScrabbleLetter[] {
    let lettersRemovedFromStock: ScrabbleLetter[] = [];
    if (this.isEmpty()) {
      // Si la réserve est vide, qu'est ce qu'on fait ?
      window.alert("Il n'y a plus assez de lettre dans la réserve.");
    } else {
      for (let i = 0; i < number; i++) {
        const index = Math.floor(Math.random() * (this.letterStock.length - 1));
        lettersRemovedFromStock[i] = this.letterStock.splice(index, 1)[0];
      }
    }
    return lettersRemovedFromStock;
  }

  exchangeLetters(playerLetters: ScrabbleLetter[]): ScrabbleLetter[] {
    let randomLetters = this.takeLettersFromStock(playerLetters.length);
    for (let i = 0; i < playerLetters.length; i++) {
      this.letterStock.push(playerLetters[i]);
    }

    return randomLetters;
  }
}
