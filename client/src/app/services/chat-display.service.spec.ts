import { TestBed } from '@angular/core/testing';
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

    it('should ', () => {
        
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
