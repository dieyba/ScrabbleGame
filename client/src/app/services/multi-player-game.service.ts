import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Dictionary } from '@app/classes/dictionary';
import { Game } from '@app/classes/game';
import { LocalPlayer } from '@app/classes/local-player';
import { ScrabbleBoard } from '@app/classes/scrabble-board';
import { ScrabbleWord } from '@app/classes/scrabble-word';
import { ChatDisplayService } from './chat-display.service';
import { DatabaseService } from './database.service';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { DEFAULT_LETTER_COUNT, SoloGameService } from './solo-game.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

@Injectable({
    providedIn: 'root',
})
export class MultiPlayerGameService extends SoloGameService {
    player1: LocalPlayer;
    player2: LocalPlayer;
    gameBoard: ScrabbleBoard;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
        private databaseService: DatabaseService,
    ) {
        super(gridService, rackService, chatDisplayService, validationService, wordBuilder);
    }

    override initializeGame(gameInfo: FormGroup) {
        this.player1 = new LocalPlayer(gameInfo.controls.name.value);
        this.player1.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.player1.isActive = true;
        this.player2 = new LocalPlayer(gameInfo.controls.opponent.value);
        this.player2.letters = this.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.player2.isActive = false;
        this.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.totalCountDown = +gameInfo.controls.timer.value;
        this.randomBonus = gameInfo.controls.bonus.value;
        this.chatDisplayService.entries = [];
        this.timerMs = +this.totalCountDown;
    }

    override createNewGame() {
        // Empty board and stack
        this.rackService.rackLetters = [];
        this.gameBoard = new ScrabbleBoard();
        // Add rack letters for localPlayer and remote player on their own screen
        // this.addRackLetters(this.game.player1.letters);
        this.startCountdown();
        this.hasTurnsBeenPassed[0] = false;
        this.addGameToServer();
    }

    addGameToServer(): void {
        const newGame: Game = {
            id:"",
            scrabbleBoard: this.gameBoard,
            player1: this.player1,
            player2: this.player2,
            totalCountDown: this.totalCountDown,
            dictionary: this.dictionary,
            randomBonus: this.randomBonus,
            stock: this.stock,
            turnPassed: this.turnPassed,
            hasTurnsBeenPassed: this.hasTurnsBeenPassed,
            isEndGame: this.isEndGame,
            newWord: new ScrabbleWord(),
        };
        try {
            this.databaseService.addGame(newGame).subscribe();
        } catch (err) {
            throw "Une erreur est survenue pour l'ajout d'une partie : " + err;
        }
    }
}
