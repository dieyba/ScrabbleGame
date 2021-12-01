/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { rejects } from 'assert';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { VirtualPlayerNameService } from './virtual-player-name.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sinon = require('sinon');

describe('VirtualPlayerNameService', () => {
    let virtualPlayerNameService: VirtualPlayerNameService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        virtualPlayerNameService = new VirtualPlayerNameService(mongoUri);
        await virtualPlayerNameService.clientConnection();
    });

    afterEach(async () => {
        await virtualPlayerNameService['client'].close();
        await mongoServer.stop();
    });

    it('should connect client to the dataBase', async () => {
        expect(virtualPlayerNameService['client']).to.not.equals(undefined);
    });

    it('should throw an error when connecting to a bad url', async () => {
        try {
            const test = new VirtualPlayerNameService('fake_url');
            test.dbUrl = 'fakeUrl';
            await test.clientConnection();
        } catch (error) {
            expect(error).to.not.equals(undefined);
        }
    });

    it('getVirtualPlayerNames should get all beginner names in Mongo Database', async () => {
        const dbData = await virtualPlayerNameService.getVirtualPlayerNames(virtualPlayerNameService.beginnersCollection);
        expect(dbData.length).to.equal(3);
    });

    it('getVirtualPlayerNames should throw an error when get all beginner names in Mongo Database', async () => {
        try {
            await rejects(virtualPlayerNameService.getVirtualPlayerNames(virtualPlayerNameService.beginnersCollection));
        } catch (error) {
            expect(error).to.not.equals(undefined);
        }
    });

    it('postVirtualPlayerName should post a name in Mongo Database ', async () => {
        const newName = { _id: new ObjectId(), name: 'Riri' } as VirtualPlayerName;
        await virtualPlayerNameService.postVirtualPlayerName(virtualPlayerNameService.beginnersCollection, newName);
        const names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        const tabLength = 4;

        expect(names.length).to.equal(tabLength);
        expect(newName).to.deep.equals(names[3]);
    });

    it('postVirtualPlayerName should throw an error and not post a name in Mongo Database if the name already exist database', async () => {
        const newName = { _id: new ObjectId(), name: 'Erika' } as VirtualPlayerName;
        let names = [] as VirtualPlayerName[];

        try {
            names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
            await virtualPlayerNameService.postVirtualPlayerName(virtualPlayerNameService.beginnersCollection, newName);
        } catch (error) {
            expect(error).to.not.equals(undefined);
            expect(names.length).to.equal(3);
        }
    });

    it('postVirtualPlayerName should handle an error when getting', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        const newName = { _id: new ObjectId(names[0]._id), name: 'Riri' } as VirtualPlayerName;

        try {
            await virtualPlayerNameService.postVirtualPlayerName(virtualPlayerNameService.beginnersCollection, newName);
            names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        } catch (error) {
            expect(error).to.not.equals(undefined);
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
            expect(error).to.not.equals(undefined);
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
            expect(error).to.not.equals(undefined);
            // console.log(error);
            // expect(error).to.equal(new Error('Ce nom existe déjà'));
            expect(names[0]).to.equal(nameToUpdate);
            expect(names.length).to.equal(3);
        }
    });

    it('resetDataBase should call resetCollection', async () => {
        /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
        const resetCollectionSpy = sinon.spy(virtualPlayerNameService, 'resetCollection' as any);
        virtualPlayerNameService.resetDataBase();

        sinon.assert.called(resetCollectionSpy);
    });

    it('populate should populate when it is empty', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(3);

        await virtualPlayerNameService.beginnersCollection.deleteMany({});
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(0);

        await virtualPlayerNameService.populate();
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(3);
    });

    it('populate should not populate when it is not empty', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(3);

        await virtualPlayerNameService.beginnersCollection.findOneAndDelete({ name: 'Erika' });
        await virtualPlayerNameService.populate();
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(2);
    });

    it('isSameName should return true if there is an element with the same name as the parameter', async () => {
        const nameToCompare = { _id: new ObjectId(), name: 'Riri' } as VirtualPlayerName;
        let isSame = await virtualPlayerNameService['isSameName'](nameToCompare, virtualPlayerNameService.beginnersCollection);
        expect(isSame).to.equals(false);

        nameToCompare.name = 'Erika';
        isSame = await virtualPlayerNameService['isSameName'](nameToCompare, virtualPlayerNameService.beginnersCollection);
        expect(isSame).to.equals(true);
    });

    it('resetCollection should reset the given collection', async () => {
        let names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(3);

        await virtualPlayerNameService['resetCollection'](virtualPlayerNameService.beginnersCollection);
        names = await virtualPlayerNameService.beginnersCollection.find({}).toArray();
        expect(names.length).to.equal(0);
    });
});
