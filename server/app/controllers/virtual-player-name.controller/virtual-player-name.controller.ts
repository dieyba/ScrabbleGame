import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service/virtual-player-name.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerNameController {
    router: Router;

    constructor(private virtualPlayerNameService: VirtualPlayerNameService) {
        this.virtualPlayerNameService.clientConnection();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/beginners', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .getVirtualPlayerNames(this.virtualPlayerNameService.beginnersCollection)
                .then((virtualPlayerNames: VirtualPlayerName[]) => {
                    res.json(virtualPlayerNames);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/experts', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .getVirtualPlayerNames(this.virtualPlayerNameService.expertsCollection)
                .then((virtualPlayerNames: VirtualPlayerName[]) => {
                    res.json(virtualPlayerNames);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/beginners', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .postVirtualPlayerName(this.virtualPlayerNameService.beginnersCollection, req.body)
                .then(() => {
                    res.json(req.body);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.post('/experts', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .postVirtualPlayerName(this.virtualPlayerNameService.expertsCollection, req.body)
                .then(() => {
                    res.json(req.body);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.delete('/beginners/:name', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .deleteVirtualPlayerName(this.virtualPlayerNameService.beginnersCollection, req.params.name)
                .then(() => {
                    res.status(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });

        this.router.delete('/experts/:name', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .deleteVirtualPlayerName(this.virtualPlayerNameService.expertsCollection, req.params.name)
                .then(() => {
                    res.status(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });

        this.router.patch('/beginners', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .updateVirtualPlayerName(this.virtualPlayerNameService.beginnersCollection, req.body.id, req.body.newName)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });

        this.router.patch('/experts', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .updateVirtualPlayerName(this.virtualPlayerNameService.expertsCollection, req.body.id, req.body.newName)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });

        this.router.delete('', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .resetDataBase()
                .then(() => {
                    res.status(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    // TODO : avoid if-else
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });
    }
}
