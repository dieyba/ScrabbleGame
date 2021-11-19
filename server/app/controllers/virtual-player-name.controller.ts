// import { HttpStatus } from '@common/communication/http-status';
// import { Image } from '@common/communication/image-data';
import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { Request, Response, Router } from 'express';
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

        this.router.post('/beginners', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .postBeginnersVirtualPlayerName(req.body)
                .then(() => {
                    res.sendStatus(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.post('/experts', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .postExpertsVirtualPlayerName(req.body)
                .then(() => {
                    res.sendStatus(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
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
