/* eslint-disable max-lines */
/* eslint-disable dot-notation */
/* eslint-disable max-lines */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { GameParameters } from '@app/classes/game-parameters/game-parameters';
import { Player } from '@app/classes/player/player';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';
import { GameListService } from '@app/services/game-list.service/game-list.service';
import { GameService } from '@app/services/game.service/game.service';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import dict_path from 'src/assets/dictionary.json';
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
    let multiplayerMode: jasmine.SpyObj<GameService>;
    let socketMock: SocketMock;
    let socketMockSpy: jasmine.SpyObj<any>;
    // let gameTest: GameParameters

    beforeEach(async () => {
        gameListServiceSpy = jasmine.createSpyObj('GameListService', [
            'initializeMultiplayerGame',
            'getList',
            'start',
            'deleteRoom',
            'someoneLeftRoom',
            'getGames',
        ]);
        multiplayerMode = jasmine.createSpyObj('GameService', ['initializeMultiplayerGame']);
        await TestBed.configureTestingModule({
            declarations: [WaitingAreaComponent],
            imports: [MatCardModule, MatFormFieldModule, MatInputModule, RouterTestingModule, MatDialogModule, MatSnackBarModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: { close: () => {} } }, // eslint-disable-line @typescript-eslint/no-empty-function
                { provide: Router, useValue: { navigate: () => new Observable() } },
                { provide: MatDialog, useValue: { open: () => new Observable() } },
                { provide: GameListService, useValue: gameListServiceSpy },
                { provide: GameService, useValue: multiplayerMode },
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
        component.data.isGameSelected = true;
        const gameSelected = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLog2990: false,
        };
        // const game = new GameParameters('Ari', 60, false);
        component.onSelect(gameSelected);
        expect(component.selectedGame.creatorName).toEqual('Dieyba');
    });

    it('onSelect should not set selectedGame if gameSelected is false', () => {
        component.data.isGameSelected = false;
        // const selectedGame = new GameParameters('', 0, false);
        // const game = new GameParameters('Ari', 60, false);
        const gameSelected = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLog2990: false,
        };
        component.onSelect(gameSelected);
        expect(component.selectedGame).toBeUndefined();
    });

    it('openName should return true if game is selected and parameter is true', () => {
        component.data.isGameSelected = true;
        expect(component.openName(true)).toEqual(true);
    });

    it('openName should return true if game is not selected', () => {
        component.data.isGameSelected = false;
        expect(component.openName(true)).toEqual(false);
    });

    it('startIfFull should initializeGame if two players have joined', () => {
        component.playerList = ['Ari', 'Sara'];
        component.gameList.localPlayerRoomInfo = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLog2990: false,
        };
        component.startIfFull();
        expect(component.isStarting).toEqual(true);
        expect(gameListServiceSpy.initializeMultiplayerGame).toHaveBeenCalled();
    });

    it('startIfFull should not initializeGame if one player has joined', () => {
        component.playerList = ['Ari'];
        component.startIfFull();
        expect(component.isStarting).toEqual(false);
        expect(gameListServiceSpy.initializeMultiplayerGame).not.toHaveBeenCalled();
    });

    it('start should set nameValid to true and call gameList start when only one player', () => {
        component.selectedGame = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLog2990: false,
        };
        component.selectedGame.gameRoom.playersName = ['Ari'];
        component.playerName = new FormControl('Ari');
        component.start();
        expect(component.nameValid).toEqual(true);
        expect(gameListServiceSpy.start).toHaveBeenCalled();
    });

    it('start should set full to true when two players', () => {
        component.selectedGame = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLog2990: false,
        };
        component.selectedGame.gameRoom.playersName = ['Ari', 'Sara'];
        component.playerName = new FormControl('Ari');
        component.start();
        expect(component.full).toEqual(true);
        expect(gameListServiceSpy.start).not.toHaveBeenCalled();
    });

    it('confirmName should set error to true when playerName and creatorPlayer name are the same', () => {
        const game = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Ari', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Ari',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLog2990: false,
        };
        // game.creatorPlayer = game.localPlayer;
        component.playerName = new FormControl('Ari');
        component.confirmName(game);
        expect(component.error).toEqual(true);
    });

    it('confirmName should set error to false when playerName and creatorPlayer name are not the same', () => {
        const game = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLog2990: false,
        };
        // game.creatorPlayer = game.localPlayer;
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
        component.onPopState();
        expect(gameListServiceSpy.someoneLeftRoom).toHaveBeenCalled();
    });
    it('onBeforeUnload should call gameList someoneLeftRoom', () => {
        component.isStarting = true;
        component.onBeforeUnload();
        expect(gameListServiceSpy.someoneLeftRoom).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event updateInfo', () => {
        component['socketOnConnect']();
        const game = new GameParameters();
        game.players[0] = new Player('dieyba');
        game.players[1] = new Player('sara');
        game.players[0].socketId = '1he2rwgfw8e';
        game.players[1].socketId = '1he2rwgfw8e';
        game.players[0].isActive = false;
        game.players[1].isActive = false;
        socketMock.triggerEvent('initClientGame', game);
        expect(multiplayerMode.initializeMultiplayerGame).toHaveBeenCalled();
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomdeleted', () => {
        component['socketOnConnect']();
        const game = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLOG2990: false,
        };
        socketMock.triggerEvent('waitingAreaRoomDeleted', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomcreated', () => {
        component['socketOnConnect']();
        const game = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLOG2990: false,
        };
        socketMock.triggerEvent('waitingAreaRoomCreated', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomJoined', () => {
        component['socketOnConnect']();
        const game = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLOG2990: false,
        };
        socketMock.triggerEvent('roomJoined', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event roomLeft', () => {
        component['socketOnConnect']();
        const game = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: 'Erika',
            dictionary: dict_path as DictionaryInterface,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 1,
            isLOG2990: false,
        };
        socketMock.triggerEvent('roomLeft', game);
        expect(socketMockSpy).toHaveBeenCalled();
    });

    it('socketOnConnect should handle socket.on event roomLeft', () => {
        component['socketOnConnect']();
        const game = undefined;
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

    it('should return a value between the minimum and the maxmimum pendingGameList length', () => {
        const spy = spyOn(component, 'openName');
        component.randomGame();
        expect(spy).toHaveBeenCalled();
    });
});
