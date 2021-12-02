import { DictionaryInterface } from '@app/classes/dictionary';
import { DictionaryDBService } from '@app/services/dictionary-db.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DictionaryDBController {
    router: Router;

    constructor(private dictionaryDBService: DictionaryDBService) {
        this.dictionaryDBService.clientConnection();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            this.dictionaryDBService
                .getAllDictionaryDescription()
                .then((dictionary: DictionaryInterface[]) => {
                    res.json(dictionary);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/:name', async (req: Request, res: Response) => {
            this.dictionaryDBService
                .getDictionary(req.params.name)
                .then((dictionary: DictionaryInterface) => {
                    res.json(dictionary);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response) => {
            this.dictionaryDBService
                .postDictionary(req.body)
                .then(() => {
                    res.send(req.body);
                })
                .catch((error: TypeError) => {
                    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error.message);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.patch('/:title', async (req: Request, res: Response) => {
            // console.log('collection in controller : ', this.dictionaryDBService.dictionaryCollection);
            this.dictionaryDBService
                .updateDictionary(req.body.id, req.body.newTitle, req.body.newDescription)
                .then(() => {
                    // console.log('then');
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    // console.log('catch');
                    // console.log(error);
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                });
        });

        this.router.delete('/:id', async (req: Request, res: Response) => {
            // console.log('req : ', req.params);
            this.dictionaryDBService
                .delete(req.params.id)
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

        this.router.delete('/', async (req: Request, res: Response) => {
            this.dictionaryDBService
                .reset()
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
