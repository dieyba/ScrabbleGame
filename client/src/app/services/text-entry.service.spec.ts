import { TestBed } from '@angular/core/testing';
import { TextEntryService } from './text-entry.service';

describe('TextEntryService', () => {
    let service: TextEntryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TextEntryService);
    });

    /*
    handleInput:
        if ! should call create command not send add player entry
        if not, should send player entry
        if command create valid (not tested here), should execute
        Return error type should send error message
        return noerror, should add player entry
        if command is exchange, should call createExchangeMessage then addPlayerEntry
    */

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('should send input to createCommand', () => {
    //     // Only check if ! calls the command creation function
    //     const spy = spyOn(service, 'createCommand').and.stub();
    //     const FAKE_COMMAND = '!not a command';
    //     const IS_FROM_LOCAL_PLAYER = true;
    //     service.handleInput(FAKE_COMMAND,IS_FROM_LOCAL_PLAYER);

    //     expect(spy).toHaveBeenCalled();
    // });

    // it('should ', () => {

    // });

    /*  
        create command
            splitCommandInput
            commandsMap.has(commandName) or spy addError(invalidCommand)
            extractCommandParams returns the right params type|undefined or spy addError(syntax)
            createCmdFunction.call() should always return a valid command

        extract command
            paramsMap.has(commandName) or func returns undefined
            createCmdFunction.call returns the right params (no undef)
     
        isWithoutParams: returns defaultparams or undef

        extractDebugParams:
            isWithoutParams() not tested here
            returns default and chat or undef (isdefaultParams should be undef)
        
        extractPlaceParams:
            removeAccents not tested here
            isvalidword and allLower not tested here ->
                just check this method returns undef if position/orientation not valid 
            convertToCoordinates not tested here, juste see if not valid row/col return undef
            if orientation not 'h' or 'v' orientation return undef
            return the right place params when valid
        
        extract exchange params:
            if exchange has more than one param, return undef
            if its maj or has accent return undef
            if 0 or more than 7 letters return undef
            if valid word return command params properly
        
        isValidWordInput:
            empty word returns false
            if has invalid letters (num and other random char) returns false
            min and maj letters return true
            accents returns false
        
        isValidExchangeWord:
            if accent or maj return false
            random char returns false
            empty returns false
        
        
        isValidLetter:
            if empty or more than one letter false
            if random char or accent false
            if letter true

        convertToCoordinates:
            if empty return undef
            if column isnt a number (ex:letter or random char), undef
            if row isnt a min letter (ex:maj letter, accent,random char) undef
            if valid, return valid coord Vec2
        
        splitCommandInput:
            if its empty return []
            if its not a command input return [];
            else should return the right split array
        
        trimspaces:
            if empty or only white spaces return ""
            otherwise return with only edge white spaces trimmed
        
        isEmpty:
            if empty/white space: return true (not much here either)
        
        isAllLowerLetters and remove accents:
            not much in there its only for lisibility

    */

    // it('should send to chat display as an invalid command', () => {
    //     const spy = spyOn(service, 'createCommand').and.returnValue(false);
    //     // TODO Add spy for command handler!
    //     // In this test we don't care about the command validity
    //     const FAKE_COMMAND = '!not a command';

    //     service.handleInput(FAKE_COMMAND);

    //     expect(spy).toHaveBeenCalled();
    //     // TODO Verify if command handler isn't called
    // });

    // it('should send to chat display as normal text', () => {
    //     const spy = spyOn(service, 'isValidCommand').and.returnValue(false);
    //     // TODO spy on chat display service
    //     const USER_MESSAGE = 'Some normal message';

    //     service.handleInput(USER_MESSAGE);

    //     expect(spy).not.toHaveBeenCalled();
    //     // TODO verify is text sent to chat display service with good arguments
    // });

    // it('should recognize as command', () => {
    //     // In this test we don't care about arguments
    //     const VALID_COMMAND = '!placer someArguments';

    //     const IS_VALID_COMMAND = service.isValidCommand(VALID_COMMAND);

    //     expect(IS_VALID_COMMAND).toEqual(true);
    // });

    // it('should recognize as an invalid command', () => {
    //     // In this test we don't care about arguments
    //     const VALID_COMMAND = '!jeNeSuisPasUneCommand someArguments';

    //     const IS_VALID_COMMAND = service.isValidCommand(VALID_COMMAND);

    //     expect(IS_VALID_COMMAND).toEqual(false);
    // });
});
