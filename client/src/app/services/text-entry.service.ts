import { Injectable } from '@angular/core';
import { Command, CommandParams } from '@app/classes/commands';
import { createDebugCmd } from '@app/classes/debug-command';
import { ErrorType } from '@app/classes/errors';
import { createExchangeCmd, ExchangeCmd } from '@app/classes/exchange-command';
import { createPassCmd } from '@app/classes/pass-command';
import { createPlaceCmd } from '@app/classes/place-command';
import { Player } from '@app/classes/player';
import { Column, Row } from '@app/classes/scrabble-board';
import { createStockCmd } from '@app/classes/stock-command';
import { scrabbleLetterstoString } from '@app/classes/utilities';
import { Vec2 } from '@app/classes/vec2';
import { ChatDisplayService } from './chat-display.service';
import { SoloGameService } from './solo-game.service';

const DEBUG_CMD = 'debug';
const EXCHANGE_CMD = 'échanger';
const PASS_CMD = 'passer';
const PLACE_CMD = 'placer';
const STOCK_CMD = 'réserve';

const PARSE_INT_BASE = 10;
const MIN_EXCHANGE_LETTERS = 1;
const MAX_EXCHANGE_LETTERS = 7;
const LAST_CHAR_INDEX = -1;
const ROW_OFFSET = 'a'.charCodeAt(0);
const COLUMN_OFFSET = 1;
const HORIZONTAL = 'h';
const VERTICAL = 'v';

type CommandCreationResult = Command | ErrorType.SyntaxError | ErrorType.InvalidCommand;

@Injectable({
    providedIn: 'root',
})

// All eslint-disable-lines were disabled to allow calling the map's functions taking different arguments.
export class TextEntryService {
    commandsMap: Map<string, Function>; // eslint-disable-line @typescript-eslint/ban-types
    paramsMap: Map<string, Function>; // eslint-disable-line @typescript-eslint/ban-types

    constructor(private chatDisplayService: ChatDisplayService, private gameService: SoloGameService) {
        this.commandsMap = new Map();
        this.paramsMap = new Map();

        this.commandsMap.set(DEBUG_CMD, createDebugCmd);
        this.commandsMap.set(EXCHANGE_CMD, createExchangeCmd);
        this.commandsMap.set(PASS_CMD, createPassCmd);
        this.commandsMap.set(PLACE_CMD, createPlaceCmd);
        this.commandsMap.set(STOCK_CMD, createStockCmd);

        this.paramsMap.set(DEBUG_CMD, this.extractDebugParams);
        this.paramsMap.set(EXCHANGE_CMD, this.extractExchangeParams);
        this.paramsMap.set(PLACE_CMD, this.extractPlaceParams);
        this.paramsMap.set(PASS_CMD, this.extractPassParams);
        this.paramsMap.set(STOCK_CMD, this.extractStockParams);
    }

    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(userInput: string, isLocalPlayer: boolean) {
        const player: Player = isLocalPlayer ? this.gameService.localPlayer : this.gameService.virtualPlayer;
        userInput = this.trimSpaces(userInput);
        if (!this.isEmpty(userInput)) {
            // After the end game, messages starting with ! can't call commands and are considered normal chat messages
            if (userInput.startsWith('!') && !this.gameService.isEndGame) {
                let commandCreationResult = this.createCommand(userInput, player);
                const isCreated = commandCreationResult !== ErrorType.SyntaxError && commandCreationResult !== ErrorType.InvalidCommand;
                if (isCreated) {
                    commandCreationResult = commandCreationResult as Command;

                    // TODO: put this in a command invoker service
                    const commandExecutionResult = commandCreationResult.execute();
                    if (commandExecutionResult === ErrorType.NoError) {
                        // In this sprint, only exchange command success message depends on who called the command
                        if (commandCreationResult instanceof ExchangeCmd) {
                            userInput = this.chatDisplayService.createExchangeMessage(isLocalPlayer, userInput);
                        }
                        this.chatDisplayService.addPlayerEntry(isLocalPlayer, player.name, userInput);
                    } else {
                        this.chatDisplayService.addErrorMessage(commandExecutionResult, userInput);
                    }
                    //
                } else {
                    this.chatDisplayService.addErrorMessage(commandCreationResult as ErrorType, userInput);
                }
            } else {
                // Not a command input. Send normal chat message
                this.chatDisplayService.addPlayerEntry(isLocalPlayer, player.name, userInput);
            }
        }
    }

