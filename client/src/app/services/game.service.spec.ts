import { TestBed } from '@angular/core/testing';
import { GameType } from '@app/classes/game-parameters';
import { GameService } from './game.service';

describe('GameService', () => {
    let service: GameService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeGameType should set isMultiplayerGame to true when type is MultiPlayer', () => {
        service.initializeGameType(GameType.MultiPlayer);
        expect(service.isMultiplayerGame).toEqual(true);
    });

    it('initializeGameType should set isMultiplayerGame to false when type is solo', () => {
        service.initializeGameType(GameType.Solo);
        expect(service.isMultiplayerGame).toEqual(false);
    });
});
