import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-starting-page',
    templateUrl: './starting-page.component.html',
    styleUrls: ['./starting-page.component.scss'],
})
export class StartingPageComponent {
    constructor(private router: Router) {}

    openPage(isLog2990: boolean) {
        if (isLog2990) {
            this.router.navigate(['/game-mode', { isLog2990: true }])
        } else {
            this.router.navigate(['/game-mode', { isLog2990: false }])
        }
    }
}
