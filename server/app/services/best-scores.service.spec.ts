import { BestScores } from '@app/classes/best-scores';
import { ObjectId } from 'bson';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BestScoresService, DATABASE_COLLECTION } from './best-scores.service';
/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
describe('BestScoresService', () => {
    let bestScoresService: BestScoresService;
    let bestScores1: BestScores;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        bestScores1 = {
            _id: new ObjectId(),
            playerName: 'Erika',
            score: 1,
        } as BestScores;
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        bestScoresService = new BestScoresService(mongoUri);
        await bestScoresService.connectClient();
    });

    afterEach(async () => {
        await mongoServer.stop();
    });

    it('should connect client to the dataBase', async () => {
        expect(bestScoresService['client']).to.not.equals(undefined);
    });

    it('should throw an error when connecting to a bad url', async () => {
        try {
            bestScoresService.dbUrl = '**';
            bestScoresService.connectClient();
        } catch (error) {
            expect(error).to.not.equals(undefined);
        }
    });

    it('should get all Scores in Mongo Database', async () => {
        const dbData = await bestScoresService.getBestScores(bestScoresService.classicCollection);
        expect(dbData.length).to.equal(5);
        const minScoreInArray = 4;
        expect(bestScores1).to.deep.equals(dbData[minScoreInArray]);
    });

    it('should only post score of player if already in db with a higher score than the min in Mongo Database ', async () => {
        const newScore = {
            _id: new ObjectId(),
            playerName: 'Sara',
            score: 20,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        const allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.findIndex((scoreIndex) => scoreIndex.score === newScore.score)).to.greaterThan(-1);
    });
    it('should delete min score and post new score in Mongo Database if score is High', async () => {
        const newScore = {
            playerName: 'Dieyba',
            score: 200,
        } as BestScores;
        const scoreBeforePost = await bestScoresService.classicCollection.find({}).toArray();
        const minScore = scoreBeforePost[4];
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        const scoreAfterPost = await bestScoresService.classicCollection.find({}).toArray();
        expect(scoreAfterPost.length).to.equal(5);
        expect(minScore).to.not.equals(scoreAfterPost[4]);
    });
    it('should not post a Score in Mongo Database if player is not eligible', async () => {
        const newScore = {
            playerName: 'Dieyba',
            score: -200,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        const allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(5);
        expect(allScores.indexOf(newScore)).to.equal(-1);
    });

    it('should not post a Score in Mongo Database if player is already in with same score', async () => {
        const newScore = {
            playerName: 'Sara',
            score: 8,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        const allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(5);
    });

    it('should not populateDB when its not empty', async () => {
        const newScore = [
            {
                playerName: 'Dieyba',
                score: -200,
            },
        ] as BestScores[];
        await bestScoresService.populateDB(newScore, DATABASE_COLLECTION[0]);
        const allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(5);
    });

    it('should reset db with default value', async () => {
        const newScore = [
            {
                playerName: 'Erika',
                score: 1,
            },
            {
                playerName: 'Sara',
                score: 8,
            },
            {
                playerName: 'Dieyba',
                score: 200,
            },
        ] as BestScores[];
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        bestScoresService.defaultClassicBestScoresValue = newScore;
        await bestScoresService.resetDataBase();
        allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(3);
    });
});
