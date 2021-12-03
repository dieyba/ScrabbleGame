import { ScrabbleLetter } from '@app/classes/scrabble-letter';

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
    Star = 40,
}

export class LetterStock {
    letterStock: ScrabbleLetter[];

    constructor() {
        this.letterStock = [];
        this.addLettersToStock('a', LetterQuantity.A); // A
        this.addLettersToStock('b', LetterQuantity.B); // B
        this.addLettersToStock('c', LetterQuantity.C); // C
        this.addLettersToStock('d', LetterQuantity.D); // D
        this.addLettersToStock('e', LetterQuantity.E); // E
        this.addLettersToStock('f', LetterQuantity.F); // F
        this.addLettersToStock('g', LetterQuantity.G); // G
        this.addLettersToStock('h', LetterQuantity.H); // H
        this.addLettersToStock('i', LetterQuantity.I); // I
        this.addLettersToStock('j', LetterQuantity.J); // J
        this.addLettersToStock('k', LetterQuantity.K); // K
        this.addLettersToStock('l', LetterQuantity.L); // L
        this.addLettersToStock('m', LetterQuantity.M); // M
        this.addLettersToStock('n', LetterQuantity.N); // N
        this.addLettersToStock('o', LetterQuantity.O); // O
        this.addLettersToStock('p', LetterQuantity.P); // P
        this.addLettersToStock('q', LetterQuantity.Q); // Q
        this.addLettersToStock('r', LetterQuantity.R); // R
        this.addLettersToStock('s', LetterQuantity.S); // S
        this.addLettersToStock('t', LetterQuantity.T); // T
        this.addLettersToStock('u', LetterQuantity.U); // U
        this.addLettersToStock('v', LetterQuantity.V); // V
        this.addLettersToStock('w', LetterQuantity.W); // W
        this.addLettersToStock('x', LetterQuantity.X); // X
        this.addLettersToStock('y', LetterQuantity.Y); // Y
        this.addLettersToStock('z', LetterQuantity.Z); // Z
        this.addLettersToStock('*', LetterQuantity.Star); // *
    }

    isEmpty(): boolean {
        return this.letterStock.length === 0;
    }

    addLettersToStock(letterChar: string, number: number): void {
        for (let i = 0; i < number; i++) {
            this.letterStock.push(new ScrabbleLetter(letterChar));
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
}
