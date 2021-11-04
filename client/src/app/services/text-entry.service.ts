import { Injectable } from '@angular/core';
import { createErrorEntry, createPlayerEntry } from '@app/classes/chat-display-entry';
import { Command, CommandName, CommandParams } from '@app/classes/commands';
import { createDebugCmd } from '@app/classes/debug-command';
import { ErrorType } from '@app/classes/errors';
import { createExchangeCmd } from '@app/classes/exchange-command';
import { createHelpCmd } from '@app/classes/help-command';
import { createPassCmd } from '@app/classes/pass-command';
import { createPlaceCmd } from '@app/classes/place-command';
import { Player } from '@app/classes/player';
import { createStockCmd } from '@app/classes/stock-command';
import {
    convertStringToCoord,
    isAllLowerLetters,
    isEmpty,
    isValidLetter,
    removeAccents,
    scrabbleLetterstoString,
    trimSpaces
} from '@app/classes/utilities';
import { ChatDisplayService } from './chat-display.service';
import { CommandInvokerService } from './command-invoker.service';
import { GameService } from './game.service';

const MIN_EXCHANGE_LETTERS = 1;
const MAX_EXCHANGE_LETTERS = 7;
const LAST_CHAR_INDEX = -1;
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
    isSolo: boolean;

    constructor(
        private chatDisplayService: ChatDisplayService,
        private gameService: GameService,
        private commandInvokerService: CommandInvokerService,
    ) {
        this.commandsMap = new Map();
        this.paramsMap = new Map();

        this.commandsMap.set(CommandName.DebugCmd, createDebugCmd);
        this.commandsMap.set(CommandName.ExchangeCmd, createExchangeCmd);
        this.commandsMap.set(CommandName.PassCmd, createPassCmd);
        this.commandsMap.set(CommandName.PlaceCmd, createPlaceCmd);
        this.commandsMap.set(CommandName.StockCmd, createStockCmd);
        this.commandsMap.set(CommandName.HelpCmd, createHelpCmd);

        this.paramsMap.set(CommandName.DebugCmd, this.extractOnlyChatService);
        this.paramsMap.set(CommandName.ExchangeCmd, this.extractExchangeParams);
        this.paramsMap.set(CommandName.PassCmd, this.extractOnlyGameService);
        this.paramsMap.set(CommandName.PlaceCmd, this.extractPlaceParams);
        this.paramsMap.set(CommandName.StockCmd, this.extractStockParams);
        this.paramsMap.set(CommandName.HelpCmd, this.extractOnlyChatService);
    }

    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(userInput: string) {
        userInput = trimSpaces(userInput);
        if (!isEmpty(userInput)) {
            const isACommand = userInput.startsWith('!') && !this.gameService.currentGameService.game.isEndGame;
            if (!isACommand) {
                if (this.gameService.isMultiplayerGame) {
                    this.chatDisplayService.sendMessageToServer(this.gameService.currentGameService.game.localPlayer.name + ' >> ' + userInput);
                } else {
                    this.chatDisplayService.addEntry(createPlayerEntry(true, this.gameService.currentGameService.game.localPlayer.name, userInput));
                }
            } else {
                const commandCreationResult = this.createCommand(userInput, this.gameService.currentGameService.game.localPlayer);
                const isCreated = commandCreationResult instanceof Command;
                if (isCreated) {
                    // execute command takes care of sending and displaying messages after execution
                    this.commandInvokerService.executeCommand(commandCreationResult as Command);
                } else {
                    this.chatDisplayService.addEntry(createErrorEntry(commandCreationResult as ErrorType, userInput));
                }
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

    extractOnlyChatService(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 0) {
            return { player, serviceCalled: this.chatDisplayService };
        }
        return undefined;
    }

    extractOnlyGameService(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 0) {
            return { player, serviceCalled: this.gameService };
        }
        return undefined;
    }

    extractStockParams(player: Player, paramsInput: string[]): CommandParams {
        if (paramsInput.length === 0) {
            const defaultParams = { player, serviceCalled: this.chatDisplayService };
            const stockLetters: string = scrabbleLetterstoString(this.gameService.currentGameService.stock.letterStock);
            return { defaultParams, specificParams: stockLetters };
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
            const word = removeAccents(paramsInput[1]);
            const positionOrientation = paramsInput[0];

            if (this.isValidWordInput(word) && isAllLowerLetters(positionOrientation)) {
                const row = positionOrientation.slice(0, 1);
                const column = positionOrientation.slice(1, LAST_CHAR_INDEX);
                const coordinates = convertStringToCoord(row, column);
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
            const hasAccents = letters !== removeAccents(letters);
            if (!hasAccents && isAllLowerLetters(letters)) {
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
        if (!isEmpty(word)) {
            for (const letter of word) {
                isValid = isValidLetter(letter);
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
        if (!isEmpty(letters)) {
            if (isAllLowerLetters(letters)) {
                for (const letter of letters) {
                    isValid = isValidLetter(letter) || letter.charCodeAt(0) === '*'.charCodeAt(0);
                    if (!isValid) {
                        break;
                    }
                }
            }
        }
        return isValid;
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
}
