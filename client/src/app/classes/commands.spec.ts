import { LocalPlayer } from '@app/classes/local-player';
import { ChatDisplayEntry, ChatEntryColor } from './chat-display-entry';
import { Command, CommandResult } from './commands';

describe('Commands', () => {
    class CommandTest extends Command {
        execute() {
            let chat: ChatDisplayEntry[] = [{ color: ChatEntryColor.LocalPlayer, message: 'allo' }];
            let commandResult: CommandResult = { isExecuted: true, executionMessages: chat };
            return commandResult;
        }
    }
    const player = new LocalPlayer('Erika');

    it('should ', () => {
        expect(new CommandTest(player)).toBeTruthy();
    });
});
