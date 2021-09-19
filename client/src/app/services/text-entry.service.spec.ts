import { TestBed } from '@angular/core/testing';
import { TextEntryService } from './text-entry.service';

describe('TextEntryService', () => {
    let service: TextEntryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TextEntryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send command to command handler', () => {
        const spy = spyOn(service, 'isValidCommand').and.returnValue(true);
        // TODO Add spy for command handler!
        // In this test we don't care about the command validity
        const FAKE_COMMAND = '!not a command';

        service.handleInput(FAKE_COMMAND);

        expect(spy).toHaveBeenCalled();
        // TODO Verify if command handler is called
    });

    it('should send to chat display as an invalid command', () => {
        const spy = spyOn(service, 'isValidCommand').and.returnValue(false);
        // TODO Add spy for command handler!
        // In this test we don't care about the command validity
        const FAKE_COMMAND = '!not a command';

        service.handleInput(FAKE_COMMAND);

        expect(spy).toHaveBeenCalled();
        // TODO Verify if command handler isn't called
    });

    it('should send to chat display as normal text', () => {
        const spy = spyOn(service, 'isValidCommand').and.returnValue(false);
        // TODO spy on chat display service
        const USER_MESSAGE = 'Some normal message';

        service.handleInput(USER_MESSAGE);

        expect(spy).not.toHaveBeenCalled();
        // TODO verify is text sent to chat display service with good arguments
    });

    it('should recognize as command', () => {
        // In this test we don't care about arguments
        const VALID_COMMAND = '!placer someArguments';

        const IS_VALID_COMMAND = service.isValidCommand(VALID_COMMAND);

        expect(IS_VALID_COMMAND).toEqual(true);
    });

    it('should recognize as an invalid command', () => {
        // In this test we don't care about arguments
        const VALID_COMMAND = '!jeNeSuisPasUneCommand someArguments';

        const IS_VALID_COMMAND = service.isValidCommand(VALID_COMMAND);

        expect(IS_VALID_COMMAND).toEqual(false);
    });
});
