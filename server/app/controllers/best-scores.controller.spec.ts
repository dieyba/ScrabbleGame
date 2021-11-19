// import { BestScores } from '@app/classes/best-scores';
import { BestScores } from '@app/classes/best-scores';
import { BestScoresService } from '@app/services/best-scores.service';
import { expect } from 'chai';
// import { containerBootstrapper } from '../app/inversify.config';
// import { BestScores } from '@app/classes/best-scores';
// import { HttpStatus } from './best-scores.controller';
import { StatusCodes } from 'http-status-codes';
// import sinon = require('sinon');
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
// eslint-disable-next-line import/no-named-as-default
import Container from 'typedi';
// eslint-disable-next-line no-restricted-imports
import { Application } from '../app';

describe('BestScoresController', () => {
    const bestScore: BestScores[] = [
        {
            playerName: 'Dieyba',
            score: 180,
        },
    ];

    let bestScoreService: SinonStubbedInstance<BestScoresService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        bestScoreService = createStubInstance(BestScoresService);
        bestScoreService.getBestScores.resolves(bestScore);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['bestScoresController'], 'bestScoreService', { value: bestScoreService, writable: true });
        expressApp = app.app;
    });
    it('should return an array of all images', async () => {
        // bestScoreService.getClassicBestScore.resolves([bestScore])
        return supertest(expressApp)
            .get('/api/bestScores/classicMode')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
                // expect(response.statusCode).to.equal(HttpStatus.OK);
                expect(response.body).to.deep.equal(bestScore);
            });
    });
});
