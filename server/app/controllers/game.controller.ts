import { Game } from '@app/classes/game';
import { GameService } from '@app/services/game.service';
import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;

    constructor(private readonly gameService: GameService) {
        this.configureRouter();
        this.gameService.start();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            this.gameService
                .getAllGames()
                .then((games: Game[]) => {
                    res.json(games);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response) => {
            this.gameService
                .addGameInfo(req.body)
                .then((id: string): void => {
                    res.sendStatus(Httpstatus.StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/:gameId', async (req: Request, res: Response) => {
            const path = './' + req.params.gameId;
            try {
                // remove the png file from the folder
                fs.unlinkSync(path);
            } catch (err) {
                console.error(err);
            }
            this.gameService
                .deleteGame(req.params.gameId)
                .then(() => {
                    res.send('GAME ' + req.params.gameId + ' DELETED').send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
