import { TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ServerChatEntry } from '@app/classes/chat-display-entry';
// import { ChatEntryColor } from '@app/classes/chat-display-entry';
// import { ErrorType } from '@app/classes/errors';
// import { LocalPlayer } from '@app/classes/local-player';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { Difficulty, VirtualPlayer } from '@app/classes/virtual-player';
import * as io from 'socket.io-client';
import { ChatDisplayService } from './chat-display.service';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
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
    it('should emit sendSystemMessageToServer ', () => {
        const message = 'allo';
        service.sendSystemMessageToServer(message);
        expect(socketEmitMockSpy).toHaveBeenCalledWith('sendSystemChatEntry', message);
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
        service.socketOnConnect();
        const serverChatEntry: ServerChatEntry = { senderName: 'dieyba', message: 'salut' };
        socketMock.triggerEvent('addChatEntry', serverChatEntry);
        expect(socketMockSpy).toHaveBeenCalled();
    });
    it('socketOnConnect should handle socket.on event addSystemChatEntry', () => {
        service.socketOnConnect();
        const systemEntry = 'system';
        socketMock.triggerEvent('addSystemChatEntry', systemEntry);
        expect(socketMockSpy).toHaveBeenCalled();
    });
});

//     it('addPlayerEntry should add a chat player entry', () => {
//         service.addPlayerEntry(true, 'dieyna', 'bonjour');
//         const expectedEntry = { color: ChatEntryColor.LocalPlayer, message: 'dieyna >> bonjour' };
//         expect(service.entries.length).toEqual(1);
//         expect(service.entries[0]).toEqual(expectedEntry);
//     });

//     it('addSystemEntry should add a chat system entry', () => {
//         service.addSystemEntry('bonjour');
//         const expectedEntry = { color: ChatEntryColor.SystemColor, message: 'Système >> bonjour' };
//         expect(service.entries.length).toEqual(1);
//         expect(service.entries[0]).toEqual(expectedEntry);
//     });

//     it('should call addPlayerEntry & addDebugMess in addVirtalPlayerEntry', () => {
//         const player = 'dieyna';
//         const command = '!placer';
//         const debugMessages = ['oneword', 'anotherword'];
//         service.isActiveDebug = true;
//         const addPlayerEntryspy = spyOn(service, 'addPlayerEntry').and.callThrough();

//         service.addVirtalPlayerEntry(player, command, debugMessages);
//         expect(addPlayerEntryspy).toHaveBeenCalledWith(false, player, command);
//         expect(service.entries.length).toEqual(3);
//         expect(service.entries[0].color).toEqual(ChatEntryColor.RemotePlayer);
//         expect(service.entries[0].message).toEqual('dieyna >> !placer');
//         expect(service.entries[1].color).toEqual(ChatEntryColor.SystemColor);
//         expect(service.entries[1].message).toEqual('[Debug] oneword');
//     });

//     it('should only call addPlayerEntry if debug not active in addVirtalPlayerEntry', () => {
//         const player = 'dieyna';
//         const command = '!placer';
//         const debugMessages = ['h8h', 'bonjour'];
//         service.isActiveDebug = false;
//         const addPlayerEntryspy = spyOn(service, 'addPlayerEntry').and.callThrough();

//         service.addVirtalPlayerEntry(player, command, debugMessages);
//         expect(addPlayerEntryspy).toHaveBeenCalledWith(false, player, command);
//         expect(service.entries.length).toEqual(1);
//     });

//     it('should call addSystemEntry in addErrorMessage and invertDebugState', () => {
//         const command = '!placer';
//         const error = ErrorType.ImpossibleCommand;
//         const addSystemEntrySpy = spyOn(service, 'addSystemEntry').and.callThrough();

//         service.addErrorMessage(error, command);
//         service.invertDebugState();
//         expect(addSystemEntrySpy).toHaveBeenCalled();
//         expect(service.entries[0].color).toEqual(ChatEntryColor.SystemColor);
//         expect(service.entries[0].message).toEqual('Système >> Commande impossible à réaliser, exécution illégale: !placer');
//     });

//     it('should be able to create Exchange Message when true ', () => {
//         const exchangemsg = 'echanger bonjour';
//         expect(service.createExchangeMessage(true, exchangemsg)).toEqual('echanger bonjour');
//     });

//     it('should add remaining letters and both players remaining letters', () => {
//         const toStringSpy = spyOn(service, 'scrabbleLetterstoString').and.callThrough(); this function was moved to utilities

//         const remainingLetters: ScrabbleLetter[] = [new ScrabbleLetter('a', 1), new ScrabbleLetter('b', 1)];
//         const firstPlayerLetters: ScrabbleLetter[] = [new ScrabbleLetter('c', 1), new ScrabbleLetter('d', 1)];
//         const secondPlayerLetters: ScrabbleLetter[] = [new ScrabbleLetter('e', 1), new ScrabbleLetter('f', 1)];

//         const firstPlayer = new LocalPlayer('Local player');
//         const secondPlayer = new VirtualPlayer('Virtual Player', Difficulty.Easy);
//         firstPlayer.letters = firstPlayerLetters;
//         secondPlayer.letters = secondPlayerLetters;

//         const remainingLettersEntry = { color: ChatEntryColor.SystemColor, message: 'Fin de partie - ab' };
//         const firstPlayerEntry = { color: ChatEntryColor.SystemColor, message: firstPlayer.name + ' : cd' };
//         const secondPlayerEntry = { color: ChatEntryColor.SystemColor, message: secondPlayer.name + ' : ef' };

//         service.addEndGameMessage(remainingLetters, firstPlayer, secondPlayer);
//         expect(service.entries.length).toEqual(3);
//         expect(service.entries[0]).toEqual(remainingLettersEntry);
//         expect(service.entries[1]).toEqual(firstPlayerEntry);
//         expect(service.entries[2]).toEqual(secondPlayerEntry);
//         expect(toStringSpy).toHaveBeenCalledTimes(3);
//     });

//     it('should be able to create Exchange Message when true ', () => {
//         const exchangemsg = '!échanger bonjour';
//         expect(service.createExchangeMessage(true, exchangemsg)).toEqual('!échanger bonjour');
//     });

//     it('should be able to create Exchange Message when false ', () => {
//         const exchangemsg = '!échanger bonjour';
//         expect(service.createExchangeMessage(false, exchangemsg)).toEqual('!échanger 7 lettre(s)');
//         // expect(toStringSpy).toHaveBeenCalledTimes(3);
//     });
// });
