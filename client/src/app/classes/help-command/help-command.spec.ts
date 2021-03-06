import { ChatDisplayEntry, ChatEntryColor } from '@app/classes/chat-display-entry/chat-display-entry';
import { DefaultCommandParams } from '@app/classes/commands/commands';
import { Player } from '@app/classes/player/player';
import { ChatDisplayService } from '@app/services/chat-display.service/chat-display.service';
import { createHelpCmd, HelpCmd, HELP_MESSAGES } from './help-command';

const PLAYER_NAME = 'Sara';

describe('HelpCmd', () => {
    let chatDisplayService: ChatDisplayService;
    const localPlayer = new Player(PLAYER_NAME);

    it('should create an instance', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayService };
        const help = new HelpCmd(defaultParams);
        expect(help).toBeTruthy();
    });

    it('should execute and return help messages', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayService };
        const debug = new HelpCmd(defaultParams);
        const commandMessage = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !aide' };
        const expectedResult: ChatDisplayEntry[] = [commandMessage];
        for (const message of HELP_MESSAGES) {
            expectedResult.push({ color: ChatEntryColor.SystemColor, message });
        }
        expect(debug.execute()).toEqual({ isExecuted: true, executionMessages: expectedResult });
    });

    it('createHelpCmd should create an instance', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayService };
        expect(createHelpCmd(defaultParams)).toBeTruthy();
    });
});
