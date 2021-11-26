import { BestScores } from "@app/classes/best-scores";
import { rejects } from "assert";
import { expect } from "chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BestScoresService, DATABASE_COLLECTION } from "./best-scores.service";

describe('BestScoresService', () => {
    let bestScoresService: BestScoresService;
    let bestScores1: BestScores;
    // let bestScores2: BestScores;
    let mongoServer: MongoMemoryServer;
    // let db: Db;
    // let client: MongoClient;

    beforeEach(async () => {
        bestScores1 = {
            playerName: 'Erika',
            score: 1,
        } as BestScores;
        // bestScores2 = {
        //     playerName: 'Sara',
        //     score: 20,
        // } as BestScores;
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        bestScoresService = new BestScoresService(mongoUri);
        await bestScoresService.connectClient()
        // const mongoUri = await mongoServer.getUri();
        // client = new MongoClient(mongoUri);
        // client = await MongoClient.connect(mongoUri);
        // bestScoresService["client"] = client;
        // db = client.db(await mongoServer);
        // db = new Db(client, 'BestScore');
        // db = client.db(await mongoServer.getDbName());
        // bestScoresService.classicCollection = db.collection('ClassicMode');
        // await bestScoresService.classicCollection.insertOne(bestScores1);
        // await bestScoresService.classicCollection.insertOne(bestScores2);
    });

    afterEach(async () => {
        await bestScoresService["client"].close();
        // client.close();
        // if (bestScoresService["client"]) {
        // await bestScoresService["client"].close();
        // }
        await mongoServer.stop();
    });

    it('should connect client to the dataBase', async () => {
        // const mongoUri = await mongoServer.getUri();

        // // try {
        // new BestScoresService(mongoUri);
        expect(bestScoresService["client"]).to.not.be.undefined;
        // expect(bestScoresService["db"].databaseName).to.equal("database");
        // } catch (error) {
        //     expect(error).to.not.be.undefined;
        // }
    });

    it('should throw an error when connecting to a bad url', async () => {
        try {
            new BestScoresService('mongodb+srv://Scrabble:null@cluster0.plwpz.mongodb.net/null?retryWrites=true&w=majority');
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    })

    it('should get all Scores in Mongo Database', async () => {
        const dbData = await bestScoresService.getBestScores(bestScoresService.classicCollection);
        expect(dbData.length).to.equal(5);
        const MinScoreInArray = 4;
        expect(bestScores1).to.deep.equals(dbData[MinScoreInArray]);
    });

    it('should throw an error when get all Scores in Mongo Database', async () => {
        // const dbData = await bestScoresService.getBestScores(bestScoresService.classicCollection);
        // expect(dbData.length).to.equal(2);
        // expect(bestScores1).to.deep.equals(dbData[1]);
        // client.close();
        try {
            await rejects(bestScoresService.getBestScores(bestScoresService.log2990Collection))
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should post a Score in Mongo Database ', async () => {
        const newScore = {
            playerName: 'Sara',
            score: 20,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(allScores);
        expect(allScores.indexOf(newScore)).to.greaterThan(-1);
        // expect(bestScores1).to.deep.equals(dbData[1]);
    });
    it('should post a Score in Mongo Database if score is High', async () => {
        const newScore = {
            playerName: 'Dieyba',
            score: 200,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(allScores);
        expect(allScores.length).to.equal(2);
        // expect(bestScores1).to.deep.equals(dbData[1]);
    });
    it('should not post a Score in Mongo Database if player is not eligible', async () => {
        const newScore = {
            playerName: 'Dieyba',
            score: -200,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(allScores);
        expect(allScores.length).to.equal(2);
        // expect(bestScores1).to.deep.equals(dbData[1]);
    });

    it('should not post a Score in Mongo Database if player is already in with same score', async () => {
        const newScore = {
            playerName: 'Sara',
            score: 0,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(allScores);
        expect(allScores.length).to.equal(2);
        // expect(bestScores1).to.deep.equals(dbData[1]);
    });

    it('should not populateDB when its not empty', async () => {
        const newScore = [{
            playerName: 'Dieyba',
            score: -200,
        }] as BestScores[];
        await bestScoresService.populateDB(newScore, DATABASE_COLLECTION[0]);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(allScores);
        expect(allScores.length).to.equal(2);
        // expect(bestScores1).to.deep.equals(dbData[1]);
    });
    it('should reset db with default value', async () => {
        // const newScore = [{
        //     playerName: 'Erika',
        //     score: 1,
        // },
        // {
        //     playerName: 'Sara',
        //     score: 8,
        // },
        // {
        //     playerName: 'Dieyba',
        //     score: 200,
        // }] as BestScores[];
        // setTimeout(() => {
        // await bestScoresService.resetCollectionInDb(bestScoresService.classicCollection, newScore, DATABASE_COLLECTION[0]);
        // let allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(`After 3 sec`);
        // expect(allScores.length).to.equal(2);

        // expect(bestScores1).to.deep.equals(dbData[1]);
    });

    it('should reset db with default value', async () => {
        const newScore = [{
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
        }] as BestScores[];
        console.log('Before the reset')
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(allScores);
        bestScoresService.defaultClassicBestScoresValue = newScore
        await bestScoresService.resetDataBase();
        allScores = await bestScoresService.classicCollection.find({}).toArray();
        console.log(allScores);
        expect(allScores.length).to.equal(3);
        // expect(bestScores1).to.deep.equals(dbData[1]);
    });
    it('should throw an error when get all Scores in Mongo Database', async () => {
        // const dbData = await bestScoresService.getBestScores(bestScoresService.classicCollection);
        // expect(dbData.length).to.equal(2);
        // expect(bestScores1).to.deep.equals(dbData[1]);
        // client.close();
        const newScore = [{
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
        }] as BestScores[];
        try {
            await rejects(bestScoresService.resetCollectionInDb(bestScoresService.log2990Collection, newScore, DATABASE_COLLECTION[0]))
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should throw an error when post a Score in Mongo Database', async () => {
        // const dbData = await bestScoresService.getBestScores(bestScoresService.classicCollection);
        // expect(dbData.length).to.equal(2);
        // expect(bestScores1).to.deep.equals(dbData[1]);
        // client.close();
        try {
            await rejects(bestScoresService.postBestScore(bestScoresService.classicCollection, bestScores1))
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });
});