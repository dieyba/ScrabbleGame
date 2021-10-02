import { ErrorType } from '@app/classes/errors';
import { LocalPlayer } from '@app/classes/local-player';
import { Command } from './commands';
import { Player } from './player';

describe('Commands', () => {
    class CommandTest extends Command {
        constructor(player: Player) {
            super(player);
        }

        execute() {
            return ErrorType.NoError;
        }
    }

    // class DefaultCommandParamsTest implements DefaultCommandParams {
    //     gameService: SoloGameService;
    //     isFromLocalPlayer: boolean;
    // }

    // const defaultCommandParams: DefaultCommandParamsTest = new DefaultCommandParamsTest();
    const player = new LocalPlayer('Erika');

    it('should ', () => {
        expect(new CommandTest(player)).toBeTruthy();
    });
});
