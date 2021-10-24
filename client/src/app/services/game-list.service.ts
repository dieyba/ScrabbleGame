import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { PlayerHandler } from '@app/modules/playerHandler';
import { SocketHandler } from '@app/modules/socketHandler';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
export interface Game {
    creatorName: string;
    dictionary: string;
    timer: number;
}

@Injectable({
    providedIn: 'root',
})
export class GameListService {
    //     const urlString = `http://${window.location.hostname}:5020`;
    // const socket = io(urlString);
    // private readonly HOST_NAME = 'http://' + window.location.hostname;
    // private readonly SERVER_PORT = ':3000';
    private readonly server = 'http://' + window.location.hostname + ':3000';
    private socket: io.Socket;
    private player: LocalPlayer;
    roomInfo = { idGame: -1, capacity: 0, playersName: new Array<string>() };
    // gameList: Array<GameParameters>;
    // player: LocalPlayer;
    // dictionary: Dictionary;
    // randomBonus: boolean;
    // totalCountDown: number;
    constructor(private http: HttpClient) {
        this.socket = SocketHandler.requestSocket(this.server) as io.Socket; // TODO: this line didnt work is it fine fixed like this?
        this.player = PlayerHandler.requestPlayer();
        this.socket.on('roomCreated', (roomInf: GameParameters) => {
            // Set the information of the room
            this.roomInfo = roomInf.gameRoom;
            this.player.roomId = roomInf.gameRoom.idGame;
            // this.roomJoined = true;
        });
        // this.gameList = new Array<GameParameters>();
    }
    // private saveSocket(): any {
    //     return SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);
    // }
    // addGame(game: GameParameters) {
    // console.log(game.controls.name.value);
    // console.log(game.controls.dictionaryForm.value);
    // console.log(game.controls.bonus.value);
    // console.log(game.controls.timer.value);
    // let singleGame = new GameParameters(
    //     game.controls.name.value,
    //     game.controls.dictionaryForm.value,
    //     game.controls.bonus.value,
    //     game.controls.timer.value,
    // // );
    // console.log(game);
    // this.gameList.push(game);
    // this.player = new LocalPlayer(game.controls.name.value)
    // this.dictionary = new Dictionary(game.controls.dictionaryForm.value);
    // this.randomBonus = game.controls.bonus.value;
    // this.totalCountDown = game.controls.timer.value;
    // }
    getList(): Observable<GameParameters[]> {
        return this.http.get<GameParameters[]>('http://' + window.location.hostname + ':3000/api/gameList');
    }
    createRoom(game: GameParameters): void {
        console.log('createRoom' + game.createrPlayer.name + ' ' + game.totalCountDown);
        this.socket.emit('createRoom', { name: game.createrPlayer.name, timer: game.totalCountDown });
    }
}
