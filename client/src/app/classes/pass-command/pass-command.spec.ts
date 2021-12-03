import { createErrorEntry } from '@app/classes/chat-display-entry/chat-display-entry';
import { DefaultCommandParams } from '@app/classes/commands/commands';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters/game-parameters';
import { createPassCmd, PassTurnCmd } from '@app/classes/pass-command/pass-command';
import { Player } from '@app/classes/player/player';
import { GameService } from '@app/services/game.service/game.service';

const PLAYER_NAME = 'Sara';
const OPPONENT_NAME = 'Not Sara';

describe('PassTurnCmd', () => {
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let pass: PassTurnCmd;
    const localPlayer = new Player(PLAYER_NAME);
    const opponentPlayer = new Player(OPPONENT_NAME);

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['passTurn']);
        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.players = [localPlayer, opponentPlayer];
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        pass = new PassTurnCmd(defaultParams);
    });

    it('should create an instance', () => {
        expect(pass).toBeTruthy();
    });

    it('should call passTurn from game service', () => {
        pass.execute();
        expect(gameServiceSpy.passTurn).toHaveBeenCalled();
    });

    it('should execute and return successful result from local player', () => {
        gameServiceSpy.passTurn.and.returnValue(ErrorType.NoError);
        pass.player.isActive = true;
        expect(pass.execute()).toEqual({ isExecuted: true, executionMessages: [] });
    });

    it('should execute and return impossible command error from local player', () => {
        gameServiceSpy.passTurn.and.returnValue(ErrorType.ImpossibleCommand);
        const errorMessage = createErrorEntry(ErrorType.ImpossibleCommand, '!passer');
        pass.player.isActive = false;
        expect(pass.execute()).toEqual({ isExecuted: false, executionMessages: [errorMessage] });
    });
    it('should execute and return successful result from opponent player', () => {
        gameServiceSpy.passTurn.and.returnValue(ErrorType.NoError);
        pass.player = opponentPlayer;
        pass.player.isActive = true;
        expect(pass.execute()).toEqual({ isExecuted: true, executionMessages: [] });
    });

    it('should execute and return impossible command error from opponent player', () => {
        gameServiceSpy.passTurn.and.returnValue(ErrorType.ImpossibleCommand);
        const errorMessage = createErrorEntry(ErrorType.ImpossibleCommand, '!passer');
        pass.player = opponentPlayer;
        pass.player.isActive = false;
        expect(pass.execute()).toEqual({ isExecuted: false, executionMessages: [errorMessage] });
    });

    it('createDebugCmd should create an instance', () => {
        expect(createPassCmd({ player: localPlayer, serviceCalled: gameServiceSpy })).toBeTruthy();
    });
});
