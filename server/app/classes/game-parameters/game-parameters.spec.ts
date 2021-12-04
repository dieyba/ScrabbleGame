import { expect } from 'chai';
import { DictionaryType } from '../dictionary/dictionary';
import { Player } from '../player/player';
import { GameInitInfo, GoalType } from './game-parameters';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('GameParameters', () => {
    let goals = new Array<GoalType>();
    goals = [4, 7];
    const gameWaiting = {
        gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
        creatorName: 'Dieyba',
        joinerName: 'Erika',
        dictionaryType: DictionaryType.Default,
        totalCountDown: 60,
        isRandomBonus: false,
        gameMode: 2,
        isLog2990: false,
    };
    const game = new GameInitInfo(gameWaiting);
    it('should create a game parameters', () => {
        expect(game).to.not.equal(undefined);
    });

    it('should pick different shared Goals', () => {
        game.pickSharedGoals(goals);
        expect(game.sharedGoals.length).to.equal(2);

    })

    it('should pick different shared Goals', () => {
        game.pickSharedGoals(goals);
        expect(game.sharedGoals.length).to.equal(2);

    })

    it('getOtherPlayer should return the opponent in a room', () => {
        game.players[0].socketId = 'bd72eydbey';
        game.players[1].socketId = 'fbie4737d';
        expect(game.getOtherPlayerInRoom('bd72eydbey')).to.equal(game.players[1]);
        expect(game.getOtherPlayerInRoom('fbie4737d')).to.equal(game.players[0]);
    });

    it('getOtherPlayer should return the opponent in a room', () => {
        game.players.push(new Player('Dieyba', 'djefe'))
        expect(game.getOtherPlayerInRoom('bd72eydbey')).to.equal(undefined);
    });

    it('getPlayerBySocketId should return the opponent in a room', () => {
        game.players[0].socketId = 'bd72eydbey';
        expect(game.getPlayerBySocketId('bd72eydbey')).to.equal(game.players[0]);
    });

    it('remove player should return the removed player', () => {
        game.players[1].socketId = 'bd72eydbey';
        game.removePlayer('bd72eydbey')
        expect(game.players.length).to.equal(2);
    });
    it('remove player should return undefined', () => {
        game.removePlayer('bd72eydbey')
        expect(game.players.length).to.equal(2);
    });
});
