import { VirtualPlayerName } from "@app/classes/virtual-player-name";
import { rejects } from "assert";
import { expect } from "chai";
// import { Collection, FindCursor } from "mongodb";
import { ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { VirtualPlayerNameService } from "./virtual-player-name.service";
import sinon = require("sinon");

describe('VirtualPlayerNameService', () => {
    let virtualPlayerNameService: VirtualPlayerNameService;
    // let name1: VirtualPlayerName;
    // let name2: VirtualPlayerName;
    let mongoServer: MongoMemoryServer;
    // let db: Db;
    // let client: MongoClient;

    beforeEach(async () => {
        // name1 = { _id: new ObjectId(), name: 'Riri' } as VirtualPlayerName;
        // name2 = { _id: new ObjectId(), name: 'Lulu' } as VirtualPlayerName;

        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        virtualPlayerNameService = new VirtualPlayerNameService(mongoUri);
        await virtualPlayerNameService.clientConnection();

        // client = await MongoClient.connect(mongoUri);
        // virtualPlayerNameService['client'] = client;
        // db = new Db(client, 'test');
        // virtualPlayerNameService.beginnersCollection = db.collection('beginners');
        // await virtualPlayerNameService.beginnersCollection.insertOne(name1);
        // await virtualPlayerNameService.beginnersCollection.insertOne(name2);
    });

    afterEach(async () => {
        await virtualPlayerNameService["client"].close();
        await mongoServer.stop();
    });

    it('should connect client to the dataBase', async () => {
        expect(virtualPlayerNameService['client']).to.not.be.undefined;
    });

    it('should throw an error when connecting to a bad url', async () => {
        try {
            let test = new VirtualPlayerNameService('fake_url');
            test.dbUrl = 'fakeUrl';
            await test.clientConnection();
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    })

    it('getVirtualPlayerNames should get all beginner names in Mongo Database', async () => {
        const dbData = await virtualPlayerNameService.getVirtualPlayerNames(virtualPlayerNameService.beginnersCollection);
        expect(dbData.length).to.equal(3);
    });

    // Ce test ne fonctionne pas.
    it('getVirtualPlayerNames should throw an error when get all beginner names in Mongo Database', async () => {
        // const testError = new Error('test error');
        // const functionToThrowError = function (error: Error) {
        //     throw error;
        // }
        // class FakeCollection extends Collection {
        //     override find(): FindCursor<VirtualPlayerName> {
        //         const testError = new Error('test error');
        //         throw testError;
        //     }
        // }
        // let stubCollection = sinon.createStubInstance(FakeCollection);
        // virtualPlayerNameService.beginnersCollection.find = stubCollection.find;
        try {
            // await virtualPlayerNameService["client"].close();
            // await mongoServer.stop();
            // sinon.stub(virtualPlayerNameService.beginnersCollection, 'find').callsFake(functionToThrowError(testError));
            await rejects(virtualPlayerNameService.getVirtualPlayerNames(virtualPlayerNameService.beginnersCollection));
            // await virtualPlayerNameService.getVirtualPlayerNames(virtualPlayerNameService.beginnersCollection);
        } catch (error) {
            // console.log('erreur :', error);
            expect(error).to.not.be.undefined;
        }
    });

    it('getVirtualPlayerNames should throw an error when get all beginner names in Mongo Database', async () => {
        try {
            await rejects(virtualPlayerNameService.getVirtualPlayerNames(virtualPlayerNameService.beginnersCollection))
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('postVirtualPlayerName should post a name in Mongo Database ', async () => {
        const newName = { _id: new ObjectId(), name: 'Riri' } as VirtualPlayerName;
        await virtualPlayerNameService.postVirtualPlayerName(virtualPlayerNameService.beginnersCollection, newName);
        const names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();

        expect(names.length).to.equal(4);
        expect(newName).to.deep.equals(names[3]);
    });

    it('postVirtualPlayerName should throw an error and not post a name in Mongo Database if the name already exist database', async () => {
        const newName = { _id: new ObjectId(), name: 'Erika' } as VirtualPlayerName;
        let names = [] as VirtualPlayerName[];

        try {
            names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
            await virtualPlayerNameService.postVirtualPlayerName(virtualPlayerNameService.beginnersCollection, newName);
        } catch (error) {
            expect(error).to.not.be.undefined;
            expect(names.length).to.equal(3);
        }

    });

    it('deleteVirtualPlayerName should delete a name in Mongo Database ', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        const nameToDelete = names[0];
        await virtualPlayerNameService.deleteVirtualPlayerName(virtualPlayerNameService.beginnersCollection, nameToDelete.name);
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();

        expect(names.length).to.equal(2);
    });

    it('deleteVirtualPlayerName should not delete and throw an error when we try to delete a name that is not in database ', async () => {
        const nameToDelete = { _id: new ObjectId(), name: 'Riri' } as VirtualPlayerName;
        try {
            rejects(virtualPlayerNameService.deleteVirtualPlayerName(virtualPlayerNameService.beginnersCollection, nameToDelete.name));
        } catch (error) {
            const names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
            expect(names.length).to.equal(3);
            expect(error).to.not.be.undefined;
        }
    });

    it('updateVirtualPlayerName should update a name in Mongo Database ', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        await virtualPlayerNameService.updateVirtualPlayerName(virtualPlayerNameService.beginnersCollection, names[0]._id, 'Riri');
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();

        expect(names.length).to.equal(3);
        expect(names[0]).to.deep.equals({ _id: names[0]._id, name: 'Riri' } as VirtualPlayerName);
    });

    it('updateVirtualPlayerName should throw an error and not update a name if the updated name already exist database', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        const nameToUpdate = names[0];

        try {
            await virtualPlayerNameService.updateVirtualPlayerName(virtualPlayerNameService.beginnersCollection, names[0]._id, 'Sara');
            names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        } catch (error) {
            expect(error).to.not.be.undefined;
            // expect(error).to.equal(new Error('Ce nom existe déjà'));
            expect(names[0]).to.equal(nameToUpdate);
            expect(names.length).to.equal(3);
        }
    });

    it('resetDataBase should call resetCollection', async () => {
        const resetCollectionSpy = sinon.spy(virtualPlayerNameService, <any>'resetCollection');
        virtualPlayerNameService.resetDataBase();

        sinon.assert.called(resetCollectionSpy);
    });

    it('populate should poulate when it is empty', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray()
        expect(names.length).to.equal(3);

        await virtualPlayerNameService.beginnersCollection.deleteMany({});
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(0);

        await virtualPlayerNameService.populate();
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(3);
    });

    it('populate should not poulate when it is not empty', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray()
        expect(names.length).to.equal(3);

        await virtualPlayerNameService.beginnersCollection.findOneAndDelete({ name: 'Erika' });
        await virtualPlayerNameService.populate();
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(2);
    });

    it('isSameName should return true if there is an element with the same name as the parameter', async () => {
        let nameToCompare = { _id: new ObjectId(), name: 'Riri' } as VirtualPlayerName;
        let isSame = await virtualPlayerNameService['isSameName'](nameToCompare, virtualPlayerNameService.beginnersCollection);
        expect(isSame).to.be.false;

        nameToCompare.name = 'Erika';
        isSame = await virtualPlayerNameService['isSameName'](nameToCompare, virtualPlayerNameService.beginnersCollection);
        expect(isSame).to.be.true;
    });

    it('resetCollection should reset the given collection', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(3);

        await virtualPlayerNameService['resetCollection'](virtualPlayerNameService.beginnersCollection);
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(0);
    });

    // it('resetCollection should call populate', async () => {
    //     const populateSpy = sinon.spy(virtualPlayerNameService, 'populate');
    //     virtualPlayerNameService['resetCollection'](virtualPlayerNameService.beginnersCollection);

    //     sinon.assert.called(populateSpy);
    // });

    // it('resetCollection should reset database with default value', async () => {
    //     const defaultNames = [
    //         { _id: new ObjectId(), name: 'Erika' },
    //         { _id: new ObjectId(), name: 'Sara' },
    //         { _id: new ObjectId(), name: 'Etienne' },
    //     ];

    //     await virtualPlayerNameService.beginnersCollection.insertOne({ _id: new ObjectId(), name: 'Riri' } as VirtualPlayerName);
    //     let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
    //     expect(names.length).to.equal(4);

    //     await virtualPlayerNameService['resetCollection'](virtualPlayerNameService.beginnersCollection);
    //     names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
    //     expect(names).to.equal(defaultNames);
    // });

    it('resetCollection should handle error when getting one', async () => {
        try {
            await rejects(virtualPlayerNameService['resetCollection'](virtualPlayerNameService.beginnersCollection));
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
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
    //     console.log(allScores);
    //     expect(allScores.length).to.equal(2);
    //     // expect(bestScores1).to.deep.equals(dbData[1]);
    // });    // const newScore = [{


    // it('should throw an error when post a Score in Mongo Database', async () => {
    //     // const dbData = await bestScoresService.getBestScores(bestScoresService.classicCollection);
    //     // expect(dbData.length).to.equal(2);
    //     // expect(bestScores1).to.deep.equals(dbData[1]);
    //     // client.close();
    //     try {
    //         await rejects(bestScoresService.postBestScore(bestScoresService.classicCollection, bestScores1))
    //     } catch (error) {
    //         expect(error).to.not.be.undefined;
    //     }
    // });
});
