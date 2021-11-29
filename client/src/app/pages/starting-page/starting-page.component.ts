import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BestScoresComponent } from '@app/components/best-scores/best-scores.component';

@Component({
    selector: 'app-starting-page',
    templateUrl: './starting-page.component.html',
    styleUrls: ['./starting-page.component.scss'],
})
export class StartingPageComponent {
    constructor(private dialog: MatDialog, private router: Router) {}

    openDialog(): void {
        this.dialog.open(BestScoresComponent, {
            // height: '150%',
            // width: '90%',
        });
    }

    openPage(isLog2990: boolean) {
        if (isLog2990) {
            this.router.navigate(['/game-mode', { isLog2990: true }]);
        } else {
            this.router.navigate(['/game-mode', { isLog2990: false }]);
        }
    }
}
