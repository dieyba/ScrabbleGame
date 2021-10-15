import { Game } from '@app/classes/game';
import { GameService } from '@app/services/game.service';
import { Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;

    constructor(private readonly gameService: GameService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            this.gameService
                .getGameInfo()
                .then((games: Game[]) => {
                    res.json(games);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response) => {
            // tslint:disable-next-line:no-string-literal
            this.gameService
                .updateGameInfo(req.body)
                .then((id: string): void => {
                    res.sendStatus(Httpstatus.StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
