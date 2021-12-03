import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from './game.service/game.service';

@Injectable({
    providedIn: 'root',
})
export class ActivateGuard implements CanActivate {
    constructor(private gameService: GameService) {}

    canActivate(): // TODO: are those needed?
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.gameService.game.isEndGame === true) {
            return false;
        }
        return true;
    }
}
