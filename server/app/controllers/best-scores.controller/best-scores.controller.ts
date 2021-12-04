import { BestScores } from '@app/classes/best-scores';
import { BestScoresService } from '@app/services/best-scores.service/best-scores.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class BestScoresController {
    router: Router;

    constructor(private bestScoresService: BestScoresService) {
        bestScoresService.connectClient();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/classicMode', async (req: Request, res: Response) => {
            this.bestScoresService
                .getBestScores(this.bestScoresService.classicCollection)
                .then((bestScores: BestScores[]) => {
                    res.json(bestScores);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/log2990Mode', async (req: Request, res: Response) => {
            this.bestScoresService
                .getBestScores(this.bestScoresService.log2990Collection)
                .then((bestScores: BestScores[]) => {
                    res.json(bestScores);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/classicMode/send', async (req: Request, res: Response) => {
            this.bestScoresService
                .postBestScore(this.bestScoresService.classicCollection, req.body)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.post('/log2990Mode/send', async (req: Request, res: Response) => {
            this.bestScoresService
                .postBestScore(this.bestScoresService.log2990Collection, req.body)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });
        });

        this.router.delete('/', async (req: Request, res: Response) => {
            this.bestScoresService
                .resetDataBase()
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
