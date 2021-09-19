import { Component } from '@angular/core';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    name: string;
    timer: number;
    bonus: boolean;
    dictionnary: string;
    debutantNameList: string[];
    expertNameList: string[];
    selectedPlayer: string;
    random: number;

    constructor() {
        this.name = '';
        this.timer = 60;
        this.bonus = false;
        this.dictionnary = 'Francais(defaut)';
        this.debutantNameList = ['erika', 'etienne', 'sara'];
        this.expertNameList = ['dieyna', 'kevin', 'arianne'];
    }
    openForms(): void {
        document.getElementById('form')!.style.display = 'block';
    }
    openList(): void {
        document.getElementById('opponents')!.style.display = 'block';
    }
    onSelect(opponent: string): void {
        document.getElementById('opponents')!.style.display = 'block';
        this.selectedPlayer = opponent;
    }
    randomPlayer(list: string[]): void {
        document.getElementById('opponents')!.style.display = 'block';
        let randomFloat = Math.random() * (list.length + 1);
        this.random = randomFloat;
        this.selectedPlayer = list[Math.floor(randomFloat)];
    }

    /**  ANCIENNE VERSION
    constructor() {
        this.error = false;
        this.errorMessage = '';
        this.form = new Player();
    }
    form: Player;
    error: boolean;
    errorMessage: String;

    openForms(): void {
        document.getElementById('form')!.style.display = 'block';
    }
    openList(): void {
        document.getElementById('opponents')!.style.display = 'block';
    }
    confirmName(): void {
        if (this.form.getName().length < 4 || this.form.getName().length > 12) {
            this.form.nameValid = false;
            this.error = true;
            this.errorMessage = 'Ce nom contient des caractères invalides!';
        } else {
        }
    }
    validateName(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.confirmName();
        }
    }*/
}
