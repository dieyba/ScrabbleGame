import { DefaultCommandParams, PlaceParams } from '@app/classes/commands';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { LocalPlayer } from './local-player';
import { createPlaceCmd, PlaceCmd } from './place-command';
import { Vec2 } from './vec2';

describe('PlaceCmd', () => {
    let playerchoice = new LocalPlayer('dieyna');
    let rack = new RackService();
    let grid = new GridService();
    let service = new SoloGameService(grid, rack);
    let defaultParams: DefaultCommandParams = { player: playerchoice, serviceCalled: service };
    const specificParams: PlaceParams = { position: new Vec2(), orientation: 'est', word: 'testword' };
    let place = new PlaceCmd(defaultParams, specificParams);

    it('should create an instance', () => {
        expect(place).toBeTruthy();
    });

    it('should call place from soloGameService', () => {
        const spy = spyOn(service, 'place');
        place.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('createPassCmd should create an instance', () => {
        expect(createPlaceCmd({ defaultParams, specificParams })).toBeTruthy();
    });
});
