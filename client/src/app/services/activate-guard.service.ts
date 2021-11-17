import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class ActivateGuard implements CanActivate {
    constructor(private gameService: GameService) {}

    canActivate(
        // TODO: are those needed?
        /* eslint-disable no-unused-vars */
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.gameService.game.isEndGame === true) {
            return false;
        }
        return true;
    }
}
