import { DefaultCommandParams } from '@app/classes/commands';
import { createPassCmd, PassTurnCmd } from '@app/classes/pass-command';
import { BonusService } from '@app/services/bonus.service';
import { ChatDisplayService } from '@app/services/chat-display.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { ValidationService } from '@app/services/validation.service';
import { WordBuilderService } from '@app/services/word-builder.service';
import { LocalPlayer } from './local-player';

describe('PassTurnCmd', () => {
    const playerChoice = new LocalPlayer('dieyna');
    const rack = new RackService();
    const grid = new GridService();
    const bonus = new BonusService(grid);
    const validation = new ValidationService(grid, bonus);
    const wordBuilder = new WordBuilderService();
    const chatDisplay = new ChatDisplayService();
    const service = new SoloGameService(grid, rack, chatDisplay, validation, wordBuilder);
    const defaultParams: DefaultCommandParams = { player: playerChoice, serviceCalled: service };
    const passTurn = new PassTurnCmd(defaultParams);

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
