import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameParameters } from '@app/classes/game-parameters';
import { FormComponent } from '@app/components/form/form.component';
import { GameListService } from '@app/services/game-list.service';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
@Component({
    selector: 'app-waiting-area',
    templateUrl: './waiting-area.component.html',
    styleUrls: ['./waiting-area.component.scss'],
    providers: [GameListService],
})
export class WaitingAreaComponent implements OnInit {
    isStarting: boolean;
    list: GameParameters[] = [];
    private playerList: string[];
    private timer: any;
    constructor(
        private router: Router,
        private dialogRef: MatDialogRef<WaitingAreaComponent>,
        private dialog: MatDialog,
        private gameList: GameListService,
    ) {
        this.gameList = gameList;
        this.timer = setInterval(() => {
            const roomInfo = this.gameList;
            this.playerList = roomInfo.roomInfo.playersName;
            this.start();
        }, 1000);
    }
    ngOnInit() {
        this.getList();
    }

    getList(): void {
        this.gameList.getList().subscribe((game) => (this.list = game));
    }

    start(): void {
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
