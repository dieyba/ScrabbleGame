import { createDebugCmd, DebugCmd } from '@app/classes/debug-command';
import { LocalPlayer } from '@app/classes/local-player';
import { ChatDisplayService } from '@app/services/chat-display.service';
import { DefaultCommandParams } from './commands';

describe('DebugCmd', () => {
    const chat = new ChatDisplayService();
    const localPlayer = new LocalPlayer('Sara');
    const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chat };
    const debug = new DebugCmd(defaultParams);

    it('should create an instance', () => {
        expect(debug).toBeTruthy();
    });

    it('should call invertDebugState from chatDisplayService', () => {
        const spy = spyOn(chat, 'invertDebugState');
        debug.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('createDebugCmd should create an instance', () => {
        expect(createDebugCmd(defaultParams)).toBeTruthy();
    });
});
