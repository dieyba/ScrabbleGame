import { LocalPlayer } from '@app/classes/local-player';
import { Command, CommandResult } from './commands';

describe('Commands', () => {
    class CommandTest extends Command {
        execute(): CommandResult {
            return { isExecuted: true, executionMessages: [] };
        }
    }
    const player = new LocalPlayer('Erika');

    it('should ', () => {
        expect(new CommandTest(player)).toBeTruthy();
    });
});
