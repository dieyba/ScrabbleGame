/* eslint-disable dot-notation */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
import { TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ChatEntryColor, ServerChatEntry } from '@app/classes/chat-display-entry/chat-display-entry';
import { Player } from '@app/classes/player/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter/scrabble-letter';
import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import * as io from 'socket.io-client';
import { ACTIVE_DEBUG_MESSAGE, ChatDisplayService, INACTIVE_DEBUG_MESSAGE } from './chat-display.service';

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

describe('ChatDisplayService', () => {
    let service: ChatDisplayService;
    let socketMock: SocketMock;
    let socketMockSpy: jasmine.SpyObj<any>;
    let socketEmitMockSpy: jasmine.SpyObj<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatCardModule],
        });
        service = TestBed.inject(ChatDisplayService);
        socketMock = new SocketMock();
        service['socket'] = socketMock as unknown as io.Socket;
        socketMockSpy = spyOn(socketMock, 'on').and.callThrough();
        socketEmitMockSpy = spyOn(socketMock, 'emit');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should emit sendMessageToServer ', () => {
        const message = 'allo';
        const message2 = 'helloWorld';
        service.sendMessageToServer(message);
        expect(socketEmitMockSpy).toHaveBeenCalledWith('sendChatEntry', message);
        service.sendMessageToServer(message, message2);
        expect(socketEmitMockSpy).toHaveBeenCalledWith('sendChatEntry', message, message2);
    });
    it('socketOnConnect should handle socket.on event addChatEntry', () => {
        service['socketOnConnect'];
        const serverChatEntry: ServerChatEntry = { senderName: 'dieyba', message: 'salut' };
        socketMock.triggerEvent('addChatEntry', serverChatEntry);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event addSystemChatEntry', () => {
        service['socketOnConnect'];
        const systemEntry = 'system';
        socketMock.triggerEvent('addSystemChatEntry', systemEntry);
        expect(socketMockSpy).toHaveBeenCalled();
    });

    it('should be initialized', () => {
        service.initialize('someone');
        expect(service.entries).toEqual([]);
        expect(service.isActiveDebug).toEqual(false);
        expect(service['localPlayerName']).toEqual('someone');
    });

    it('addEntry should add an entry to entries', () => {
        const expectedEntry = { color: ChatEntryColor.LocalPlayer, message: 'something' };
        service.addEntry(expectedEntry);
        expect(service.entries.length).toEqual(1);
        expect(service.entries[0]).toEqual(expectedEntry);
    });

    it('addVirtualPlayerEntry should add a virtual player entry and no debug message', () => {
        const commandInput = '!somecommand';
        const debugMessage = ['some debug message'];
        service.isActiveDebug = false;
        service.addVirtualPlayerEntry(commandInput, debugMessage);
        const expectedEntry = { color: ChatEntryColor.RemotePlayer, message: '!somecommand' };
        expect(service.entries.length).toEqual(1);
        expect(service.entries[0]).toEqual(expectedEntry);
    });

    it('addVirtualPlayerEntry should add a virtual player entry and debug message', () => {
        const commandInput = '!somecommand';
        const debugMessage = ['some debug message'];
        service.isActiveDebug = true;
        service.addVirtualPlayerEntry(commandInput, debugMessage);
        const expectedEntry = { color: ChatEntryColor.RemotePlayer, message: '!somecommand' };
        const expectedDebugEntry = { color: ChatEntryColor.SystemColor, message: '[Debug] some debug message' };
        expect(service.entries.length).toEqual(2);
        expect(service.entries[0]).toEqual(expectedEntry);
        expect(service.entries[1]).toEqual(expectedDebugEntry);
    });
    it('should inactivate debug state', () => {
        service.isActiveDebug = true;
        expect(service.invertDebugState()).toEqual(INACTIVE_DEBUG_MESSAGE);
        expect(service.isActiveDebug).toEqual(false);
    });
    it('should inactivate debug state', () => {
        service.isActiveDebug = false;
        expect(service.invertDebugState()).toEqual(ACTIVE_DEBUG_MESSAGE);
        expect(service.isActiveDebug).toEqual(true);
    });

    it('should display remaining stock letters and both players remaining letters', () => {
        const remainingLetters: ScrabbleLetter[] = [new ScrabbleLetter('a', 1), new ScrabbleLetter('b', 1)];
        const firstPlayerLetters: ScrabbleLetter[] = [new ScrabbleLetter('c', 1), new ScrabbleLetter('d', 1)];
        const secondPlayerLetters: ScrabbleLetter[] = [new ScrabbleLetter('e', 1), new ScrabbleLetter('f', 1)];

        const firstPlayer = new Player('Local player');
        const secondPlayer = new VirtualPlayer('Virtual Player', Difficulty.Easy);
        firstPlayer.letters = firstPlayerLetters;
        secondPlayer.letters = secondPlayerLetters;

        const remainingLettersEntry = { color: ChatEntryColor.SystemColor, message: 'Fin de partie - ab' };
        const firstPlayerEntry = { color: ChatEntryColor.SystemColor, message: firstPlayer.name + ' : cd' };
        const secondPlayerEntry = { color: ChatEntryColor.SystemColor, message: secondPlayer.name + ' : ef' };

        service.displayEndGameMessage(remainingLetters, firstPlayer, secondPlayer);
        spyOn(service, 'addEntry').and.callThrough();
        expect(service.entries.length).toEqual(3);
        expect(service.entries[service.entries.length - 3]).toEqual(remainingLettersEntry);
        expect(service.entries[service.entries.length - 2]).toEqual(firstPlayerEntry);
        expect(service.entries[service.entries.length - 1]).toEqual(secondPlayerEntry);
    });
});
