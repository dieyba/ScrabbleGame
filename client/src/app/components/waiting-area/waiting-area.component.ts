import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GameListService } from '@app/services/game-list.service';
import { FormComponent } from '../form/form.component';

@Component({
    selector: 'app-waiting-area',
    templateUrl: './waiting-area.component.html',
    styleUrls: ['./waiting-area.component.scss'],
    providers: [GameListService],
})
export class WaitingAreaComponent {
    game = this.gameList.getList();
    form: FormComponent;
    // console.log(this.gameList.getList() + ' waiting');
    // game: GameListService;
    constructor(private dialogRef: MatDialogRef<WaitingAreaComponent>, private gameList: GameListService, private dialog: MatDialog) {
        // this.game = gameList;
    }
    openForm() {
        this.dialog.open(FormComponent, {});
    }
    closeDialog() {
        // this.form.closeDialog();
        this.dialogRef.close();
    }
    // ngOnInit(): void {}
}
