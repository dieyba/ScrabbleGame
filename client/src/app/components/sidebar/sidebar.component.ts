import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LocalPlayer } from '@app/classes/local-player';
import { SocketHandler } from '@app/modules/socket-handler';
import { GameListService } from '@app/services/game-list.service';
import { GameService } from '@app/services/game.service';
import * as io from 'socket.io-client';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
    player1Name: string;
    player2Name: string;
    winnerName: string;
    isSolo: boolean;
    private readonly server = 'http://' + window.location.hostname + ':3000';
    private socket: io.Socket;
    players: Array<LocalPlayer>;
    constructor(private gameService: GameService, private gameList: GameListService) {
        this.player1Name = this.gameList.roomInfo.gameRoom.playersName[0];
        this.player2Name = this.gameList.roomInfo.gameRoom.playersName[1];
        this.winnerName = '';
        this.players = new Array<LocalPlayer>();
        this.socket = SocketHandler.requestSocket(this.server);
        this.socket.on('updateInfo', (players: Array<LocalPlayer>) => {
            console.log(players);
            this.players = players;
        });
    }
    ngOnInit() {
        // this.socket = SocketHandler.requestSocket(this.server);
        // this.socket.on('updateInfo', (players: Array<LocalPlayer>) => {
        //     this.players = players;
        // });
    }
    ngAfterViewInit() {}

    // getLettersLeftCount(): number {
    //     return this.gameService.currentGameService.game.stock.letterStock.length;
    // }

    // getPlayer1LetterCount(): number {
    //     return this.gameService.currentGameService.game.creatorPlayer.letters.length;
    // }

    // getPlayer2LetterCount(): number {
    //     return this.gameService.currentGameService.game.opponentPlayer.letters.length;
    // }

    getPlayer1Score(): number {
        return this.gameList.roomInfo.creatorPlayer.score;
    }

    // getPlayer2Score(): number {
    //     return this.players[1].score;
    // }

    // getTimer(): string {
    //     return this.gameService.currentGameService.game.totalCountDown.toString();
    // }

    isPlayer1Active(): boolean {
        console.log(this.players);
        return this.gameList.roomInfo.creatorPlayer.isActive;
    }

    // isPlayer2Active(): boolean {
    //     return this.players[1].isActive;
    // }

    isEndGame(): boolean {
        this.getWinnerName();
        return this.gameService.currentGameService.game.isEndGame;
    }

    hasWinner(): boolean {
        return this.gameService.currentGameService.game.creatorPlayer.isWinner || this.gameService.currentGameService.game.opponentPlayer.isWinner;
    }

    isDrawnGame(): boolean {
        if (this.gameService.currentGameService.game.creatorPlayer.isWinner && this.gameService.currentGameService.game.opponentPlayer.isWinner) {
            return true;
        } else {
            return false;
        }
    }

    getWinnerName() {
        if (this.isDrawnGame()) {
            this.winnerName =
                this.gameService.currentGameService.game.creatorPlayer.name + ' et ' + this.gameService.currentGameService.game.opponentPlayer.name;
        }
        if (this.gameService.currentGameService.game.creatorPlayer.isWinner) {
            this.winnerName = this.gameService.currentGameService.game.creatorPlayer.name;
        }
        if (this.gameService.currentGameService.game.opponentPlayer.isWinner) {
            this.winnerName = this.gameService.currentGameService.game.opponentPlayer.name;
        }
    }
}
