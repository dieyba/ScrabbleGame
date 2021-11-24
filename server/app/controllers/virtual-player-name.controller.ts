import { VirtualPlayerName } from '@app/classes/virtual-player-name';
import { VirtualPlayerNameService } from '@app/services/virtual-player-name.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerNameController {
    router: Router;

    constructor(private virtualPlayerNameService: VirtualPlayerNameService) {
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
                    res.json(req.body);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.post('/experts', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .postExpertsVirtualPlayerName(req.body)
                .then(() => {
                    res.json(req.body);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.delete('/beginners/:name', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .deleteBeginnersVirtualPlayerName(req.params.name)
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
                .deleteExpertsVirtualPlayerName(req.params.name)
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
                .updateBeginnerVirtualPlayerName(req.body.id, req.body.newName)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    // if (error.message === "Ce nom existe déjà") {
                    //     console.log('erreur nom existe deja');
                    //     res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    //     return;
                    // }
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });

        this.router.patch('/experts', async (req: Request, res: Response) => {
            this.virtualPlayerNameService
                .updateExpertVirtualPlayerName(req.body.id, req.body.newName)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    // if (error.message === "Ce nom existe déjà") {
                    //     res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    // }
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
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });
    }
}
