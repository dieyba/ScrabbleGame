import { TestBed } from '@angular/core/testing';
import { ChatEntryColor } from '@app/classes/chat-display-entry/chat-display-entry';
import { DefaultCommandParams } from '@app/classes/commands/commands';
import { createDebugCmd, DebugCmd } from '@app/classes/debug-command/debug-command';
import { Player } from '@app/classes/player/player';
import { ACTIVE_DEBUG_MESSAGE, ChatDisplayService, INACTIVE_DEBUG_MESSAGE } from '@app/services/chat-display.service/chat-display.service';
const PLAYER_NAME = 'Sara';

describe('DebugCmd', () => {
    let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
    const localPlayer = new Player(PLAYER_NAME);

    beforeEach(() => {
        chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', ['invertDebugState']);
        TestBed.configureTestingModule({
            providers: [{ provide: ChatDisplayService, useValue: chatDisplayServiceSpy }],
        });
        chatDisplayServiceSpy.isActiveDebug = false;
    });

    it('should create an instance', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
        const debug = new DebugCmd(defaultParams);
        expect(debug).toBeTruthy();
    });

    it('should call invertDebugState from chatDisplayService', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
        const debug = new DebugCmd(defaultParams);
        debug.execute();
        expect(chatDisplayServiceSpy.invertDebugState).toHaveBeenCalled();
    });

    it('should call execute and activate debug in chatDisplayService', () => {
        chatDisplayServiceSpy.invertDebugState.and.returnValue(ACTIVE_DEBUG_MESSAGE);
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
        const debug = new DebugCmd(defaultParams);
        const commandMessage = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !debug' };
        const systemMessage = { color: ChatEntryColor.SystemColor, message: 'Syst??me >> ' + ACTIVE_DEBUG_MESSAGE };
        expect(debug.execute()).toEqual({ isExecuted: true, executionMessages: [commandMessage, systemMessage] });
    });

    it('should call execute and deactivate debug in chatDisplayService', () => {
        chatDisplayServiceSpy.invertDebugState.and.returnValue(INACTIVE_DEBUG_MESSAGE);
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
        const debug = new DebugCmd(defaultParams);
        const commandMessage = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !debug' };
        const systemMessage = { color: ChatEntryColor.SystemColor, message: 'Syst??me >> ' + INACTIVE_DEBUG_MESSAGE };
        expect(debug.execute()).toEqual({ isExecuted: true, executionMessages: [commandMessage, systemMessage] });
    });

    it('createDebugCmd should create an instance', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
        expect(createDebugCmd(defaultParams)).toBeTruthy();
    });
});
