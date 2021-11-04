import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameListService } from '@app/services/game-list.service';

@Component({
  selector: 'app-end-game-popup',
  templateUrl: './end-game-popup.component.html',
  styleUrls: ['./end-game-popup.component.scss']
})
export class EndGamePopupComponent {
  // private readonly server = 'http://' + window.location.hostname + ':3000';
  // private socket: io.Socket;
  constructor(@Optional() public dialogReference: MatDialogRef<unknown>, private gameList: GameListService) {}
  disconnect() {
    this.gameList.disconnectUser();
  }
}