    createCommand(commandInput: string, player: Player): CommandCreationResult {
        const splitInput = this.splitCommandInput(commandInput);
        const commandName = splitInput.shift() as string;
        // Validate command name entered after the !
        if (this.commandsMap.has(commandName)) {
            // Get the function to create the command
            const createCmdFunction: Function = this.commandsMap.get(commandName) as Function; // eslint-disable-line @typescript-eslint/ban-types
            // Validate and return the command parameters
            const commandParams = this.extractCommandParams(player, commandName, splitInput);
            if (commandParams) {
                return createCmdFunction.call(this, commandParams);
            } else {
                return ErrorType.SyntaxError;
            }
        } else {
            return ErrorType.InvalidCommand;
        }
    }

    /**
     * Returns the parameters specific to the command entered if its syntax was valid
     *
     * @param commandName string of the command to execute
     * @param paramsInput string[] split at the spaces of the command input (without the command name)
     * @returns Default parameters and the command specific parameters if it has some
     */
    extractCommandParams(player: Player, commandName: string, paramsInput: string[]): CommandParams | undefined {
        if (this.paramsMap.has(commandName)) {
            const createParamsFunction: Function = this.paramsMap.get(commandName) as Function; // eslint-disable-line @typescript-eslint/ban-types
            const params = createParamsFunction.call(this, player, paramsInput);
            if (params) {
                return params;
            }
        }
        return undefined;
    }

