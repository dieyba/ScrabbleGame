import { ChatDisplayEntry, ChatEntryColor } from '@app/classes/chat-display-entry/chat-display-entry';
import { Player } from '@app/classes/player/player';
import { Command, CommandResult } from './commands';

describe('Commands', () => {
    class CommandTest extends Command {
        execute() {
            const chat: ChatDisplayEntry[] = [{ color: ChatEntryColor.LocalPlayer, message: 'allo' }];
            const commandResult: CommandResult = { isExecuted: true, executionMessages: chat };
            return commandResult;
        }
    }
    const player = new Player('Erika');

    it('should create an instance', () => {
        expect(new CommandTest(player)).toBeTruthy();
    });
});
