import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    myForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(3)]),
        timer: new FormControl('', Validators.required),
        bonus: new FormControl('', Validators.required),
        dictionnary: new FormControl('', Validators.required),
        niveau: new FormControl('', Validators.required),
    });
    debutantNameList: string[];
    expertNameList: string[];
    selectedPlayer: string;
    random: number;
    submitted = false;
    dictionnary: string;
    constructor() {
        this.dictionnary = 'Francais(defaut)';
        this.debutantNameList = ['erika', 'etienne', 'sara'];
        this.expertNameList = ['dieyna', 'kevin', 'arianne'];
    }
    // patternValidator(): ValidatorFn {
    //     return (control: AbstractControl): { [key: string]: any } | null =>
    //         control.value?.toLowerCase() === 'blue' ? null : { wrongColor: control.value };
    //     return (control: AbstractControl): { [key: string]: any } | null => {
    //         if (!control.value) {
    //             return null;
    //         }
    //         const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    //         const valid = regex.test(control.value);
    //         return valid ? null : { invalidPassword: true };
    //     };

    submit(): void {
        this.submitted = true;
        if (this.myForm.controls) {
            alert('votre partie commence');
        } else {
            alert('les parametres sont invalides');
        }
    }
    // differentName(nom: FormControl, list: string[]): ValidatorFn {
    //     for (let i in list) {
    //         if (nom.value == list[i]) {
    //             this.randomPlayer(list);
    //             return { different: true};
    //         }

    //     }

    // name: string;
    // timer: number;
    // bonus: boolean;
    // dictionnary: string;
    // debutantNameList: string[];
    // expertNameList: string[];
    // selectedPlayer: string;
    // random: number;

    // constructor() {
    //     this.name = '';
    //     this.timer = 60;
    //     this.bonus = false;
    //     this.dictionnary = 'Francais(defaut)';
    //     this.debutantNameList = ['erika', 'etienne', 'sara'];
    //     this.expertNameList = ['dieyna', 'kevin', 'arianne'];
    // }

    openForms(): void {
        document.getElementById('form')!.style.display = 'block';
    }

    onSelect(opponent: string): void {
        this.selectedPlayer = opponent;
    }

    /*randomPlayer(list: string[]): void {
        document.getElementById('opponents')!.style.display = 'block';
        let randomFloat = Math.random() * list.length;
        this.random = randomFloat;
        this.selectedPlayer = list[Math.floor(randomFloat)];
    } */

    randomPlayer(list: string[]): void {
        document.getElementById('opponents')!.style.display = 'block';
        this.random = this.randomNumber(0, list.length);
        while (this.myForm.controls['name'].value == list[this.random]) {
            this.random = this.randomNumber(0, list.length);
        }

        this.selectedPlayer = list[this.random];
    }

    randomNumber(minimum: number, maximum: number): number {
        let randomFloat = Math.random() * (maximum - minimum);
        return Math.floor(randomFloat) + minimum;
    }

    closeForms(): void {
        document.getElementById('form')!.style.display = 'none';
        document.getElementById('opponents')!.style.display = 'none';
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
