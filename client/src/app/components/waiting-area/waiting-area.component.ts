import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters } from '@app/classes/game-parameters';
import { GameListService } from '@app/services/game-list.service';
import { FormComponent } from '../form/form.component';

@Component({
    selector: 'app-waiting-area',
    templateUrl: './waiting-area.component.html',
    styleUrls: ['./waiting-area.component.scss'],
    providers: [GameListService],
})
export class WaitingAreaComponent {
    private playerList: string[];
    isStarting: boolean;
    private timer: any;
    list: GameParameters[] = [];
    constructor(
        private router: Router,
        private dialogRef: MatDialogRef<WaitingAreaComponent>,
        private dialog: MatDialog,
        private gameList: GameListService,
    ) {
        this.gameList = gameList;
        this.timer = setInterval(() => {
            let roomInfo = this.gameList;
            this.playerList = roomInfo.roomInfo.playersName;
            this.start();
        }, 1000);
    }
    ngOnInit() {
        this.getList();
    }

    getList(): void {
        this.gameList.getList().subscribe((game) => (this.list = game));
        console.log(this.list + 'est afficher');
        console.log(document.URL);
    }

    public start(): void {
        if (this.playerList.length === 2) {
            this.isStarting = true;
            clearInterval(this.timer);

            setTimeout(() => {
                this.dialogRef.close();
                this.router.navigate(['/game']);
            }, 500);
        }
    }
    openForm() {
        this.dialog.open(FormComponent, {});
    }
    convert(isSolo: boolean) {
        this.closeDialog();
        this.dialog.open(FormComponent, { data: isSolo });
    }
    closeDialog() {
        this.dialogRef.close();
    }
}
