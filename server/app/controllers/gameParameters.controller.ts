import { GameListManager } from '@app/services/GameListManager.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class GameListController {
    router: Router;

    constructor(private readonly gameservice: GameListManager) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.get('/', (req: Request, res: Response) => {
            res.json(this.gameservice.getAllGames);
        });
    }
}
