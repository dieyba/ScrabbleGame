import { Vec2 } from "./vec2";

export interface Command {
    execute(): void;
}


// TODO: put commands in their own file
// create the actual receivers class and implement the function to execute
// add receiver as attritube to its command class
export class PlaceCmd implements Command {
    private posititon: Vec2;
    private word: string;

    constructor(posititon: Vec2, word: string) {
        this.posititon = posititon;
        this.word = word;
    }

    public execute(): void {
        // this.receiver.place(this.posititon, this.word);
        console.log("Position x: " + this.posititon.x);
        console.log("Position y: " + this.posititon.y);
        console.log("Word to place: " + this.word);
    }
}


export class DebugCmd implements Command {
    public execute(): void {
        // this.receiver.debug();
        console.log("changing debug state");
    }
}



export class PassTurnCmd implements Command {
    public execute(): void {
        // this.receiver.passTurn();
        console.log("passing turn");
    }
}


export class SwitchLettersCmd implements Command {
    private letters: string;

    constructor(letters: string) {
        this.letters = letters;
    }

    public execute(): void {
        // this.receiver.switchLetters(letters);
        console.log("letters to switch: " + this.letters);
    }
}