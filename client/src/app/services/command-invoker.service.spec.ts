import { TestBed } from '@angular/core/testing';
import { DefaultCommandParams } from '@app/classes/commands';
import { GameParameters } from '@app/classes/game-parameters';
import { PassTurnCmd } from '@app/classes/pass-command';
import { BonusService } from './bonus.service';
import { ChatDisplayService } from './chat-display.service';
import { CommandInvokerService } from './command-invoker.service';
import { GameService } from './game.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { RackService } from './rack.service';
import { SoloGameService } from './solo-game.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';


describe('CommandInvokerService', () => {
    let service: CommandInvokerService;
    let chatDisplayServiceSpy: ChatDisplayService;
    let gameServiceSpy: GameService;
    let gridService: GridService;
    let bonusService: BonusService;
    let validationService: ValidationService;
    let wordBuilderService: WordBuilderService;
    let rackService: RackService;
    let placeService: PlaceService;
    let soloGameService: SoloGameService;

    let displayExecutionResultMessagesSpy: jasmine.Spy<any>;

    let gameParameters = new GameParameters('Riri', 60, true);

    beforeEach(() => {
        chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', ['initialize']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializeGameType'], { ['currentGameService']: soloGameService });

        gridService = new GridService();
        bonusService = new BonusService(gridService);
        chatDisplayServiceSpy = new ChatDisplayService();
        validationService = new ValidationService(gridService, bonusService);
        wordBuilderService = new WordBuilderService(gridService);
        rackService = new RackService();
        placeService = new PlaceService(gridService, rackService);
        soloGameService = new SoloGameService(gridService, rackService, chatDisplayServiceSpy, validationService, wordBuilderService, placeService);


        TestBed.configureTestingModule({
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: ChatDisplayService, useValue: chatDisplayServiceSpy },
            ],
        });
        service = TestBed.inject(CommandInvokerService);

        displayExecutionResultMessagesSpy = spyOn(service, 'displayExecutionResultMessages');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('executeCommand should call displayExecutionResultMessages', () => {
        gameServiceSpy.currentGameService.game = gameParameters;
        const defaultParams: DefaultCommandParams = { player: gameServiceSpy.currentGameService.game.localPlayer, serviceCalled: gameServiceSpy };
        const command = new PassTurnCmd(defaultParams);
        service.executeCommand(command);

        expect(displayExecutionResultMessagesSpy).toHaveBeenCalled();
    });
});
