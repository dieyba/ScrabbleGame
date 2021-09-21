import { ScrabbleLetter } from './scrabble-letter';

export class LetterStock {

    getInstance(): LetterStock {
        if (this.instance == null) {
            this.instance = new LetterStock()
        }
        return this.instance;
    }

    private constructor() {
        this.letterStock = [];
        this.addLettersToStock(new ScrabbleLetter(), 9); // A
        this.addLettersToStock(new ScrabbleLetter(), 2); // B
        this.addLettersToStock(new ScrabbleLetter(), 2); // C
        this.addLettersToStock(new ScrabbleLetter(), 3); // D
        this.addLettersToStock(new ScrabbleLetter(), 15);// E
        this.addLettersToStock(new ScrabbleLetter(), 2); // F
        this.addLettersToStock(new ScrabbleLetter(), 2); // G
        this.addLettersToStock(new ScrabbleLetter(), 2); // H
        this.addLettersToStock(new ScrabbleLetter(), 8); // I
        this.addLettersToStock(new ScrabbleLetter(), 1); // J
        this.addLettersToStock(new ScrabbleLetter(), 1); // K
        this.addLettersToStock(new ScrabbleLetter(), 5); // L
        this.addLettersToStock(new ScrabbleLetter(), 3); // M
        this.addLettersToStock(new ScrabbleLetter(), 6); // N
        this.addLettersToStock(new ScrabbleLetter(), 6); // O
        this.addLettersToStock(new ScrabbleLetter(), 2); // P
        this.addLettersToStock(new ScrabbleLetter(), 1); // Q
        this.addLettersToStock(new ScrabbleLetter(), 6); // R
        this.addLettersToStock(new ScrabbleLetter(), 6); // S
        this.addLettersToStock(new ScrabbleLetter(), 6); // T
        this.addLettersToStock(new ScrabbleLetter(), 6); // U
        this.addLettersToStock(new ScrabbleLetter(), 2); // V
        this.addLettersToStock(new ScrabbleLetter(), 1); // W
        this.addLettersToStock(new ScrabbleLetter(), 1); // X
        this.addLettersToStock(new ScrabbleLetter(), 1); // Y
        this.addLettersToStock(new ScrabbleLetter(), 1); // Z
        this.addLettersToStock(new ScrabbleLetter(), 2); // *
    };

    private letterStock: ScrabbleLetter[];
    private sizeStock: number = 0;
    private instance: LetterStock;

    addLettersToStock(letter: ScrabbleLetter, number: number): void{
        for (let i:number = 0; i < number; i++) {
            this.letterStock.push(letter);
            this.sizeStock++;
        }
    }

    takeLettersFromStcok(number: number): ScrabbleLetter[] {
        let lettersRemovedFromStock: ScrabbleLetter[] = [];

        for (let i: number = 0; i < number; i++) {
            // Si la réserve est vide, qu'est ce qu'on fait ?
            if (this.isEmpty()) {
                window.alert("Il n'y a plus de lettre dans la réserve.")
            }
            else {
                let index = this.randomNumber(0, this.sizeStock);
                lettersRemovedFromStock[i] = this.letterStock[index];
                this.resize(i);
                this.sizeStock--;
            }
        }

        return lettersRemovedFromStock;
    }

    resize(index: number): void {
        for (let i: number = 0; i < this.sizeStock; i++) {
            this.letterStock[index] = this.letterStock[index + 1];
        }
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
