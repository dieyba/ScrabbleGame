import { createDebugCmd, DebugCmd } from '@app/classes/debug-command';
import { ChatDisplayService } from '@app/services/chat-display.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { DebugParams, DefaultCommandParams } from './commands';

describe('DebugCmd', () => {
    let chat = new ChatDisplayService();
    let rack = new RackService();
    let grid = new GridService();
    let service = new SoloGameService(grid, rack);
    const defaultParams: DefaultCommandParams = { gameService: service, isFromLocalPlayer: true };
    const specificParams: DebugParams = chat;
    let debug = new DebugCmd(defaultParams, chat);

    it('should create an instance', () => {
        expect(debug).toBeTruthy();
    });

    it('should call invertDebugState from chatDisplayService', () => {
        const spy = spyOn(chat, 'invertDebugState');
        debug.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('createDebugCmd should create an instance', () => {
        expect(createDebugCmd({ defaultParams, specificParams })).toBeTruthy();
    });
});
