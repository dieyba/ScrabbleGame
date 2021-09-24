import { ScrabbleLetter } from './scrabble-letter';

export class LetterStock {

    // getInstance(): LetterStock {
    //     if (this.instance == null) {
    //         this.instance = new LetterStock()
    //     }
    //     return this.instance;
    // }

    constructor() {
        this.letterStock = [];
        this.addLettersToStock(new ScrabbleLetter('a', 1), 9); // A
        this.addLettersToStock(new ScrabbleLetter('b', 3), 2); // B
        this.addLettersToStock(new ScrabbleLetter('c', 3), 2); // C
        this.addLettersToStock(new ScrabbleLetter('d', 2), 3); // D
        this.addLettersToStock(new ScrabbleLetter('e', 1), 15);// E
        this.addLettersToStock(new ScrabbleLetter('f',4), 2); // F
        this.addLettersToStock(new ScrabbleLetter('g',2), 2); // G
        this.addLettersToStock(new ScrabbleLetter('h', 4), 2); // H
        this.addLettersToStock(new ScrabbleLetter('i', 1), 8); // I
        this.addLettersToStock(new ScrabbleLetter('j', 8), 1); // J
        this.addLettersToStock(new ScrabbleLetter('k', 10), 1); // K
        this.addLettersToStock(new ScrabbleLetter('l', 1), 5); // L
        this.addLettersToStock(new ScrabbleLetter('m', 2), 3); // M
        this.addLettersToStock(new ScrabbleLetter('n', 1), 6); // N
        this.addLettersToStock(new ScrabbleLetter('o', 1), 6); // O
        this.addLettersToStock(new ScrabbleLetter('p', 3), 2); // P
        this.addLettersToStock(new ScrabbleLetter('q', 8), 1); // Q
        this.addLettersToStock(new ScrabbleLetter('r', 1), 6); // R
        this.addLettersToStock(new ScrabbleLetter('s', 1), 6); // S
        this.addLettersToStock(new ScrabbleLetter('t', 1), 6); // T
        this.addLettersToStock(new ScrabbleLetter('u', 1), 6); // U
        this.addLettersToStock(new ScrabbleLetter('v', 4), 2); // V
        this.addLettersToStock(new ScrabbleLetter('w', 10), 1); // W
        this.addLettersToStock(new ScrabbleLetter('x', 10), 1); // X
        this.addLettersToStock(new ScrabbleLetter('y', 10), 1); // Y
        this.addLettersToStock(new ScrabbleLetter('z', 10), 1); // Z
        this.addLettersToStock(new ScrabbleLetter('*', 0), 2); // *
    };

    letterStock: ScrabbleLetter[];
    sizeStock: number = 0;
    //private instance: LetterStock;

    addLettersToStock(letter: ScrabbleLetter, number: number): void{
        for (let i:number = 0; i < number; i++) {
            this.letterStock.push(letter);
            this.sizeStock++;
        }
    }

    takeLettersFromStock(number: number): ScrabbleLetter[] {
        let lettersRemovedFromStock: ScrabbleLetter[] = [];

        for (let i: number = 0; i < number; i++) {
            // Si la réserve est vide, qu'est ce qu'on fait ?
            if (this.isEmpty()) {
                window.alert("Il n'y a plus de lettre dans la réserve.")
                break;
            }
            else {
                let index = this.randomNumber(0, this.sizeStock);
                lettersRemovedFromStock[i] = this.letterStock[index];
                this.resize(i);
            }
        }

        return lettersRemovedFromStock;
    }

    resize(index: number): void {
        for (let i: number = 0; i < this.sizeStock; i++) {
            this.letterStock[index] = this.letterStock[index + 1];
        }
        this.letterStock.pop();
        this.sizeStock--;
    }

    // duplication de code, cette fonction existe dans forms.ts
    randomNumber(minimum: number, maximum: number): number {
        let randomFloat = Math.random() * (maximum - minimum);
        return Math.floor(randomFloat) + minimum;
    }

    isEmpty(): boolean {
        return this.sizeStock == 0;
    }
}
