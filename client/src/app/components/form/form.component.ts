import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    myForm: FormGroup;
    name: FormControl;
    timer: FormControl;
    bonus: FormControl;
    level: FormControl;
    opponent: FormControl;
    dictionnary1: FormControl;
    debutantNameList: string[];
    selectedPlayer: string;
    random: number;
    dictionnary: string;
    selected = 'select';
    constructor(private dialog: MatDialogRef<FormComponent>, private router: Router) {
        this.dictionnary = 'Francais(defaut)';
        this.debutantNameList = ['erika', 'etienne', 'sara'];
    }

    ngOnInit() {
        this.createFormControl();
        this.createForm();
    }

    createFormControl() {
        this.level = new FormControl('', [Validators.required]);
        this.name = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]);
        this.timer = new FormControl('', [Validators.required]);
        this.bonus = new FormControl('');
        this.dictionnary1 = new FormControl('', [Validators.required]);
        this.opponent = new FormControl('');
    }

    createForm() {
        this.myForm = new FormGroup({
            name: this.name,
            timer: this.timer,
            bonus: this.bonus,
            dictionnary1: this.dictionnary1,
            level: this.level,
            opponent: this.opponent,
        });
    }

    closeDialog() {
        this.dialog.close();
    }
    randomNumber(minimum: number, maximum: number): number {
        let randomFloat = Math.random() * (maximum - minimum);
        return Math.floor(randomFloat) + minimum;
    }

    randomPlayer(list: string[]): void {
        document.getElementById('opponents')!.style.display = 'block';
        this.random = this.randomNumber(0, list.length);
        this.selectedPlayer = list[this.random];
        this.myForm.controls['opponent'].setValue(this.selectedPlayer);
    }

    changeName(list: string[]): void {
        if (this.name.value == this.selectedPlayer) {
            this.randomPlayer(list);
            this.myForm.controls['opponent'].setValue(this.selectedPlayer);
        }
    }

    submit(): void {
        if (this.myForm.valid) {
            this.closeDialog();
            this.router.navigate(['/game']);
        } else {
            //fait rien
        }
    }
}
