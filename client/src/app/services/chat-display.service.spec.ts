import { TestBed } from '@angular/core/testing';
import { ErrorType } from '@app/classes/errors';
import { ChatDisplayService } from './chat-display.service';
import { LocalPlayer } from '@app/classes/local-player';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { PlayerType } from '@app/classes/virtual-player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ChatEntryColor } from '@app/classes/chat-display-entry';

describe('ChatDisplayService', () => {
    let service: ChatDisplayService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatDisplayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('addPlayerEntry should add a chat player entry', () => {
        service.addPlayerEntry(true, 'dieyna', 'bonjour');
        const expectedEntry = {color:ChatEntryColor.LocalPlayer,message:'dieyna >> bonjour'};
        expect(service.entries.length).toEqual(1);
        expect(service.entries[0]).toEqual(expectedEntry);
    });

    it('addSystemEntry should add a chat system entry', () => {
        service.addSystemEntry('bonjour');
        const expectedEntry = {color:ChatEntryColor.SystemColor,message:'Système >> bonjour'};
        expect(service.entries.length).toEqual(1);
        expect(service.entries[0]).toEqual(expectedEntry);
    });

    it('should call addPlayerEntry & addDebugMess in addVirtalPlayerEntry', () => {
        let player = 'dieyna';
        let command = '!placer';
        let debugMessages = ['oneword', 'anotherword'];
        service.isActiveDebug = true;
        const addPlayerEntryspy = spyOn<any>(service, 'addPlayerEntry').and.callThrough();
        
        service.addVirtalPlayerEntry(player, command, debugMessages);
        expect(addPlayerEntryspy).toHaveBeenCalledWith(false, player, command); 
        expect(service.entries.length).toEqual(3);
        expect(service.entries[0].color).toEqual(ChatEntryColor.RemotePlayer);
        expect(service.entries[0].message).toEqual('dieyna >> !placer');
        expect(service.entries[1].color).toEqual(ChatEntryColor.SystemColor);
        expect(service.entries[1].message).toEqual('[Debug] oneword');
    });

    it('should only call addPlayerEntry if debug not active in addVirtalPlayerEntry', () => {
        let player = 'dieyna';
        let command = '!placer';
        let debugMessages = ['h8h', 'bonjour'];
        service.isActiveDebug = false;
        const addPlayerEntryspy = spyOn<any>(service, 'addPlayerEntry').and.callThrough();
        
        service.addVirtalPlayerEntry(player, command, debugMessages);
        expect(addPlayerEntryspy).toHaveBeenCalledWith(false, player, command); 
        expect(service.entries.length).toEqual(1);
    });

    it('should call addSystemEntry in addErrorMessage and invertDebugState', () => {
        let command = '!placer';
        let error = ErrorType.ImpossibleCommand;
        const addSystemEntrySpy = spyOn<any>(service, 'addSystemEntry').and.callThrough();

        service.addErrorMessage(error, command);
        service.invertDebugState();
        expect(addSystemEntrySpy).toHaveBeenCalled();
        expect(service.entries[0].color).toEqual(ChatEntryColor.SystemColor);
        expect(service.entries[0].message).toEqual('Système >> Commande impossible à réaliser, exécution illégale: !placer');
    });

<<<<<<< HEAD
    // it('should add remaining letters in stock and each players remaining letters', () => {
    //     const addPlayerEntryspy = spyOn<any>(service, 'addPlayerEntry');
    //     const firstPlayer = new LocalPlayer();
    //     service.addEndGameMessage();
    //     expect(addPlayerEntryspy).toHaveBeenCalled();
    //     expect(service.entries.length).toEqual(2);
    // });

    it('should be able to create Exchange Message when true ', () => {
        let exchangemsg = 'echanger bonjour';
        expect(service.createExchangeMessage(true, exchangemsg)).toEqual('echanger bonjour');
    });
=======
    it('should add remaining letters and both players remaining letters', () => {
        const toStringSpy = spyOn<any>(service, 'scrabbleLetterstoString').and.callThrough();
        
        const remainingLetters:ScrabbleLetter[] = [new ScrabbleLetter('a',1), new ScrabbleLetter('b',1)];
        const firstPlayerLetters:ScrabbleLetter[] = [new ScrabbleLetter('c',1), new ScrabbleLetter('d',1)];
        const secondPlayerLetters:ScrabbleLetter[] = [new ScrabbleLetter('e',1), new ScrabbleLetter('f',1)];
>>>>>>> a9c35137f669a7ff7c51893992518be0547d06a5

        const firstPlayer = new LocalPlayer('Local player');
        const secondPlayer = new VirtualPlayer('Virtual Player', PlayerType.Easy);
        firstPlayer.letters = firstPlayerLetters;
        secondPlayer.letters = secondPlayerLetters;
    
        const remainingLettersEntry = {color:ChatEntryColor.SystemColor,message:'Fin de partie - ab'};
        const firstPlayerEntry = {color:ChatEntryColor.SystemColor,message:firstPlayer.name + ' : cd'};
        const secondPlayerEntry = {color:ChatEntryColor.SystemColor,message:secondPlayer.name + ' : ef'};
        
        service.addEndGameMessage(remainingLetters,firstPlayer,secondPlayer);
        expect(service.entries.length).toEqual(3);
        expect(service.entries[0]).toEqual(remainingLettersEntry);
        expect(service.entries[1]).toEqual(firstPlayerEntry);
        expect(service.entries[2]).toEqual(secondPlayerEntry);
        expect(toStringSpy).toHaveBeenCalledTimes(3);
    });
<<<<<<< HEAD
=======


    it('should be able to create Exchange Message when true ', () => {
        let exchangemsg = '!échanger bonjour';
        expect(service.createExchangeMessage(true, exchangemsg)).toEqual('!échanger bonjour');
    });

    it('should be able to create Exchange Message when false ', () => {
        let exchangemsg = '!échanger bonjour';
        expect(service.createExchangeMessage(false, exchangemsg)).toEqual('!échanger 7 lettre(s)');
    });

>>>>>>> a9c35137f669a7ff7c51893992518be0547d06a5
});
