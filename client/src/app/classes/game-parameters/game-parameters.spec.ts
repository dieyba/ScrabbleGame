/* eslint-disable dot-notation */
import { Player } from '@app/classes/player/player';
import { ERROR_NUMBER } from '@app/classes/utilities/utilities';
import { GAME_CAPACITY } from '@app/components/game-init-form/game-init-form.component';
import { GameParameters } from './game-parameters';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('GameParameters', () => {
    const gameParameters = new GameParameters();
    const localPlayer = new Player('LocalPlayerName');
    const opponent = new Player('OpponentName');
    const localPlayerId = 0;
    const opponentPlayerId = 1;

    beforeEach(() => {
        gameParameters.players = [];
        gameParameters.setLocalAndOpponentId(localPlayerId, opponentPlayerId);
    });

    it('should create an instance', () => {
        expect(gameParameters).toBeTruthy();
    });

    it("should set the proper players' id", () => {
        expect(gameParameters['localPlayerIndex']).toEqual(localPlayerId);
        expect(gameParameters['opponentPlayerIndex']).toEqual(opponentPlayerId);
    });
    it('should set the local player', () => {
        gameParameters.setLocalPlayer(localPlayer);
        expect(gameParameters.players[localPlayerId]).toEqual(localPlayer);
    });
    it('should set the opponent player', () => {
        gameParameters.setOpponent(opponent);
        expect(gameParameters.players[opponentPlayerId]).toEqual(opponent);
    });
    it('should not set player if invalid player index', () => {
        // the max index to acces to the last player is GAME_CAPACITY - 1;
        gameParameters.setLocalAndOpponentId(ERROR_NUMBER, GAME_CAPACITY);
        gameParameters.setLocalPlayer(localPlayer);
        gameParameters.setOpponent(opponent);
        expect(gameParameters.players).toEqual([]);
    });
    it('should return the local player', () => {
        gameParameters.setLocalPlayer(localPlayer);
        expect(gameParameters.getLocalPlayer()).toEqual(localPlayer);
    });
    it('should return the opponent player', () => {
        gameParameters.setOpponent(opponent);
        expect(gameParameters.getOpponent()).toEqual(opponent);
    });
    it('should return undefined if the players were not set first', () => {
        expect(gameParameters.getLocalPlayer()).toBeUndefined();
        expect(gameParameters.getOpponent()).toBeUndefined();
    });
    it('should return undefined if the players have invalid id', () => {
        gameParameters.setLocalAndOpponentId(ERROR_NUMBER, GAME_CAPACITY);
        expect(gameParameters.getLocalPlayer()).toBeUndefined();
        expect(gameParameters.getOpponent()).toBeUndefined();
    });
});
