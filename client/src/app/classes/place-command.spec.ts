import { TestBed } from '@angular/core/testing';
import { LocalPlayer } from '@app/classes/local-player';
import { createPlaceCmd, PlaceCmd } from '@app/classes/place-command';
import { GameService } from '@app/services/game.service';
import { SoloGameService } from '@app/services/solo-game.service';
import { ChatEntryColor, createErrorEntry } from './chat-display-entry';
import { DefaultCommandParams, PlaceParams } from './commands';
import { ErrorType } from './errors';
import { GameParameters, GameType } from './game-parameters';
import { Axis } from './utilities';
import { Vec2 } from './vec2';

const PLAYER_NAME = 'Sara';
const OPPONENT_NAME = 'Not Sara';

fdescribe('PlaceCmd', () => {
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let soloGameServiceSpy: jasmine.SpyObj<SoloGameService>;
    let localPlayer = new LocalPlayer(PLAYER_NAME);
    let opponentPlayer = new LocalPlayer(OPPONENT_NAME);
    const placeParams: PlaceParams = { position: new Vec2(7, 7), orientation: Axis.H, word: 'word' };

    beforeEach(async () => {
        soloGameServiceSpy = jasmine.createSpyObj('SoloGameService', ['place']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializeGameType']);

        TestBed.configureTestingModule({
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: SoloGameService, useValue: soloGameServiceSpy }
            ],
        });
        gameServiceSpy.currentGameService = soloGameServiceSpy;
        gameServiceSpy.currentGameService.place = soloGameServiceSpy.place.and.returnValue(Promise.resolve(ErrorType.NoError));;
        gameServiceSpy.currentGameService.game = new GameParameters(LocalPlayer.name, 0, false);
        gameServiceSpy.currentGameService.game.localPlayer = localPlayer;
        gameServiceSpy.currentGameService.game.opponentPlayer = opponentPlayer;
    });


    it('should create an instance', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        const place = new PlaceCmd(defaultParams, placeParams);
        expect(place).toBeTruthy();
    });

    it('should call place from solo game service', async () => {
        gameServiceSpy.initializeGameType(GameType.Solo);
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        const place = new PlaceCmd(defaultParams, placeParams);
        place.execute();
        expect(gameServiceSpy.currentGameService.place).toHaveBeenCalled();
    });

    it('should execute and return successful command message from local player', async () => {
        gameServiceSpy.initializeGameType(GameType.Solo);
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        const localPlayerEntry = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + " >> !placer h8h word" };
        const place = new PlaceCmd(defaultParams, placeParams);
        place.player.isActive = true;
        soloGameServiceSpy.place.and.returnValue(Promise.resolve(ErrorType.NoError));
        const executionResult = await place.execute();
        return expect(executionResult).toEqual({ isExecuted: true, executionMessages: [localPlayerEntry] });
    });

    it('should execute and return successful command message from opponent player', async () => {
        gameServiceSpy.initializeGameType(GameType.Solo);
        const defaultParams: DefaultCommandParams = { player: opponentPlayer, serviceCalled: gameServiceSpy };
        const opponentPlayerEntry = { color: ChatEntryColor.RemotePlayer, message: OPPONENT_NAME + " >> !placer h8h word" };
        const place = new PlaceCmd(defaultParams, placeParams);
        place.player.isActive = true;
        const executionResult = await place.execute();
        expect(executionResult).toEqual({ isExecuted: true, executionMessages: [opponentPlayerEntry] });

    });

    it('should execute and return impossible command error', async () => {
        gameServiceSpy.initializeGameType(GameType.Solo);
        gameServiceSpy.currentGameService.place = soloGameServiceSpy.place.and.returnValue(Promise.resolve(ErrorType.ImpossibleCommand));
        const defaultParams: DefaultCommandParams = { player: opponentPlayer, serviceCalled: gameServiceSpy };
        const errorEntry = createErrorEntry(ErrorType.ImpossibleCommand, "!placer h8h word");
        const place = new PlaceCmd(defaultParams, placeParams);
        place.player.isActive = false;
        const executionResult = await place.execute();
        expect(executionResult).toEqual({ isExecuted: false, executionMessages: [errorEntry] });
    });

    it('createPlaceCmd should create an instance', () => {
        const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: gameServiceSpy };
        expect(createPlaceCmd({ defaultParams, specificParams: placeParams })).toBeTruthy();
    });
});
