import { DictionaryInterface } from '@app/classes/dictionary';
import { DictionaryDBService } from '@app/services/dictionary-db.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DictionaryDBController {
    router: Router;

    constructor(private readonly dictionaryDBService: DictionaryDBService) {
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
        // this.router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
        //     this.virtualPlayerNameService
        //         .deleteVirtualPlayerName(req.params.id)
        //         .then(() => {
        //             res.sendStatus(StatusCodes.NO_CONTENT).send();
        //         })
        //         .catch((error: Error) => {
        //             if (error.message === 'Cannot remove headers after they are sent to the client') {
        //                 // do nothing
        //             } else {
        //                 res.status(StatusCodes.NOT_FOUND).send(error.message);
        //             }
        //         });
        // });
    }
}
