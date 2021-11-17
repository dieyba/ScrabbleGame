import { Dictionary } from "@app/classes/dictionary";
import { DictionaryService } from "@app/services/dictionary.service";
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { HttpStatus } from "./best-scores.controller";

@Service()
export class DictionarController {
    router: Router;

    constructor(private readonly dictionaryService: DictionaryService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.dictionaryService
                .getDictionaries()
                .then((dictionaries: Dictionary[]) => {
                    res.json(dictionaries);
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.dictionaryService
                .postDictionaries(req.body)
                .then(() => {
                    res.sendStatus(HttpStatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.BAD_REQUEST).send(error.message);
                });
        });
    }
}