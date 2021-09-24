import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    @Input() myForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
        timer: new FormControl(''),
        bonus: new FormControl('60'),
        dictionnary: new FormControl(''),
    });
    @Output() nameChange = new EventEmitter<string>();
    niveau: string[];
    debutantNameList: string[];
    expertNameList: string[];
    selectedPlayer: string;
    selectedNiveau: string;
    random: number;
    submitted = false;
    dictionnary: string;
    selected = 'select';
    constructor(private dialog: MatDialogRef<FormComponent>, private router: Router) {
        this.niveau = ['Joeur Débutant', ' Joueur Expert'];
        this.dictionnary = 'Francais(defaut)';
        this.debutantNameList = ['erika', 'etienne', 'sara'];
        this.expertNameList = ['dieyna', 'kevin', 'arianne'];
    }
    // getErrorMessage() {
    //     if (this.myForm.controls['name'].value.hasError('pattern')) {
    //         return 'You cant enter a number';
    //     }

    //     return this.myForm.controls['name'].value.hasError('name') ? 'Not a valid name' : '';
    // }
    closeDialog() {
        this.dialog.close();
    }

    submit(): void {
        this.submitted = true;
        if (this.myForm.valid) {
            alert('votre partie commence');
            this.closeDialog();
            this.router.navigate(['/game']);
            console.log('pourquoiiiiiiiii');
        } else {
            alert('les parametres sont invalides');
        }
    }

    onSelect(opponent: string): void {
        this.selectedPlayer = opponent;
        this.selectedNiveau = opponent;
    }
    isActive(difficulty: string) {
        return this.selectedNiveau === difficulty;
    }

    randomPlayer(list: string[]): void {
        document.getElementById('opponents')!.style.display = 'block';
        this.random = this.randomNumber(0, list.length);
        while (this.myForm.controls['name'].value == list[this.random]) {
            this.random = this.randomNumber(0, list.length);
            this.nameChange.emit(list[this.random]);
        }

        this.selectedPlayer = list[this.random];
    }

    randomNumber(minimum: number, maximum: number): number {
        let randomFloat = Math.random() * (maximum - minimum);
        return Math.floor(randomFloat) + minimum;
    }
}
