// /* eslint-disable no-underscore-dangle */
// import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
// import { ObjectId } from 'bson';
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { ObjectId } from 'bson';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DATABASE_COLLECTION, DATABASE_NAME, DictionaryDBService } from './dictionary-db.service'; // DATABASE_COLLECTION
// import sinon = require('sinon');
/* eslint-disable  @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
describe('DictionaryDBService', () => {
    let dictionaryDBService: DictionaryDBService;
    // let dictionaryInterface: DictionaryInterface;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        // dictionaryInterface = {
        //     _id: new ObjectId(),
        //     title: 'dictionary title',
        //     description: 'dictionary description',
        //     words: ['words'],
        // } as DictionaryInterface;
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        dictionaryDBService = new DictionaryDBService(mongoUri);
        await dictionaryDBService.clientConnection();
    });

    afterEach(async () => {
        await mongoServer.stop();
    });

    it('should connect client to the dataBase', async () => {
        expect(dictionaryDBService['client']).to.not.equals(undefined);
    });

    it('should throw an error when connecting to a bad url', async () => {
        try {
            dictionaryDBService.dbUrl = '**';
            dictionaryDBService.clientConnection();
        } catch (error) {
            expect(error).to.not.equals(undefined);
        }
    });

    it('should get a dictionary in Mongo Database if the dictionary exist', async () => {
        const dictionaryMock = { _id: 0, title: 'MockTitle', description: 'MockDescription', words: ['MockWord'] } as unknown as DictionaryInterface;
        await dictionaryDBService.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(dictionaryMock);
        const dbData = await dictionaryDBService.getDictionary(dictionaryMock.title);
        expect(dbData).to.deep.equal(dictionaryMock);
    });

    it('should get all the dictionaries in Mongo Database', async () => {
        const dictionaryMock = { _id: 0, title: 'MockTitle', description: 'MockDescription', words: ['MockWord'] } as unknown as DictionaryInterface;
        await dictionaryDBService.client.db(DATABASE_NAME).collection(DATABASE_COLLECTION[0]).insertOne(dictionaryMock);
        const dbData = await dictionaryDBService.getAllDictionaryDescription();
        expect(dbData.length).to.equal(2);
        expect(dbData[1].title);
    });

    it('postDictionary should post if the dictionary is valid', async () => {
        // const isDictionaryValidSpy = sinon.spy(dictionaryDBService, 'isDictionaryValid');
        const dico: DictionaryInterface = {
            _id: new ObjectId(),
            title: 'Dieynaba',
            description: 'La plus jolie',
            words: [''],
        } as DictionaryInterface;
        await dictionaryDBService.postDictionary(dico);
        const allScores = await dictionaryDBService.dictionaryCollection.find({}).toArray();
        expect(allScores.length).to.equals(2);
    });
    it('should reset db with default value', async () => {
        await dictionaryDBService.reset();
        const allDico = await dictionaryDBService.dictionaryCollection.find({}).toArray();
        expect(allDico.length).to.equal(1);
    });

    it('postDictionary should throw an TypeError if the dictionary is not valid', async () => {
        const dico: DictionaryInterface = { _id: new ObjectId(), title: '', description: '', words: [''] } as DictionaryInterface;
        try {
            await dictionaryDBService.postDictionary(dico);
        } catch (error) {
            // const allScores = await dictionaryDBService.dictionaryCollection.find({}).toArray();
            // expect(allScores.length).to.equals(1);
            expect(error.message).to.equals("Le dictionnaire n'a pas un format valide");
        }
    });

    it('postDictionary should throw an TypeError if the dictionary is not unique', async () => {
        // const isDictionaryValidSpy = sinon.spy(dictionaryDBService, 'isDictionaryValid');
        const dico: DictionaryInterface = {
            _id: new ObjectId(),
            title: 'Mon dictionnaire',
            description: 'dfndf',
            words: [''],
        } as DictionaryInterface;
        try {
            await dictionaryDBService.postDictionary(dico);
        } catch (error) {
            // const allScores = await dictionaryDBService.dictionaryCollection.find({}).toArray();
            // expect(allScores.length).to.equals(1);
            expect(error.message).to.equals('Un dictionnaire avec le même nom existe déjà');
        }
    });

    it('updateDictionary should update if the title is different', async () => {
        let allDico = await dictionaryDBService.dictionaryCollection.find({}).toArray();
        await dictionaryDBService.delete(String(allDico[0]._id));
        allDico = await dictionaryDBService.dictionaryCollection.find({}).toArray();
        expect(allDico.length).to.equals(0);
    });

    it('validateDictionaryWords return false', async () => {
        const words = [] as string[];
        const valid = dictionaryDBService.validateDictionaryWords(words);
        expect(valid).to.equals(false);
    });
    it('validateDictionaryWords return true', async () => {
        const words = ['shd'] as string[];
        const valid = dictionaryDBService.validateDictionaryWords(words);
        expect(valid).to.equals(true);
    });

    it('validateDictionaryWords return false', async () => {
        const dico = {
            _id: new ObjectId(),
            title: 'Dieynaba',
            description: 'La plus jolie',
            words: [4, '3', '7'],
        } as unknown as DictionaryInterface;
        const valid = dictionaryDBService.validateDictionaryWords(dico.words);
        expect(valid).to.equals(false);
    });

    it('updateDictionary should throw error if the title is same', async () => {
        const dico: DictionaryInterface = {
            _id: new ObjectId(),
            title: 'Dieynaba',
            description: 'La plus jolie',
            words: [''],
        } as DictionaryInterface;
        await dictionaryDBService.postDictionary(dico);
        try {
            const allDico = await dictionaryDBService.dictionaryCollection.find({}).toArray();
            await dictionaryDBService.updateDictionary(allDico[1]._id, 'Dieynaba', 'La plus jolie');
        } catch (error) {
            expect(error.message).to.equals('Ce titre existe déjà');
        }
    });

    it('updateDictionary should throw error if the title is same', async () => {
        let allDico = await dictionaryDBService.dictionaryCollection.find({}).toArray();
        await dictionaryDBService.updateDictionary(allDico[0]._id, 'newTitle', 'newDescription');
        allDico = await dictionaryDBService.dictionaryCollection.find({}).toArray();
        expect(allDico[0].title).to.equal('newTitle');
        expect(allDico[0].description).to.equal('newDescription');
    });
});
