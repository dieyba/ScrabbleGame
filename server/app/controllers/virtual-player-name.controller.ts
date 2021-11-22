// import { HttpStatus } from '@common/communication/http-status';
// import { Image } from '@common/communication/image-data';
import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { NextFunction, Request, Response, Router } from 'express';
// import Types from '../types';
import { StatusCodes } from 'http-status-codes';
// import { inject } from 'inversify';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerNameController {
    router: Router;

    constructor(private readonly virtualPlayerNameService: VirtualPlayerNameService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/beginners', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .getBeginnersVirtualPlayerNames()
                .then((virtualPlayerNames: VirtualPlayerName[]) => {
                    res.json(virtualPlayerNames);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/experts', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .getExpertsVirtualPlayerNames()
                .then((virtualPlayerNames: VirtualPlayerName[]) => {
                    res.json(virtualPlayerNames);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/beginners', async (req: Request, res: Response, next: NextFunction) => {
            if (await this.virtualPlayerNameService.isSameName(req.body, this.virtualPlayerNameService.beginnersCollection)) {
                return;
            }
            this.virtualPlayerNameService
                .postBeginnersVirtualPlayerName(req.body)
                .then(() => {
                    res.sendStatus(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.post('/experts', async (req: Request, res: Response, next: NextFunction) => {
            if (await this.virtualPlayerNameService.isSameName(req.body, this.virtualPlayerNameService.expertsCollection)) {
                return;
            }

            this.virtualPlayerNameService
                .postExpertsVirtualPlayerName(req.body)
                .then(() => {
                    res.sendStatus(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.delete('/beginners/:name', async (req: Request, res: Response, next: NextFunction) => {
            // if (!(await this.virtualPlayerNameService.isInCollection(({ name: req.params.name }) as VirtualPlayerName, this.virtualPlayerNameService.beginnersCollection))) {
            //     console.log('le nom que tu veux sup est deja sup');
            //     res.status(StatusCodes.NOT_FOUND).send('not found');
            //     return;
            // }

            console.log('req body : ', req.body);
            console.log('req params : ', req.params);
            this.virtualPlayerNameService
                .deleteBeginnersVirtualPlayerName(req.params.name)
                .then(() => {
                    console.log('then');
                    res.sendStatus(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log('catch');
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });

        this.router.delete('/experts/:name', async (req: Request, res: Response, next: NextFunction) => {
            if (!(await this.virtualPlayerNameService.isInCollection(({ name: req.params.name }) as VirtualPlayerName, this.virtualPlayerNameService.expertsCollection))) {
                return;
            }

            this.virtualPlayerNameService
                .deleteExpertsVirtualPlayerName(req.params.name)
                .then(() => {
                    res.sendStatus(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.NOT_FOUND).send(error.message);
                    }
                });
        });

        this.router.patch('/beginners', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNameService
                .updateBeginnerVirtualPlayerName(req.body.name, req.body.newName)
                .then(() => {
                    res.sendStatus(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.NOT_FOUND).send(error.message);
                    }
                })
        })

        this.router.patch('/experts', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNameService
                .updateExpertVirtualPlayerName(req.body.name, req.body.newName)
                .then(() => {
                    res.sendStatus(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.NOT_FOUND).send(error.message);
                    }
                })
        })
    }
}
