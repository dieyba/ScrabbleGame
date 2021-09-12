export class ScrabbleLetter {
    character : string; //One word string, depending on which letter it is
    value : number; //How many points the letter is worth before blue bonuses
    nextLetters : ScrabbleLetter[]; //Neighbouring letters (0: N, 1: E, 2: S, 3: W) of the letter. WATCH OUT : don't go over four
    tealBonus(): void {
        this.value = 2*this.value; //TODO : Remplacer les x2 et x3 par des constantes "Teal" et "Blue"
    }
    blueBonus(): void{
        this.value = 3*this.value;
    }
}
