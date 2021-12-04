/* disable-lint*/
import { DictionaryType } from '@app/classes/dictionary/dictionary';
import { GameInitInfo } from '@app/classes/game-parameters/game-parameters';
import { expect } from 'chai';
import { GameListManager } from './game-list-manager.service';
/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-unused-expressions */
/* eslint-disable  no-unused-expressions */
describe('GameListManager service', () => {
    let gameListMan: GameListManager;
    const gameClassic = {
        gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba', 'Erika'], creatorId: '', joinerId: '' },
        creatorName: 'Dieyba',
        joinerName: 'Erika',
        dictionaryType: DictionaryType.Default,
        totalCountDown: 60,
        isRandomBonus: false,
        gameMode: 2,
        isLog2990: false,
    };
    const gameLog2920 = {
        gameRoom: { idGame: 2, capacity: 2, playersName: ['Sara', 'Etienne'], creatorId: '', joinerId: '' },
        creatorName: 'Sara',
        joinerName: 'Etienne',
        dictionaryType: DictionaryType.Default,
        totalCountDown: 60,
        isRandomBonus: false,
        gameMode: 2,
        isLog2990: true,
    };
    const classicGameInPlay = new GameInitInfo(gameClassic)
    const log2990GameInPlay = new GameInitInfo(gameLog2920)
    beforeEach(async () => {
        gameListMan = new GameListManager();
        gameListMan['waitingAreaGames'].push(gameClassic)
        gameListMan['waitingAreaGames'].push(gameLog2920)
        gameListMan['gamesInPlay'].push(classicGameInPlay)
        gameListMan['gamesInPlay'].push(log2990GameInPlay)
    });
    it('should create gameListMan', () => {
        expect(gameListMan).to.exist;
        expect(gameListMan['waitingAreaGames'].length).to.be.equal(2);
        expect(gameListMan['gamesInPlay'].length).to.be.equal(2);
    });
    it('should return all Log2990Room in waitingArea', () => {
        const log2990Games = gameListMan.getAllWaitingAreaGames('true');
        expect(log2990Games.length).to.be.equal(1);
    });
    it('should return all ClassicRoom in waitingArea', () => {
        gameListMan['waitingAreaGames'].push(gameClassic)
        const log2990Games = gameListMan.getAllWaitingAreaGames('false');
        expect(log2990Games.length).to.be.equal(2);
    });
    it('should create a room', () => {
        gameListMan['currentId'] = 0
        const newGame = gameListMan.createWaitingAreaGame(gameClassic, 'dbfdhsdsnjs');
        expect(newGame.gameRoom.idGame).to.be.equal(0);
        expect(newGame.gameRoom.creatorId).to.be.equal('dbfdhsdsnjs');
        expect(newGame.gameRoom.playersName.length).to.be.equal(1);
        expect(gameListMan['waitingAreaGames'].length).to.be.equal(3);
    });
    it('getAWaitingAreaGame should return the right game with the given id ', () => {
        expect(gameListMan.getAWaitingAreaGame(2)).to.equal(gameLog2920);
    });
    it('getAWaitingAreaGame should return the right game with the given id ', () => {
        expect(gameListMan.getAWaitingAreaGame(4)).to.equal(undefined);
    });

    it('should add a new Joiner Player', () => {
        const newCreatedGame = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        };
        const newGame = gameListMan.addJoinerPlayer(newCreatedGame, 'Erika', 'hdsdufhnj', false);
        expect(newGame).to.be.equal(true);
        expect(newCreatedGame.joinerName).to.be.equal('Erika');
        expect(newCreatedGame.gameRoom.joinerId).to.be.equal('hdsdufhnj');
        expect(newCreatedGame.gameRoom.playersName.length).to.be.equal(2);
    });

    it('should remove a Joiner Player', () => {
        const newGame = gameListMan.removeJoinerPlayer(2);
        expect(newGame?.joinerName).to.be.equal('');
        expect(newGame?.gameRoom.joinerId).to.be.equal('');
        expect(newGame?.gameRoom.playersName.length).to.equal(1);
    });

    it('should not add a new Joiner Player', () => {
        const newGame = gameListMan.addJoinerPlayer(gameLog2920, 'Erika', 'hdsdufhnj', false);
        expect(newGame).to.be.equal(false);
    });

    it('removeJoinerPlayer should return undefined ', () => {
        expect(gameListMan.removeJoinerPlayer(4)).to.equal(undefined);
    });

    it('deleteWaitingAreaGame should delete a room ', () => {
        gameListMan.deleteWaitingAreaGame(2);
        expect(gameListMan['waitingAreaGames'].length).to.equal(1);
        expect(gameListMan.deleteWaitingAreaGame(2)).to.equal(undefined);
    });
    it('getGameInPlay should return the right', () => {
        const log2990Games = gameListMan.getGameInPlay(2);
        expect(log2990Games).to.be.equal(log2990GameInPlay);
    });

    it('getGameInPlay should return undefined', () => {
        const log2990Games = gameListMan.getGameInPlay(4);
        expect(log2990Games).to.be.equal(undefined);
    });

    it('should add a new game in play', () => {
        const newCreatedGame = {
            gameRoom: { idGame: 1, capacity: 2, playersName: ['Dieyba'], creatorId: '', joinerId: '' },
            creatorName: 'Dieyba',
            joinerName: '',
            dictionaryType: DictionaryType.Default,
            totalCountDown: 60,
            isRandomBonus: false,
            gameMode: 2,
            isLog2990: false,
        };
        const newGame = gameListMan.createGameInPlay(newCreatedGame);
        expect(newGame).to.not.equal(undefined);
        expect(gameListMan['gamesInPlay'].length).to.be.equal(3);
    });

    it('deleteWaitingAreaGame should delete a room ', () => {
        gameListMan.deleteGameInPlay(2);
        expect(gameListMan['gamesInPlay'].length).to.equal(1);
        expect(gameListMan.deleteGameInPlay(2)).to.equal(undefined);
    });

});
