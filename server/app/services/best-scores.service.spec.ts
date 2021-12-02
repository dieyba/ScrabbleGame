import { BestScores } from "@app/classes/best-scores";
import { ObjectId } from "bson";
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
            _id: new ObjectId(),
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
        await bestScoresService.connectClient();
        // await bestScoresService.connectClient()
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
        // await bestScoresService["client"].close();
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
        // await bestScoresService.connectClient(); 
        expect(bestScoresService["client"]).to.not.be.undefined;
        // expect(bestScoresService["db"].databaseName).to.equal("database");
        // } catch (error) {
        //     expect(error).to.not.be.undefined;
        // }
    });

    it('should throw an error when connecting to a bad url', async () => {
        try {
            bestScoresService.dbUrl = '**';
            bestScoresService.connectClient();
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

    // it('should throw an error when get all Scores in Mongo Database', async () => {

    //     const fakeCollectionType = {
    //         find: (paramFind: any) => ({
    //             sort: (paramSort: any) => {
    //                 return {
    //                     toArray: () => {
    //                         return {
    //                             then: (paramThen: any) => {
    //                                 return {
    //                                     catch: (fun: (error: Error) => void) => {
    //                                         fun(new Error(""));
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         })

    //     } as Collection<BestScores>;
    //     try {
    //         await bestScoresService.getBestScores(fakeCollectionType);
    //     } catch (error) {
    //         expect(error).to.not.be.undefined;
    //     }
    // });

    it('should only post score of player if already in db with a higher score than the min in Mongo Database ', async () => {
        const newScore = {
            _id: new ObjectId(),
            playerName: 'Sara',
            score: 20,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.findIndex(scoreIndex => scoreIndex.score === newScore.score)).to.greaterThan(-1);
    });
    it('should delete min score and post new score in Mongo Database if score is High', async () => {
        const newScore = {
            playerName: 'Dieyba',
            score: 200,
        } as BestScores;
        let scoreBeforePost = await bestScoresService.classicCollection.find({}).toArray();
        const minScore = scoreBeforePost[4];
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let scoreAfterPost = await bestScoresService.classicCollection.find({}).toArray();
        expect(scoreAfterPost.length).to.equal(5);
        expect(minScore).to.not.equals(scoreAfterPost[4]);
    });
    it('should not post a Score in Mongo Database if player is not eligible', async () => {
        const newScore = {
            playerName: 'Dieyba',
            score: -200,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(5);
        expect(allScores.indexOf(newScore)).to.equal(-1);
    });

    it('should not post a Score in Mongo Database if player is already in with same score', async () => {
        const newScore = {
            playerName: 'Sara',
            score: 8,
        } as BestScores;
        await bestScoresService.postBestScore(bestScoresService.classicCollection, newScore);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(5);
    });

    it('should not populateDB when its not empty', async () => {
        const newScore = [{
            playerName: 'Dieyba',
            score: -200,
        }] as BestScores[];
        await bestScoresService.populateDB(newScore, DATABASE_COLLECTION[0]);
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(5);
    });
    // it('should reset db with default value', async () => {
    //     const newScore = [{
    //         playerName: 'Erika',
    //         score: 1,
    //     },
    //     {
    //         playerName: 'Sara',
    //         score: 8,
    //     },
    //     {
    //         playerName: 'Dieyba',
    //         score: 200,
    //     }] as BestScores[];
    //     await bestScoresService.resetCollectionInDb(bestScoresService.classicCollection, newScore, DATABASE_COLLECTION[0]);
    //     let allScores = await bestScoresService.classicCollection.find({}).toArray();
    //     expect(allScores.length).to.equal(3);

    //     // expect(bestScores1).to.deep.equals(dbData[1]);
    // });

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
        let allScores = await bestScoresService.classicCollection.find({}).toArray();
        bestScoresService.defaultClassicBestScoresValue = newScore
        await bestScoresService.resetDataBase();
        allScores = await bestScoresService.classicCollection.find({}).toArray();
        expect(allScores.length).to.equal(3);
    });
});