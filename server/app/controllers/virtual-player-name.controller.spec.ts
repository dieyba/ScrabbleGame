import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { ObjectId } from 'bson';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
// import sinon = require('sinon');
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
// eslint-disable-next-line import/no-named-as-default
import Container from 'typedi';
// eslint-disable-next-line no-restricted-imports
import { Application } from '../app';

describe('VirtualPlayerNameController', () => {
    const names: VirtualPlayerName[] = [
        {
            _id: '61a133c2ee930cb75da99883' as unknown as ObjectId,
            name: 'Riri',
        },
    ];

    const names2: VirtualPlayerName[] = [
        {
            _id: new ObjectId(),
            name: 'Lulu',
        },
    ];

    let virtualPlayerNameService: SinonStubbedInstance<VirtualPlayerNameService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        virtualPlayerNameService = createStubInstance(VirtualPlayerNameService);
        virtualPlayerNameService.clientConnection.resolves();
        virtualPlayerNameService.getVirtualPlayerNames.resolves(names);
        virtualPlayerNameService.postVirtualPlayerName.resolves();
        virtualPlayerNameService.deleteVirtualPlayerName.resolves();
        virtualPlayerNameService.updateVirtualPlayerName.resolves();
        virtualPlayerNameService.resetDataBase.resolves();
        virtualPlayerNameService.populate.resolves();
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['virtualPlayerNameController'], 'virtualPlayerNameService', { value: virtualPlayerNameService, writable: true });
        expressApp = app.app;
    });

    it('should return an array of all beginner virtual player names', async () => {
        return supertest(expressApp)
            .get('/api/VirtualPlayerName/beginners')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(names);
            });
    });

    it('should return an array of all expert virtual player names', async () => {
        return supertest(expressApp)
            .get('/api/VirtualPlayerName/experts')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
                expect(response.body).to.deep.equal(names);
            });
    });

    it('should return an error on a get request to all beginner virtual player names', async () => {
        virtualPlayerNameService.getVirtualPlayerNames.rejects();
        return supertest(expressApp)
            .get('/api/VirtualPlayerName/beginners')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
            })
            .catch((error) => {
                expect(error);
            });
    });

    it('should return an error on a get request to all expert virtual player names', async () => {
        virtualPlayerNameService.getVirtualPlayerNames.rejects();
        return supertest(expressApp)
            .get('/api/VirtualPlayerName/experts')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
            })
            .catch((error) => {
                expect(error);

            });
    });

    it('should post a name on a valid post request in beginnersCollection', async () => {
        return supertest(expressApp)
            .post('/api/VirtualPlayerName/beginners')
            .send(names2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should post a name on a valid post request in expertsCollection', async () => {
        return supertest(expressApp)
            .post('/api/VirtualPlayerName/experts')
            .send(names2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should return an error on a failed post request to beginnersCollection', async () => {
        virtualPlayerNameService.postVirtualPlayerName.rejects();
        return supertest(expressApp)
            .post('/api/VirtualPlayerName/beginners')
            .send(names2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            })
            .catch((error) => {
                expect(error);

            });
    });

    it('should return a error on a failed post request to expertsCollection', async () => {
        virtualPlayerNameService.postVirtualPlayerName.rejects();
        return supertest(expressApp)
            .post('/api/VirtualPlayerName/experts')
            .send(names2)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            })
            .catch((error) => {
                expect(error);

            });
    });

    it('should delete a name on a valid delete request in beginnersCollection', async () => {
        return supertest(expressApp)
            .delete('/api/VirtualPlayerName/beginners/Erika')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NO_CONTENT);
            });
    });

    it('should delete a name on a valid delete request in expertsCollection', async () => {
        return supertest(expressApp)
            .delete('/api/VirtualPlayerName/experts/Dieyba')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NO_CONTENT);
            });
    });

    it('should send an error while attempt delete a beginner name fail', async () => {
        virtualPlayerNameService.deleteVirtualPlayerName.rejects();
        return supertest(expressApp)
            .delete('/api/VirtualPlayerName/beginners/Erika')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            });
    });

    it('should send an error while attempt delete a expert name fail', async () => {
        virtualPlayerNameService.deleteVirtualPlayerName.rejects();
        return supertest(expressApp)
            .delete('/api/VirtualPlayerName/experts/Dieyba')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            });
    });

    // it('should send an error with a specific message while attempt delete a beginner name fail', async () => {
    //     virtualPlayerNameService.deleteVirtualPlayerName.rejects();
    //     return supertest(expressApp)
    //         .delete('/api/VirtualPlayerName/beginners/Erika')
    //         .then((response) => {
    //             expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    //         });
    // });

    // it('should send an error with a specific message while attempt delete a expert name fail', async () => {
    //     virtualPlayerNameService.deleteVirtualPlayerName.rejects();
    //     return supertest(expressApp)
    //         .delete('/api/VirtualPlayerName/beginners/Dieyba')
    //         .then((response) => {
    //             expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    //         });
    // });

    it('should update a name on a valid patch request in beginnersCollection', async () => {
        return supertest(expressApp)
            .patch('/api/VirtualPlayerName/beginners')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should update a name on a valid patch request in expertsCollection', async () => {
        return supertest(expressApp)
            .patch('/api/VirtualPlayerName/experts')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.OK);
            });
    });

    it('should send an error while attempt patch a beginner name fail', async () => {
        virtualPlayerNameService.updateVirtualPlayerName.rejects();
        return supertest(expressApp)
            .patch('/api/VirtualPlayerName/beginners')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            });
    });

    it('should send an error while attempt patch a expert name fail', async () => {
        virtualPlayerNameService.updateVirtualPlayerName.rejects();
        return supertest(expressApp)
            .patch('/api/VirtualPlayerName/experts')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            });
    });

    // it('should send an error with a specific message while attempt patch a beginner name fail', async () => {
    //     virtualPlayerNameService.updateVirtualPlayerName.rejects();
    //     return supertest(expressApp)
    //         .patch('/api/VirtualPlayerName/beginners')
    //         .then((response) => {
    //             expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    //         });
    // });

    // it('should send an error with a specific message while attempt patch a expert name fail', async () => {
    //     virtualPlayerNameService.updateVirtualPlayerName.rejects();
    //     return supertest(expressApp)
    //         .patch('/api/VirtualPlayerName/experts')
    //         .then((response) => {
    //             expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    //         });
    // });

    it('should reset all names correctly', async () => {
        return supertest(expressApp)
            .delete('/api/VirtualPlayerName')
            .expect(StatusCodes.NO_CONTENT)
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.NO_CONTENT);
            });
    });

    it('should send an error while attempt reset VirtualPlayerName database fail', async () => {
        virtualPlayerNameService.resetDataBase.rejects();
        return supertest(expressApp)
            .delete('/api/VirtualPlayerName')
            .then((response) => {
                expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
            });
    });

    // it('should send an error with specific message while attempt reset VirtualPlayerName database fail', async () => {
    //     const testError = new Error('Cannot remove headers after they are sent to the client');
    //     virtualPlayerNameService.resetDataBase.rejects(testError);
    //     return supertest(expressApp)
    //         .delete('/api/VirtualPlayerName')
    //         .then((response) => {
    //             console.log('response : ', response);
    //             expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
    //         });
    // });
});
