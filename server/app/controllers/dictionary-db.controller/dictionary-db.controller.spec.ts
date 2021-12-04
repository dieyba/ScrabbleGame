import { Application } from '@app/app';
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { DictionaryDBService } from '@app/services/dictionary-db.service/dictionary-db.service';
import { ObjectId } from 'bson';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
// eslint-disable-next-line import/no-named-as-default
import Container from 'typedi';

describe('DictionaryController', () => {
    const dico = [
        {
            _id: new ObjectId(),
            title: 'Dieynaba',
            description: 'La plus jolie',
            words: [''],
        },
    ] as DictionaryInterface[];
    let dictionaryDBService: SinonStubbedInstance<DictionaryDBService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        dictionaryDBService = createStubInstance(DictionaryDBService);
        dictionaryDBService.getAllDictionaryDescription.resolves(dico);
        dictionaryDBService.getDictionary.resolves();
        dictionaryDBService.postDictionary.resolves();
        dictionaryDBService.updateDictionary.resolves();
        dictionaryDBService.delete.resolves();
        dictionaryDBService.reset.resolves();
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['dictionaryDBController'], 'dictionaryDBService', { value: dictionaryDBService, writable: true });
        expressApp = app.app;
    });
    it('should return all dictionary', async () => {
        return supertest(expressApp)
            .get('/api/dictionary')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should return a dictionary', async () => {
        return supertest(expressApp)
            .get('/api/dictionary')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should return an error on a get request to all dictionary', async () => {
        dictionaryDBService.getAllDictionaryDescription.rejects();
        return supertest(expressApp)
            .get('/api/dictionary')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
            })
            .catch((error) => {
                expect(error);
            });
    });

    it('should post an score on a valid post request in classicModeCollection', async () => {
        const dico = {
            _id: new ObjectId(),
            title: 'Ariane',
            description: 'La plus belle',
            words: [''],
        } as DictionaryInterface;
        return supertest(expressApp)
            .post('/api/dictionary')
            .send(dico)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should return a error on a post request to classicBestSores', async () => {
        const dico = {
            _id: new ObjectId(),
            title: 'Ariane',
            description: 'La plus belle',
            words: [''],
        } as DictionaryInterface;

        dictionaryDBService.postDictionary.rejects();
        return supertest(expressApp)
            .post('/api/dictionary')
            .send(dico)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            })
            .catch((error) => {
                expect(error);
            });
    });

    it('should return a error on a post request to classicBestSores', async () => {
        return supertest(expressApp)
            .patch('/api/dictionary/Mon dictionnaire')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });
});
