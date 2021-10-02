import { TestBed } from '@angular/core/testing';
import { ErrorType } from '@app/classes/errors';
import { ChatDisplayService } from './chat-display.service';

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
        expect(service.entries.length).toEqual(1);
    });

    it('addSystemEntry should add a chat system entry', () => {
        service.addSystemEntry('bonjour');
        expect(service.entries.length).toEqual(1);
    });

    it('should call addPlayerEntry & addDebugMess in addVirtalPlayerEntry', () => {
        let player = 'dieyna';
        let command = 'placer';
        let debug = ['h8h', 'bonjour'];
        service.isActiveDebug = true;
        const addPlayerEntryspy = spyOn<any>(service, 'addPlayerEntry');
        service.addVirtalPlayerEntry(player, command, debug);
        expect(addPlayerEntryspy).toHaveBeenCalled();
        expect(service.entries.length).toEqual(2);
    });

    it('should call addSystemEntry in addErrorMessage and invertDebugState', () => {
        let command = 'placer';
        let error = ErrorType.NoError;
        const addSystemEntrySpy = spyOn<any>(service, 'addSystemEntry');

        service.addErrorMessage(error, command);
        service.invertDebugState();
        expect(addSystemEntrySpy).toHaveBeenCalled();
    });

    it('should be able to create Exchange Message when true ', () => {
        let exchangemsg = 'echanger bonjour';
        expect(service.createExchangeMessage(true, exchangemsg)).toEqual('echanger bonjour');
    });

    it('should be able to create Exchange Message when false ', () => {
        let exchangemsg = 'echanger bonjour';
        expect(service.createExchangeMessage(false, exchangemsg)).toEqual('echanger 7 lettre(s)');
    });

    /*
        addPlayerEntry: entries should have one more entry, checker que bonne couleur
        addSystemEntry: entries should have one more entry, checker que bonne couleur
        
        addErrorMessage et addVirtalPlayerEntry; c'est bien,  properly call addWhateverEntry?
        
        addDebugMessages: if is active push debug message, if not no. Check bonne couleur
        
        createExchange: returns the right message depending on if from local player.

        invertDebugState: is active inverted properly, proper activation message sent, properly call addSys?


    */
});
