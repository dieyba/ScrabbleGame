import { Dictionary } from '@app/classes/dictionary';
import { DictionaryService } from '@app/services/dictionary.service';
import { Request, Response, Router } from 'express';
// import { HttpStatus } from './best-scores.controller';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DictionarController {
    router: Router;

    constructor(private readonly dictionaryService: DictionaryService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            this.dictionaryService
                .getDictionaries()
                .then((dictionaries: Dictionary[]) => {
                    res.json(dictionaries);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response) => {
            this.dictionaryService
                .postDictionaries(req.body)
                .then(() => {
                    res.sendStatus(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });
    }
}
