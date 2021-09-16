import { Component } from '@angular/core';
import { FormComponent } from '@app/components/form/form.component';

@Component({
    selector: 'app-classic-mode',
    templateUrl: './classic-mode.component.html',
    styleUrls: ['./classic-mode.component.scss'],
})
export class ClassicModeComponent {
    constructor() {}
    form: FormComponent = new FormComponent();
}
