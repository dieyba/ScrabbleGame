import { Injectable } from '@angular/core';
import { PlaceParams } from '@app/classes/commands';
import { ErrorType } from '@app/classes/errors';
import { Player } from '@app/classes/player';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    constructor(private gridService: GridService, private rackService: RackService) {}

    place(player: Player, placeParams: PlaceParams): ErrorType {
        const tempCoord = new Vec2();
        // Checking the word is placable
        if (!this.canPlaceWord(placeParams)) {
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
        return ErrorType.NoError;
    }
    placeLetter(playerLetters: ScrabbleLetter[], letter: string, position: Vec2) {
        // Position already occupied
        if (this.gridService.scrabbleBoard.squares[position.x][position.y].occupied) {
            return;
        }
        // Making a temporary letter and checking if "*" is needed (for upper cases)
        let tempLetter = letter;
        if (tempLetter === tempLetter.toUpperCase()) {
            tempLetter = '*';
        }
        for (let i = 0; i < playerLetters.length; i++) {
            if (playerLetters[i].character === tempLetter) {
                if (letter === letter.toUpperCase()) {
                    playerLetters[i].character = letter;
                }
                playerLetters[i].tile = this.gridService.scrabbleBoard.squares[position.x][position.y];
                this.gridService.drawLetter(playerLetters[i], position.x, position.y);
                this.rackService.removeLetter(playerLetters[i]);
                playerLetters.splice(i, 1);
                break;
            }
        }
    }
    canPlaceWord(placeParams: PlaceParams): boolean {
        if (
            !this.gridService.scrabbleBoard.isWordInsideBoard(placeParams.word, placeParams.position, placeParams.orientation) ||
            (!this.gridService.scrabbleBoard.isWordPassingInCenter(placeParams.word, placeParams.position, placeParams.orientation) &&
                !this.gridService.scrabbleBoard.isWordPartOfAnotherWord(placeParams.word, placeParams.position, placeParams.orientation) &&
                !this.gridService.scrabbleBoard.isWordTouchingOtherWord(placeParams.word, placeParams.position, placeParams.orientation))
        ) {
            return false;
        }
        return true;
    }
}
