// import { HttpStatus } from '@common/communication/http-status';
// import { Image } from '@common/communication/image-data';
import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { NextFunction, Request, Response, Router } from 'express';
// import { inject } from 'inversify';
import { Service } from 'typedi';
import { VirtualPlayerNameService } from '../services/virtual-player-name.service';
// import Types from '../types';

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE = 422,
    TOO_MANY = 429,
    INTERNAL_ERROR = 500,
}

@Service()
export class VirtualPlayerNameController {
    router: Router;

    constructor(private readonly virtualPlayerNameService: VirtualPlayerNameService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/beginners', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNameService
                .getBeginnersVirtualPlayerNames()
                .then((virtualPlayerNames: VirtualPlayerName[]) => {
                    res.json(virtualPlayerNames);
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/experts', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNameService
                .getExpertsVirtualPlayerNames()
                .then((virtualPlayerNames: VirtualPlayerName[]) => {
                    res.json(virtualPlayerNames);
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/beginners', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNameService
                .postBeginnersVirtualPlayerName(req.body)
                .then(() => {
                    res.sendStatus(HttpStatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.BAD_REQUEST).send(error.message);
                });
        });

        this.router.post('/experts', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNameService
                .postExpertsVirtualPlayerName(req.body)
                .then(() => {
                    res.sendStatus(HttpStatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.BAD_REQUEST).send(error.message);
                });
        });

        // this.router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
        //     this.virtualPlayerNameService
        //         .deleteVirtualPlayerName(req.params.id)
        //         .then(() => {
        //             res.sendStatus(HttpStatus.NO_CONTENT).send();
        //         })
        //         .catch((error: Error) => {
        //             if (error.message === 'Cannot remove headers after they are sent to the client') {
        //                 // do nothing
        //             } else {
        //                 res.status(HttpStatus.NOT_FOUND).send(error.message);
        //             }
        //         });
        // });
    }
}
