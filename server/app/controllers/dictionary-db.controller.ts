import { DictionaryDBService } from '@app/services/dictionary-db.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class DictionaryDBController {
    router: Router;

    constructor(private readonly dictionaryDBService: DictionaryDBService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/dictionary', async (req: Request, res: Response) => {
            console.log(this.dictionaryDBService.dictionaryCollection);
            // this.dictionaryDBService
            //     .getClassicBestScore()
            //     .then((bestScores: BestScores[]) => {
            //         res.json(bestScores);
            //     })
            //     .catch((error: Error) => {
            //         res.status(StatusCodes.NOT_FOUND).send(error.message);
            //     });
        });
        // this.router.get('/log2990Mode', async (req: Request, res: Response, next: NextFunction) => {
        //     this.bestScoresSrvice
        //         .getLog2990BestScore()
        //         .then((bestScores: BestScores[]) => {
        //             res.json(bestScores);
        //         })
        //         .catch((error: Error) => {
        //             res.status(StatusCodes.NOT_FOUND).send(error.message);
        //         });
        // });

        // this.router.post('/classicMode', async (req: Request, res: Response, next: NextFunction) => {
        //     this.bestScoresSrvice
        //         .postClassicBestScore(req.body)
        //         .then(() => {
        //             res.sendStatus(StatusCodes.OK).send();
        //         })
        //         .catch((error: Error) => {
        //             res.status(StatusCodes.BAD_REQUEST).send(error.message);
        //         });
        // });
        // this.router.post('/log2990Mode', async (req: Request, res: Response, next: NextFunction) => {
        //     this.bestScoresSrvice
        //         .postLog2990BestScore(req.body)
        //         .then(() => {
        //             res.sendStatus(StatusCodes.OK).send();
        //         })
        //         .catch((error: Error) => {
        //             res.status(StatusCodes.BAD_REQUEST).send(error.message);
        //         });
        // });

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
