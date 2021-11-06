import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { GameListService } from '@app/services/game-list.service';
import { MultiPlayerGameService } from '@app/services/multi-player-game.service';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { WaitingAreaComponent } from './waiting-area.component';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
class SocketMock {
    id: string = 'Socket mock';
    events: Map<string, CallableFunction> = new Map();
    on(eventName: string, cb: CallableFunction) {
        this.events.set(eventName, cb);
    }

    triggerEvent(eventName: string, ...args: any[]) {
        const arrowFunction = this.events.get(eventName) as CallableFunction;
        arrowFunction(...args);
    }

    join(...args: any[]) {
        return;
    }
    emit(...args: any[]) {
        return;
    }

    disconnect() {
        return;
    }
}

describe('WaitingAreaComponent', () => {
    let component: WaitingAreaComponent;
    let fixture: ComponentFixture<WaitingAreaComponent>;
    let gameListServiceSpy: jasmine.SpyObj<GameListService>;
    let multiplayerMode: jasmine.SpyObj<MultiPlayerGameService>;
    let event: MouseEvent;
    let socketMock: SocketMock;
    let socketMockSpy: jasmine.SpyObj<any>;

    beforeEach(async () => {
        gameListServiceSpy = jasmine.createSpyObj('GameListService', ['initializeGame', 'getList', 'start', 'deleteRoom', 'someoneLeftRoom']);
        multiplayerMode = jasmine.createSpyObj('MultiPlayerGameService', ['initializeGame2']);
        await TestBed.configureTestingModule({
            declarations: [WaitingAreaComponent],
            imports: [MatCardModule, MatFormFieldModule, MatInputModule, RouterTestingModule, MatDialogModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: { close: () => {} } }, // eslint-disable-line @typescript-eslint/no-empty-function
                { provide: Router, useValue: { navigate: () => new Observable() } },
                { provide: MatDialog, useValue: { open: () => new Observable() } },
                { provide: GameListService, useValue: gameListServiceSpy },
                { provide: MultiPlayerGameService, useValue: multiplayerMode },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingAreaComponent);
        component = fixture.componentInstance;
        socketMock = new SocketMock();
        component['socket'] = socketMock as unknown as io.Socket;
        socketMockSpy = spyOn(socketMock, 'on').and.callThrough();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onSelect should set selectedGame if gameSelected is true', () => {
        component.gameSelected = true;
        const game = new GameParameters('Ari', 60, false);
        component.onSelect(game);
        expect(component.selectedGame.localPlayer.name).toEqual('Ari');
    });

    it('onSelect should not set selectedGame if gameSelected is false', () => {
        component.gameSelected = false;
        const selectedGame = new GameParameters('', 0, false);
        const game = new GameParameters('Ari', 60, false);
        component.onSelect(game);
        expect(component.selectedGame).toEqual(selectedGame);
    });

    it('openName should return true if game is selected and parameter is true', () => {
        component.gameSelected = true;
        expect(component.openName(true)).toEqual(true);
    });

    it('openName should return true if game is not selected', () => {
        component.gameSelected = false;
        expect(component.openName(true)).toEqual(false);
    });

    it('startIfFull should initializeGame if two players have joined', () => {
        component.playerList = ['Ari', 'Sara'];
        component.gameList.roomInfo = new GameParameters('Ari', 60, false);
        component.startIfFull();
        expect(component.isStarting).toEqual(true);
        expect(gameListServiceSpy.initializeGame).toHaveBeenCalled();
    });

    it('startIfFull should not initializeGame if one player has joined', () => {
        component.playerList = ['Ari'];
        component.startIfFull();
        expect(component.isStarting).toEqual(false);
        expect(gameListServiceSpy.initializeGame).not.toHaveBeenCalled();
    });

    it('start should set nameValid to true and call gameList start when only one player', () => {
        component.selectedGame = new GameParameters('Ari', 60, false);
        component.selectedGame.gameRoom.playersName = ['Ari'];
        component.playerName = new FormControl('Ari');
        component.start();
        expect(component.nameValid).toEqual(true);
        expect(gameListServiceSpy.start).toHaveBeenCalled();
    });

    it('start should set full to true when two players', () => {
        component.selectedGame = new GameParameters('Ari', 60, false);
        component.selectedGame.gameRoom.playersName = ['Ari', 'Sara'];
        component.playerName = new FormControl('Ari');
        component.start();
        expect(component.full).toEqual(true);
        expect(gameListServiceSpy.start).not.toHaveBeenCalled();
    });

    it('confirmName should set error to true when playerName and creatorPlayer name are the same', () => {
        const game = new GameParameters('Ari', 60, false);
        game.creatorPlayer = game.localPlayer;
        component.playerName = new FormControl('Ari');
        component.confirmName(game);
        expect(component.error).toEqual(true);
    });

    it('confirmName should set error to false when playerName and creatorPlayer name are not the same', () => {
        const game = new GameParameters('Ari', 60, false);
        game.creatorPlayer = game.localPlayer;
        component.playerName = new FormControl('Sara');
        component.confirmName(game);
        expect(component.error).toEqual(false);
    });

    it('deleteRoom should call gameList deleteRoom', () => {
        component.deleteRoom();
        expect(gameListServiceSpy.deleteRoom).toHaveBeenCalled();
    });

    it('someoneLeftRoom should call gameList someoneLeftRoom', () => {
        component.isStarting = false;
        component.someoneLeftRoom();
        expect(gameListServiceSpy.someoneLeftRoom).toHaveBeenCalled();
    });
    it('someoneLeftRoom should not  call gameList someoneLeftRoom', () => {
        component.isStarting = true;
        component.someoneLeftRoom();
        expect(gameListServiceSpy.someoneLeftRoom).not.toHaveBeenCalled();
    });
    it('onPopState should call gameList someoneLeftRoom', () => {
        component.isStarting = true;
        component.onPopState(event);
        expect(gameListServiceSpy.someoneLeftRoom).toHaveBeenCalled();
    });
    it('onBefreUnload should call gameList someoneLeftRoom', () => {
        component.isStarting = true;
        component.onBeforeUnload(event);
        expect(gameListServiceSpy.someoneLeftRoom).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event updateInfo', () => {
        component.socketOnConnect();
        const game = new GameParameters('dieyba', 0, false);
        game.players[0] = new LocalPlayer('dieyba');
        game.players[1] = new LocalPlayer('sara');
        game.players[0].socketId = '1he2rwgfw8e';
        game.players[1].socketId = '1he2rwgfw8e';
        game.players[0].isActive = false;
        game.players[1].isActive = false;
        socketMock.triggerEvent('updateInfo', game);
        expect(multiplayerMode.initializeGame2).toHaveBeenCalled();
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomdeleted', () => {
        component.socketOnConnect();
        const game = new GameParameters('dieyba', 0, false);
        socketMock.triggerEvent('roomdeleted', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomcreated', () => {
        component.socketOnConnect();
        const game = new GameParameters('dieyba', 0, false);
        socketMock.triggerEvent('roomcreated', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomJoined', () => {
        component.socketOnConnect();
        const game = new GameParameters('dieyba', 0, false);
        socketMock.triggerEvent('roomJoined', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomLeft', () => {
        component.socketOnConnect();
        const game = new GameParameters('dieyba', 0, false);
        socketMock.triggerEvent('roomLeft', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });

    it('openForm should open dialog', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        const matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.openForm();
        expect(matdialog).toHaveBeenCalled();
    });

    it('convert should set name to false, call close dialog and open dialog', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        const matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        const closeDialogSpy = spyOn<any>(component, 'closeDialog').and.callThrough();
        component.convert(true);
        expect(component.name).toEqual(false);
        expect(closeDialogSpy).toHaveBeenCalled();
        expect(matdialog).toHaveBeenCalled();
    });
});
