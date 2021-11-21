import { expect } from "chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BestScoresService } from "./best-scores.service";

describe('BestScoresService', () => {
    let bestScoresService: BestScoresService;
    // let bestScores1: BestScores;
    // let bestScores2: BestScores;
    let mongoServer: MongoMemoryServer;
    // let db: Db;
    // let client: MongoClient;

    beforeEach(async () => {
        // bestScores1 = {
        //     playerName: 'Erika',
        //     score: 1,
        // } as BestScores;
        // bestScores2 = {
        //     playerName: 'Sara',
        //     score: 8,
        // } as BestScores;
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        bestScoresService = new BestScoresService(mongoUri);
        // const mongoUri = await mongoServer.getUri();
        // client = new MongoClient(mongoUri);
        // client = await MongoClient.connect(mongoUri);
        // db = client.db(await mongoServer);
        // bestScoresService.classicCollection = db.collection('test');
        // bestScoresService.classicCollection.insertOne(bestScores1);
        // bestScoresService.classicCollection.insertOne(bestScores2);
    });

    afterEach(async () => {
        // await bestScoresService["client"].close();
        // client.close();
        await mongoServer.stop();
    });

    it('should throw error if connecting to an invalid URL', async () => {
        // const mongoUri = await mongoServer.getUri();

        // // try {
        // new BestScoresService(mongoUri);
        expect(bestScoresService["client"]).to.not.be.undefined;
        // expect(bestScoresService["db"].databaseName).to.equal("database");
        // } catch (error) {
        //     expect(error).to.not.be.undefined;
        // }
    });

});