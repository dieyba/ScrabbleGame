import { DefaultCommandParams } from '@app/classes/commands';
import { createPassCmd, PassTurnCmd } from '@app/classes/pass-command';
import { SoloGameService } from '@app/services/solo-game.service';

describe('PassTurnCmd', () => {
    class DefaultCommandParamsTest implements DefaultCommandParams {
        gameService: SoloGameService;
        isFromLocalPlayer: boolean;
    }

    let defaultParams = new DefaultCommandParamsTest();

    it('should create an instance', () => {
        expect(new PassTurnCmd(defaultParams)).toBeTruthy();
    });

    it('createPassCmd should create an instance', () => {
        expect(createPassCmd(defaultParams)).toBeTruthy();
    });
});
