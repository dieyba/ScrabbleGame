import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '@app/components/form/form.component';

@Component({
    selector: 'app-classic-mode',
    templateUrl: './classic-mode.component.html',
    styleUrls: ['./classic-mode.component.scss'],
})
export class ClassicModeComponent {
    constructor(private dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(FormComponent, {});
    }
}
