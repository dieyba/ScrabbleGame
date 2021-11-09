import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Service } from 'typedi';

enum LetterQuantity {
    A = 9,
    B = 2,
    C = 2,
    D = 3,
    E = 15,
    F = 2,
    G = 2,
    H = 2,
    I = 8,
    J = 1,
    K = 1,
    L = 5,
    M = 3,
    N = 6,
    O = 6,
    P = 2,
    Q = 1,
    R = 6,
    S = 6,
    T = 6,
    U = 6,
    V = 2,
    W = 1,
    X = 1,
    Y = 1,
    Z = 1,
    Star = 2,
}

export enum LetterValue {
    A = 1,
    B = 3,
    C = 3,
    D = 2,
    E = 1,
    F = 4,
    G = 2,
    H = 4,
    I = 1,
    J = 8,
    K = 10,
    L = 1,
    M = 2,
    N = 1,
    O = 1,
    P = 3,
    Q = 8,
    R = 1,
    S = 1,
    T = 1,
    U = 1,
    V = 4,
    W = 10,
    X = 10,
    Y = 10,
    Z = 10,
    Star = 0,
}

@Service()
export class LetterStock {
    letterStock: ScrabbleLetter[];

    constructor() {
        this.letterStock = [];
        // TODO: scrabble letter already has a function to give the default letter value. so we dont need to specify it
        this.addLettersToStock(new ScrabbleLetter('a', LetterValue.A), LetterQuantity.A); // A
        this.addLettersToStock(new ScrabbleLetter('b', LetterValue.B), LetterQuantity.B); // B
        this.addLettersToStock(new ScrabbleLetter('c', LetterValue.C), LetterQuantity.C); // C
        this.addLettersToStock(new ScrabbleLetter('d', LetterValue.D), LetterQuantity.D); // D
        this.addLettersToStock(new ScrabbleLetter('e', LetterValue.E), LetterQuantity.E); // E
        this.addLettersToStock(new ScrabbleLetter('f', LetterValue.F), LetterQuantity.F); // F
        this.addLettersToStock(new ScrabbleLetter('g', LetterValue.G), LetterQuantity.G); // G
        this.addLettersToStock(new ScrabbleLetter('h', LetterValue.H), LetterQuantity.H); // H
        this.addLettersToStock(new ScrabbleLetter('i', LetterValue.I), LetterQuantity.I); // I
        this.addLettersToStock(new ScrabbleLetter('j', LetterValue.J), LetterQuantity.J); // J
        this.addLettersToStock(new ScrabbleLetter('k', LetterValue.K), LetterQuantity.K); // K
        this.addLettersToStock(new ScrabbleLetter('l', LetterValue.L), LetterQuantity.L); // L
        this.addLettersToStock(new ScrabbleLetter('m', LetterValue.M), LetterQuantity.M); // M
        this.addLettersToStock(new ScrabbleLetter('n', LetterValue.N), LetterQuantity.N); // N
        this.addLettersToStock(new ScrabbleLetter('o', LetterValue.O), LetterQuantity.O); // O
        this.addLettersToStock(new ScrabbleLetter('p', LetterValue.P), LetterQuantity.P); // P
        this.addLettersToStock(new ScrabbleLetter('q', LetterValue.Q), LetterQuantity.Q); // Q
        this.addLettersToStock(new ScrabbleLetter('r', LetterValue.R), LetterQuantity.R); // R
        this.addLettersToStock(new ScrabbleLetter('s', LetterValue.S), LetterQuantity.S); // S
        this.addLettersToStock(new ScrabbleLetter('t', LetterValue.T), LetterQuantity.T); // T
        this.addLettersToStock(new ScrabbleLetter('u', LetterValue.U), LetterQuantity.U); // U
        this.addLettersToStock(new ScrabbleLetter('v', LetterValue.V), LetterQuantity.V); // V
        this.addLettersToStock(new ScrabbleLetter('w', LetterValue.W), LetterQuantity.W); // W
        this.addLettersToStock(new ScrabbleLetter('x', LetterValue.X), LetterQuantity.X); // X
        this.addLettersToStock(new ScrabbleLetter('y', LetterValue.Y), LetterQuantity.Y); // Y
        this.addLettersToStock(new ScrabbleLetter('z', LetterValue.Z), LetterQuantity.Z); // Z
        this.addLettersToStock(new ScrabbleLetter('*', LetterValue.Star), LetterQuantity.Star); // *
    }

    takeLetter(letter: string): ScrabbleLetter {
        for (let i = 0; i < this.letterStock.length; i++) {
            if (this.letterStock[i].character === letter) {
                this.letterStock.splice(i, 1);
                return this.letterStock[i];
            }
        }
        return new ScrabbleLetter('');
    }

    isEmpty(): boolean {
        return this.letterStock.length === 0;
    }

    addLettersToStock(letter: ScrabbleLetter, number: number): void {
        for (let i = 0; i < number; i++) {
            this.letterStock.push(letter);
        }
    }

    takeLettersFromStock(number: number): ScrabbleLetter[] {
        const lettersRemovedFromStock: ScrabbleLetter[] = [];
        for (let i = 0; i < number; i++) {
            if (this.isEmpty()) {
                break;
            } else {
                const index = Math.floor(Math.random() * (this.letterStock.length - 1));
                lettersRemovedFromStock[i] = this.letterStock.splice(index, 1)[0];
            }
        }
        return lettersRemovedFromStock;
    }

    exchangeLetters(playerLetters: ScrabbleLetter[]): ScrabbleLetter[] {
        const randomLetters = this.takeLettersFromStock(playerLetters.length);

        for (const letters of playerLetters) {
            this.letterStock.push(letters);
        }

        return randomLetters;
    }
}
