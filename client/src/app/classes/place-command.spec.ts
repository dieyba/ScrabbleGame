import { createPlaceCmd, PlaceCmd } from '@app/classes/place-command';
import { GameService } from '@app/services/game.service';
import { ChatEntryColor, createErrorEntry } from './chat-display-entry';
import { DefaultCommandParams, PlaceParams } from './commands';
import { ErrorType } from './errors';
import { GameParameters } from './game-parameters';
import { Player } from './player';
import { Axis } from './utilities';
import { Vec2 } from './vec2';

const PLAYER_NAME = 'Sara';
const OPPONENT_NAME = 'Not Sara';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('PlaceCmd', () => {
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let place: PlaceCmd;
    const localPlayer = new Player(PLAYER_NAME);
    const opponentPlayer = new Player(OPPONENT_NAME);
    const placeParams: PlaceParams = { position: new Vec2(7, 7), orientation: Axis.H, word: 'word' };

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['place']);
        gameServiceSpy.game = new GameParameters();
        gameServiceSpy.game.players = [localPlayer, opponentPlayer];
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        place = new PlaceCmd(defaultParams, placeParams);
    });

    it('should create an instance', () => {
        expect(place).toBeTruthy();
    });

    it('should call place from game service', async () => {
        place.execute();
        expect(gameServiceSpy.place).toHaveBeenCalled();
    });

    it('should execute and return successful command message from local player', async () => {
        gameServiceSpy.place.and.returnValue(Promise.resolve(ErrorType.NoError));
        const localPlayerEntry = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !placer h8h word' };
        place.player.isActive = true;
        const executionResult = await place.execute();
        return expect(executionResult).toEqual({ isExecuted: true, executionMessages: [localPlayerEntry] });
    });

    it('should execute and return successful command message from opponent player', async () => {
        gameServiceSpy.place.and.returnValue(Promise.resolve(ErrorType.NoError));
        const opponentPlayerEntry = { color: ChatEntryColor.RemotePlayer, message: OPPONENT_NAME + ' >> !placer h8h word' };
        place.player = opponentPlayer;
        place.player.isActive = true;
        const executionResult = await place.execute();
        expect(executionResult).toEqual({ isExecuted: true, executionMessages: [opponentPlayerEntry] });
    });

    it('should execute and return impossible command error', async () => {
        gameServiceSpy.place.and.returnValue(Promise.resolve(ErrorType.ImpossibleCommand));
        const errorEntry = createErrorEntry(ErrorType.ImpossibleCommand, '!placer h8h word');
        place.player = opponentPlayer;
        place.player.isActive = false;
        const executionResult = await place.execute();
        expect(executionResult).toEqual({ isExecuted: false, executionMessages: [errorEntry] });
    });

    it('createPlaceCmd should create an instance', () => {
        expect(
            createPlaceCmd({
                defaultParams: { player: localPlayer, serviceCalled: gameServiceSpy },
                specificParams: placeParams,
            }),
        ).toBeTruthy();
    });
});
