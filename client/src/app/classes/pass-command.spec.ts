import { DefaultCommandParams } from '@app/classes/commands';
import { createPassCmd, PassTurnCmd } from '@app/classes/pass-command';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';

describe('PassTurnCmd', () => {
    let rack = new RackService();
    let grid = new GridService();
    let service = new SoloGameService(grid, rack);
    let defaultParams: DefaultCommandParams = { gameService: service, isFromLocalPlayer: true };
    let passTurn = new PassTurnCmd(defaultParams);

    it('should create an instance', () => {
        expect(passTurn).toBeTruthy();
    });

    it('should call passTurn from soloGameService', () => {
        const spy = spyOn(service, 'passTurn');
        passTurn.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('createPassCmd should create an instance', () => {
        expect(createPassCmd(defaultParams)).toBeTruthy();
    });
});
