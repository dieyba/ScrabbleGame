// import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ErrorType } from '@app/classes/errors';
import { Column, Row } from '@app/classes/scrabble-board';
import { Command, CommandParams, DefaultCommandParams } from '../classes/commands';
import { SoloGameService } from './solo-game.service';
import { createDebugCmd } from '../classes/debugCommand';
import { createExchangeCmd } from '../classes/exchangeCommand';
import { createPassCmd } from '../classes/passCommand';
import { createPlaceCmd } from '../classes/placeCommand';
import { Vec2 } from '../classes/vec2';
import { ChatDisplayService } from './chat-display.service';

const DEBUG_CMD = 'debug';
const EXCHANGE_CMD = 'échanger';
const PASS_CMD = 'passer';
const PLACE_CMD = 'placer';
// TODO:add les autres pour les prochains sprint sans les implémenter? aka make it so they wont send an invalid command error message

const ROW_OFFSET = 'a'.charCodeAt(0);
const COLUMN_OFFSET = 1;
const HORIZONTAL = 'h';
const VERTICAL = 'v';

@Injectable({
    providedIn: 'root',
})


export class TextEntryService {
    commandsMap: Map<string, Function>;
    paramsMap: Map<string, Function>;
    
    constructor(private chatDisplayService: ChatDisplayService, private gameService:SoloGameService) {
        this.commandsMap = new Map;
        this.paramsMap = new Map;

        this.commandsMap.set(DEBUG_CMD,createDebugCmd);
        this.commandsMap.set(EXCHANGE_CMD,createExchangeCmd);
        this.commandsMap.set(PASS_CMD, createPassCmd);
        this.commandsMap.set(PLACE_CMD,createPlaceCmd);

        this.paramsMap.set(DEBUG_CMD,this.isWithoutParams);
        this.paramsMap.set(EXCHANGE_CMD, this.extractExchangeParams);
        this.paramsMap.set(PLACE_CMD, this.extractPlaceParams);
        this.paramsMap.set(PASS_CMD,this.isWithoutParams);
    }

    
    
    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(userInput: string) {    
        // For this sprint, we assume only the local player enters input in the chat box.
        const isLocalPLayer = true;

        userInput = this.trimSpaces(userInput);
        if(!this.isEmpty(userInput)){
            if(userInput.startsWith("!")) {
                const splitInput = this.splitInput(userInput.substring(1));
                const commandCreated = this.createCommand(splitInput,isLocalPLayer);
                if(commandCreated){
                    const commandResult = commandCreated.execute();
                    if(commandResult === ErrorType.NoError){
                        this.chatDisplayService.addPlayerEntry(isLocalPLayer, userInput);
                    }else{
                        // TODO: add user input to the error message.
                        this.chatDisplayService.addErrorMessage(commandResult);
                    }
                }
            } else {
                this.chatDisplayService.addPlayerEntry(isLocalPLayer, userInput);
            }
        }
    }

    
    createCommand(commandInput:string[],isLocalPlayer:boolean):Command|undefined{
        const commandName = commandInput.shift() as string;
        if(this.commandsMap.has(commandName)){
            const createCmdFunction:Function = this.commandsMap.get(commandName) as Function;
            const defaultParams = {gameService:this.gameService,isFromLocalPlayer:isLocalPlayer};
            const commandParams = this.extractCommandParams(defaultParams,commandName,commandInput);
            if(commandParams){
                return createCmdFunction.call(this,commandParams);
            }
            else{
                this.chatDisplayService.addErrorMessage(ErrorType.SyntaxError);
            }
        }else{
            this.chatDisplayService.addErrorMessage(ErrorType.InvalidCommand);
        }
        return undefined;
    }

    

    /**
     * Returns the parameters specific to the command entered if its syntax was valid
     * @param commandName string of the command to execute
     * @param paramsInput string[] split at the spaces of the command input (without the command name)
     * @returns Default parameters and the command specific parameters if it has some
     */
    extractCommandParams(defaultParams:DefaultCommandParams,commandName:string,paramsInput:string[]):CommandParams|undefined{
        if(this.paramsMap.has(commandName)){
            const createCmdFunction:Function = this.paramsMap.get(commandName) as Function;
            const params = createCmdFunction.call(this,defaultParams,paramsInput);
            if(params) {
                return params;
            }
        }
        return undefined;
    }

    /**
     * Validates that for commands only needing a command name, only the command name was entered after the !
     * @param defaultParams the game service and who the command is from
     * @param paramsInput the params entered after the command name, empty if none were entered
     * @returns Default parameteres if there wasn't any text after the command name
     */
    isWithoutParams(defaultParams:DefaultCommandParams,paramsInput:string[]):CommandParams{
        if(paramsInput.length==0){
            return defaultParams;
        }
        return undefined;
    }