    extractDebugParams(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 0) {
            return { player, serviceCalled: this.chatDisplayService };
        }
        return undefined;
    }

    extractStockParams(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 0) {
            const defaultParams = { player, serviceCalled: this.chatDisplayService };
            const stockLetters: string = scrabbleLetterstoString(this.gameService.stock.letterStock);
            return { defaultParams, specificParams: stockLetters };
        }
        return undefined;
    }

    extractPassParams(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 0) {
            return { player, serviceCalled: this.gameService };
        }
        return undefined;
    }

    /**
     * Returns the default command parameters, placing parameters and word to place if the syntax was valid.
     *
     * @param defaultParams the game service and who the command is from
     * @param paramsInput the params entered after the command name. Should have 2 elements,
     * the placing parameters and the word to place.
     * @returns Default parameteres and place commands parameters. If invalid syntax, returns undefined
     */
    extractPlaceParams(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 2) {
            const word = this.removeAccents(paramsInput[1]);
            const positionOrientation = paramsInput[0];

            if (this.isValidWordInput(word) && this.isAllLowerLetters(positionOrientation)) {
                const row = positionOrientation.slice(0, 1);
                const column = positionOrientation.slice(1, LAST_CHAR_INDEX);
                const coordinates = this.convertToCoordinates(row, column);
                if (coordinates) {
                    const orientation = positionOrientation.slice(LAST_CHAR_INDEX).toLowerCase();
                    if (orientation === HORIZONTAL || orientation === VERTICAL) {
                        const placeParams = { position: coordinates, orientation, word };
                        const defaultParams = { player, serviceCalled: this.gameService };
                        const commandParams = { defaultParams, specificParams: placeParams };
                        return commandParams;
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * Returns the default command parameters and letters to exchange if the command syntax was valid.
     *
     * @param defaultParams the game service and who the command is from
     * @param paramsInput string[] for the params entered after the command name.
     * Should only have 1 element, the letters to exchange.
     * @returns Default parameteres and a string for the letters to exchange. If invalid syntax, returns undefined
     */
    extractExchangeParams(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 1) {
            const letters = paramsInput[0];
            const hasAccents = letters !== this.removeAccents(letters);
            if (!hasAccents && this.isAllLowerLetters(letters)) {
                const isValidLetterAmount = letters.length >= MIN_EXCHANGE_LETTERS && letters.length <= MAX_EXCHANGE_LETTERS;
                if (isValidLetterAmount) {
                    if (this.isValidExchangeWord(letters)) {
                        const defaultParams = { player, serviceCalled: this.gameService };
                        return { defaultParams, specificParams: letters };
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * Checks if the word is not empty and only has valid letters
     */
    isValidWordInput(word: string): boolean {
        let isValid = false;
        if (!this.isEmpty(word)) {
            for (const letter of word) {
                isValid = this.isValidLetter(letter);
                if (!isValid) {
                    break;
                }
            }
        }
        return isValid;
    }

    /**
     * Checks if the word is not empty and only has valid letters including *
     */
    isValidExchangeWord(letters: string): boolean {
        let isValid = false;
        if (!this.isEmpty(letters)) {
            if (this.isAllLowerLetters(letters)) {
                for (const letter of letters) {
                    isValid = this.isValidLetter(letter) || letter.charCodeAt(0) === '*'.charCodeAt(0);
                    if (!isValid) {
                        break;
                    }
                }
            }
        }
        return isValid;
    }

    // TODO: move the necessary methods in utilities
    removeAccents(letters: string): string {
        return letters.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Returns true if it is  a letter. False if it is not or has an accent or ç
     */
    isValidLetter(letter: string): boolean {
        if (!this.isEmpty(letter) && letter.length === 1) {
            const charCode = letter.toLowerCase().charCodeAt(0);
            const isALetter = charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0);
            return isALetter;
        }
        return false;
    }

    /**
     * Converts the string row and columns to coordinates with x and y between 0 to 14.
     *
     * @param row String of the row number in letters
     * @param column string of the column number
     * @returns Vec2 of numbers x and y
     */
    convertToCoordinates(row: string, column: string): Vec2 | undefined {
        let columnNumber = parseInt(column, PARSE_INT_BASE);
        if (columnNumber !== null) {
            columnNumber = columnNumber - COLUMN_OFFSET;
            // For place command, row input is not accepted if its a capital letters
            const rowNumber = row.charCodeAt(0) - ROW_OFFSET;
            const isValidRow = rowNumber >= Row.A && rowNumber <= Row.O;
            const isValidColumn = columnNumber >= Column.One && columnNumber <= Column.Fifteen;
            if (isValidRow && isValidColumn) {
                return new Vec2(columnNumber, rowNumber);
            }
        }
        return undefined;
    }

    /**
     * Takes the command input entered by player, removes the ! and splits the string at the white spaces.
     *
     * @param commandInput the string to split
     * @returns sintrg[]. Returns empty array if the input was empty or only had white spaces
     */
    splitCommandInput(commandInput: string): string[] {
        if (commandInput.startsWith('!')) {
            return commandInput.substring(1).split(' ');
        }
        return [];
    }

    /**
     * Removes white spaces at the beginning and end of a string.
     *
     * @param userInput string Input from the user
     * @returns String without beginning and ending spaces. Returns empty string if it only had white spaces
     */
    trimSpaces(userInput: string): string {
        while (userInput.startsWith(' ')) {
            userInput = userInput.substring(1);
        }
        while (userInput.endsWith(' ')) {
            userInput = userInput.substring(0, userInput.length - 1);
        }

        return userInput;
    }

    /**
     * Checks if a string is empty or filled only with white spaces.
     *
     * @param userInput string Input from the user
     * @returns True if empty string or white space only string
     */
    isEmpty(userInput: string) {
        userInput = this.trimSpaces(userInput);
        return userInput === '';
    }

    isAllLowerLetters(letters: string): boolean {
        return letters.toLowerCase() === letters;
    }
}
