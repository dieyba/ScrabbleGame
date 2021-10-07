import { DefaultCommandParams, PlaceParams } from '@app/classes/commands';
import { BonusService } from '@app/services/bonus.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { ValidationService } from '@app/services/validation.service';
import { WordBuilderService } from '@app/services/word-builder.service';
import { LocalPlayer } from './local-player';
import { createPlaceCmd, PlaceCmd } from './place-command';
import { Vec2 } from './vec2';

describe('PlaceCmd', () => {
    const playerchoice = new LocalPlayer('dieyna');
    const rack = new RackService();
    const grid = new GridService();
    const bonus = new BonusService(grid);
    const validation = new ValidationService(grid, bonus);
    const wordBuilder = new WordBuilderService();
    const service = new SoloGameService(grid, rack, validation, wordBuilder);
    const defaultParams: DefaultCommandParams = { player: playerchoice, serviceCalled: service };
    const specificParams: PlaceParams = { position: new Vec2(), orientation: 'est', word: 'testword' };
    const place = new PlaceCmd(defaultParams, specificParams);

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
