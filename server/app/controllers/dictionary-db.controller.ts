import { DictionaryInterface } from '@app/classes/dictionary';
import { DictionaryDBService } from '@app/services/dictionary-db.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DictionaryDBController {
    router: Router;

    constructor(private readonly dictionaryDBService: DictionaryDBService) {
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
            // TODO validate entry
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
            // TODO Validate entry
            // TODO Client can't guarantee that it's a JSON file
            this.dictionaryDBService
                .postDictionary(req.body)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.patch('/beginners', async (req: Request, res: Response) => {
            this.dictionaryDBService
                .updateDictionary(req.body.id, req.body.newTitle, req.body.newDescription)
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

        this.router.delete('/', async (req: Request, res: Response) => {
            this.dictionaryDBService.reset()
                .then(() => {
                    res.status(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    if (error.message === 'Cannot remove headers after they are sent to the client') {
                        // do nothing
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).send(error.message);
                    }
                })
        });
    }
}
