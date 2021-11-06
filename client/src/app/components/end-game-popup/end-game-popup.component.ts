import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-end-game-popup',
  templateUrl: './end-game-popup.component.html',
  styleUrls: ['./end-game-popup.component.scss']
})
export class EndGamePopupComponent {
  constructor(@Optional() public dialogReference: MatDialogRef<unknown>) {}
}
