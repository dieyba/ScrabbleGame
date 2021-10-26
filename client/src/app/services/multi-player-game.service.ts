import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlaceParams } from '@app/classes/commands';
import { Dictionary } from '@app/classes/dictionary';
import { ErrorType } from '@app/classes/errors';
import { GameParameters } from '@app/classes/game-parameters';
import { LocalPlayer } from '@app/classes/local-player';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import * as io from 'socket.io-client';
import { ChatDisplayService } from './chat-display.service';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { DEFAULT_LETTER_COUNT, SoloGameService } from './solo-game.service';
import { ValidationService } from './validation.service';
import { WordBuilderService } from './word-builder.service';

@Injectable({
    providedIn: 'root',
})
export class MultiPlayerGameService extends SoloGameService {
    game: GameParameters;
    private socket: io.Socket;

    constructor(
        protected gridService: GridService,
        protected rackService: RackService,
        protected chatDisplayService: ChatDisplayService,
        protected validationService: ValidationService,
        protected wordBuilder: WordBuilderService,
    ) {
        super(gridService, rackService, chatDisplayService, validationService, wordBuilder);
    }

    override initializeGame(gameInfo: FormGroup) {
        this.game = new GameParameters(gameInfo.controls.name.value, +gameInfo.controls.timer.value);
        this.game.creatorPlayer = new LocalPlayer(gameInfo.controls.name.value);
        this.game.creatorPlayer.isActive = true;
        this.game.opponentPlayer = new LocalPlayer(gameInfo.controls.opponent.value);
        this.game.opponentPlayer.letters = this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT);
        this.game.opponentPlayer.isActive = false;
        this.game.dictionary = new Dictionary(+gameInfo.controls.dictionaryForm.value);
        this.game.totalCountDown = +gameInfo.controls.timer.value;
        this.game.randomBonus = gameInfo.controls.bonus.value;
        this.chatDisplayService.entries = [];
        this.game.timerMs = +this.game.totalCountDown;
        return new GameParameters(this.game.creatorPlayer.name, this.game.timerMs);
    }

    override createNewGame() {
        // Empty board and stack
        this.rackService.rackLetters = [];
        // Add rack letters for localPlayer and remote player on their own screen

        this.addRackLetters(this.game.stock.takeLettersFromStock(DEFAULT_LETTER_COUNT));
        this.startCountdown();
        this.game.hasTurnsBeenPassed[0] = false;
    }

    override place(player: Player, placeParams: PlaceParams): ErrorType {
        const tempCoord = new Vec2();
        // Checking if its player's turn
        if (!this.canPlaceWord(player, placeParams)) {
            return ErrorType.SyntaxError;
        }
        // Removing all the letters from my "word" that are already on the board
        let wordCopy = placeParams.word;
        const letterOnBoard = this.gridService.scrabbleBoard.getStringFromCoord(
            placeParams.position,
            placeParams.word.length,
            placeParams.orientation,
        );
        for (const letter of letterOnBoard) {
            wordCopy = wordCopy.replace(letter.toLowerCase(), '');
        }
        // All letter are already placed
        if (wordCopy === '') {
            return ErrorType.SyntaxError;
        }
        // Checking if the rest of the letters are on the rack
        for (const letter of player.letters) {
            // If there is an star, removing a upper letter from "word" string
            if (letter.character === '*') {
                let upperLetter = '';
                for (const wordLetter of wordCopy) {
                    if (wordLetter === wordLetter.toUpperCase()) {
                        upperLetter = wordLetter;
                    }
                }
                wordCopy = wordCopy.replace(upperLetter, '');
            } else {
                wordCopy = wordCopy.replace(letter.character, '');
            }
        }
        // There should be no letters left, else there is not enough letter on the rack to place de "word"
        if (wordCopy !== '') {
            return ErrorType.SyntaxError;
        }
        // Placing letters
        tempCoord.clone(placeParams.position);
        for (const letter of placeParams.word) {
            if (!this.gridService.scrabbleBoard.squares[tempCoord.x][tempCoord.y].occupied) {
                // Taking letter from player and placing it
                this.placeLetter(player.letters, letter, tempCoord);
            }
            if (placeParams.orientation === 'h') {
                tempCoord.x++;
            } else {
                tempCoord.y++;
            }
        }
        // call server to placeword
        this.socket.emit('placeLetter', this.game, placeParams);
        return ErrorType.NoError;
    }
}