    /**
     * Returns the default command parameters, placing parameters and word to place if the syntax was valid.
     * @param defaultParams the game service and who the command is from
     * @param paramsInput the params entered after the command name. Should have 2 elements,
     *  the placing parameters and the word to place.
     * @returns Default parameteres and place commands parameters. If invalid syntax, returns undefined
     */
    extractPlaceParams(defaultParams:DefaultCommandParams,paramsInput:string[]):CommandParams{
        if(paramsInput.length==2){
            const word = this.removeAccents(paramsInput[1]);
            const positionOrientation = paramsInput[0];

            if(this.isValidWord(word) && this.isAllLowerLetters(positionOrientation)){
                const row = positionOrientation.slice(0,1);
                const column = positionOrientation.slice(1,-1);
                const coordinates = this.convertToCoordinates(row, column);
                if(coordinates){
                    const orientation = positionOrientation.slice(-1).toLowerCase();
                    if(orientation === HORIZONTAL || orientation === VERTICAL){
                        const placeParams = {position: coordinates, orientation:orientation, word:word};
                        const commandParams = {defaultParams:defaultParams,specificParams:placeParams};
                        return commandParams;
                    }
                }
            }
        }
        return undefined;
    }
    
    
    /**
     * Returns the default command parameters and letters to exchange if the command syntax was valid.
     * @param defaultParams the game service and who the command is from
     * @param paramsInput string[] for the params entered after the command name.
     *  Should only have 1 element, the letters to exchange.
     * @returns Default parameteres and a string for the letters to exchange. If invalid syntax, returns undefined
     */
    extractExchangeParams(defaultParams:DefaultCommandParams,paramsInput:string[]): CommandParams{
        if(paramsInput.length === 1){
            const letters = this.removeAccents(paramsInput[0]);
            const isValidLetterAmount = (letters.length > 0) && (letters.length < 8);
            if(isValidLetterAmount){
                if(this.isValidExchangeWord(letters)){
                    return {defaultParams:defaultParams,specificParams:letters};
                }
            }
        }
        return undefined;
    }
    
    // TODO: there are duplicate methods (in validation service)?
    removeAccents(letters:string):string{
        return letters.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Checks if the word is not empty and only has valid letters
     */
    isValidWord(word:string):boolean{
        let isValid:boolean = false;
        if(!this.isEmpty(word)){
            for(const letter of word){
                isValid = this.isValidLetter(letter);
                if(!isValid){
                    break;
                }
            }
        }
        return isValid;
    }

    /**
     * Checks if the word is not empty and only has valid letters including *
     */
    isValidExchangeWord(letters:string){
        let isValid:boolean = false;
        if(!this.isEmpty(letters)){
            if(this.isAllLowerLetters(letters)){
                for(const letter of letters){
                    isValid = this.isValidLetter(letter) || letter.charCodeAt(0) == '*'.charCodeAt(0);
                    if(!isValid){
                        break;
                    }
                }
            }
        }
        return isValid;
    }


    /**
     * Returns true if it is  a letter. False if it is not or has an accent or ç (replace accents and ç before using)
     */
    isValidLetter(letter:string):boolean{
        if(!this.isEmpty(letter) && letter.length == 1){
            const charCode = letter.toLowerCase().charCodeAt(0);
            const isALetter = (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0));
            return isALetter;
        }
        return false;
    }



    /**
     * Converts the string row and columns to coordinates with x and y between 0 to 14.
     * @param row String of the row number in letters
     * @param column string of the column number
     * @returns Vec2 of numbers x and y
     */
     convertToCoordinates(row: string, column: string):Vec2|undefined {
        let columnNumber = parseInt(column);
        if(columnNumber !== null){
            columnNumber = columnNumber - COLUMN_OFFSET;
            const rowNumber = row.toLowerCase().charCodeAt(0) - ROW_OFFSET;
            const isValidRow = rowNumber >= Row.A && rowNumber <= Row.O;
            const isValidColumn = columnNumber >= Column.One && columnNumber <= Column.Fifteen;
            if(isValidRow && isValidColumn){
                return {x:rowNumber,y:columnNumber};
            }
        }
        return undefined;
    }



    /**
     * Splits a string at the white spaces. 
     * @param commandInput the string to split
     * @returns sintrg[]. Returns empty array if the input was empty or only had white spaces
     */
    splitInput(commandInput:string):string[]{
        if(!this.isEmpty(commandInput)){
            return commandInput.split(' ');
        }
        return [];
    }


    /**
     * Removes white spaces at the beginning and end of a string.
     * @param userInput string Input from the user
     * @returns String without beginning and ending spaces. Returns empty string if it only had white spaces
     */
     trimSpaces(userInput: string): string {
        while(userInput.startsWith(' ')){
            userInput = userInput.substring(1);
        }
        while(userInput.endsWith(' ')){
            userInput = userInput.substring(0,userInput.length-1);
        }
        
        return userInput;
    }


    /**
     * Checks if a string is empty or filled only with white spaces.
     * @param userInput string Input from the user
     * @returns True if empty string or white space only string
     */
    isEmpty(userInput:string){
        userInput = this.trimSpaces(userInput);
        return (userInput === '');
    }

    isAllLowerLetters(letters:string):boolean{
        return (letters.toLowerCase() === letters);
    }

}
