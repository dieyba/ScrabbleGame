import { DefaultCommandParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { SoloGameService } from '@app/services/solo-game.service';
import { Command } from './commands';

describe('Commands', () => {
    class CommandTest extends Command {
        constructor(defaultCommandParams: DefaultCommandParams) {
            super(defaultCommandParams);
        }

        execute() {
            return ErrorType.NoError;
        }
    }

    class DefaultCommandParamsTest implements DefaultCommandParams {
        gameService: SoloGameService;
        isFromLocalPlayer: boolean;
    }

    const defaultCommandParams: DefaultCommandParamsTest = new DefaultCommandParamsTest();

    it('should ', () => {
        expect(new CommandTest(defaultCommandParams)).toBeTruthy();
    });
});
