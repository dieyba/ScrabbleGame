import { Application } from '@app/app';
import { BestScores } from '@app/classes/best-scores';
import { BestScoresService } from '@app/services/best-scores.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
// eslint-disable-next-line import/no-named-as-default
import Container from 'typedi';

describe('BestScoresController', () => {
    const bestScore: BestScores[] = [
        {
            playerName: 'Dieyba',
            score: 180,
        },
    ];
    const bestScores2 = {
        playerName: 'Sara',
        score: 8,
    } as BestScores;

    let bestScoreService: SinonStubbedInstance<BestScoresService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        bestScoreService = createStubInstance(BestScoresService);
        bestScoreService.getBestScores.resolves(bestScore);
        bestScoreService.postBestScore.resolves();
        bestScoreService.resetDataBase.resolves();
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['bestScoresController'], 'bestScoresService', { value: bestScoreService, writable: true });
        expressApp = app.app;
    });
    it('should return all classicBestSores', async () => {
        return supertest(expressApp)
            .get('/api/bestScores/classicMode')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(bestScore);
            });
    });
    it('should return all log2990BestSores', async () => {
        return supertest(expressApp)
            .get('/api/bestScores/log2990Mode')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(bestScore);
            });
    });
    it('should return an error on a get request to all classicBestSores', async () => {
        bestScoreService.getBestScores.rejects();
        return supertest(expressApp)
            .get('/api/bestScores/classicMode')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
            })
            .catch((error) => {
                expect(error);
            });
    });
    it('should return an error on a get request to all log2990BestSores', async () => {
        bestScoreService.getBestScores.rejects();
        return supertest(expressApp)
            .get('/api/bestScores/log2990Mode')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
            })
            .catch((error) => {
                expect(error);
            });
    });

    it('should post an score on a valid post request in classicModeCollection', async () => {
        return supertest(expressApp)
            .post('/api/bestScores/classicMode/send')
            .send(bestScores2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should post an score on a valid post request in log2990ModeCollection', async () => {
        return supertest(expressApp)
            .post('/api/bestScores/log2990Mode/send')
            .send(bestScores2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should return a error on a post request to classicBestSores', async () => {
        bestScoreService.postBestScore.rejects();
        return supertest(expressApp)
            .post('/api/bestScores/classicMode/send')
            .send(bestScores2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            })
            .catch((error) => {
                expect(error);
            });
    });

    it('should return a error on a post request to log2990BestSores', async () => {
        bestScoreService.postBestScore.rejects();
        return supertest(expressApp)
            .post('/api/bestScores/log2990Mode/send')
            .send(bestScores2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            })
            .catch((error) => {
                expect(error);
            });
    });

    it('should reset all scores correctly', async () => {
        return supertest(expressApp)
            .delete('/api/bestScores')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should send an error while attempt reset bestScores database', async () => {
        bestScoreService.resetDataBase.rejects();
        return supertest(expressApp)
            .delete('/api/bestScores')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
            });
    });
});
