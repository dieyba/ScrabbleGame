// import { TestBed } from '@angular/core/testing';
// import { ActivatedRouteSnapshot, RouterStateSnapshot, ɵangular_packages_router_router_n } from '@angular/router';
// import { ActivateGuard } from './activate-guard.service';
// import { BonusService } from './bonus.service';
// import { ChatDisplayService } from './chat-display.service';
// import { GameService } from './game.service';
// import { GridService } from './grid.service';
// import { PlaceService } from './place.service';
// import { RackService } from './rack.service';
// import { SoloGameService } from './solo-game.service';
// import { ValidationService } from './validation.service';
// import { WordBuilderService } from './word-builder.service';

// describe('ActivateGuard', () => {
//     let service: ActivateGuard;
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let gridService: GridService;
//     let bonusService: BonusService;
//     let chatDisplayService: ChatDisplayService;
//     let validationService: ValidationService;
//     let wordBuilderService: WordBuilderService;
//     let rackService: RackService;
//     let placeService: PlaceService;
//     let soloGameService: SoloGameService;
//     let route: ActivatedRouteSnapshot;
//     let children: ɵangular_packages_router_router_n<ActivatedRouteSnapshot>[];
//     let root: ɵangular_packages_router_router_n<ActivatedRouteSnapshot>;
//     let state: RouterStateSnapshot;

//     beforeEach(() => {
//         gridService = new GridService();
//         bonusService = new BonusService(gridService);
//         chatDisplayService = new ChatDisplayService();
//         validationService = new ValidationService(gridService, bonusService);
//         wordBuilderService = new WordBuilderService(gridService);
//         rackService = new RackService();
//         placeService = new PlaceService(gridService, rackService);
//         soloGameService = new SoloGameService(gridService, rackService, chatDisplayService, validationService, wordBuilderService, placeService);

//         route = new ActivatedRouteSnapshot();
//         children = [];
//         root = new ɵangular_packages_router_router_n<ActivatedRouteSnapshot>(route, children);
//         state = new RouterStateSnapshot(root);
//         state = state;

//         gameServiceSpy = jasmine.createSpyObj('GameService', ['initializeGameType'], { ['currentGameService']: soloGameService, ['isMultiplayerGame']: false });

//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: GameService, useValue: gameServiceSpy },
//             ],
//         });
//         service = TestBed.inject(ActivateGuard);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('canActivate should return true if it is the end game', () => {
//         gameServiceSpy.currentGameService.game.isEndGame = false;
//         expect(service.canActivate(route, state)).toBeFalse();

//         gameServiceSpy.currentGameService.game.isEndGame = true;
//         expect(service.canActivate(route, state)).toBeTrue();
//     });
// });
