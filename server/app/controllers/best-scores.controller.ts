import { BestScores } from '@app/classes/best-scores';
import { BestScoresService } from '@app/services/best-scores.service';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from 'typedi';

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE = 422,
    TOO_MANY = 429,
    INTERNAL_ERROR = 500,
}

@Service()
export class BestScoresController {
    router: Router;

    constructor(private bestScoresSrvice: BestScoresService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/classicMode', async (req: Request, res: Response, next: NextFunction) => {
            this.bestScoresSrvice
                .getClassicBestScore()
                .then((bestScores: BestScores[]) => {
                    res.json(bestScores);
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/log2990Mode', async (req: Request, res: Response, next: NextFunction) => {
            this.bestScoresSrvice
                .getLog2990BestScore()
                .then((bestScores: BestScores[]) => {
                    res.json(bestScores);
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/classicMode/send', async (req: Request, res: Response) => {
            this.bestScoresSrvice
                .postClassicBestScore(req.body)
                .then(() => {
                    res.sendStatus(HttpStatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.BAD_REQUEST).send(error.message);
                });
        });
        this.router.post('/log2990Mode/send', async (req: Request, res: Response, next: NextFunction) => {
            this.bestScoresSrvice
                .postLog2990BestScore(req.body)
                .then(() => {
                    res.sendStatus(HttpStatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.BAD_REQUEST).send(error.message);
                });
        });

        this.router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            this.bestScoresSrvice
                .resetDataBase()
                .then(() => {
                    res.sendStatus(HttpStatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(HttpStatus.NOT_FOUND).send(error.message);
                });
        });
    }
}