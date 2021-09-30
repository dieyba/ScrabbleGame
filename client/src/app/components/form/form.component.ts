import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SoloGameService } from '@app/services/solo-game.service';

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
    dictionaryForm: FormControl;
    debutantNameList: string[];
    selectedPlayer: string;
    random: number;
    dictionary: string;
    defaultTimer = '60';
    defaultDictionary = '0';

    constructor(private dialog: MatDialogRef<FormComponent>, private router: Router, private soloGameService: SoloGameService) {
        this.dictionary = 'Français';
        this.debutantNameList = ['Érika', 'Étienne', 'Sara'];
    }

    ngOnInit() {
        this.createFormControl();
        this.createForm();
    }

    createFormControl() {
        this.level = new FormControl('', [Validators.required]);
        this.name = new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZÉé]*')]);
        this.timer = new FormControl('', [Validators.required]);
        this.bonus = new FormControl('');
        this.dictionaryForm = new FormControl('', [Validators.required]);
        this.opponent = new FormControl('');
    }

    createForm() {
        this.myForm = new FormGroup({
            name: this.name,
            timer: this.timer,
            bonus: this.bonus,
            dictionaryForm: this.dictionaryForm,
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
        document.getElementById('opponents')!.style.visibility = 'visible';
        this.random = this.randomNumber(0, list.length);
        do {
            this.random = this.randomNumber(0, list.length);
            this.selectedPlayer = list[this.random];
        } while (this.name.value === this.selectedPlayer);

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
            this.soloGameService.initializeGame(this.myForm);
        } else {
            //fait rien
        }
    }
}
