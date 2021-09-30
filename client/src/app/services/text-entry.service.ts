import { Injectable } from '@angular/core';
import { Command, CommandParams, DefaultCommandParams } from '../classes/commands';
import { createDebugCmd } from '../classes/debugCommand';
import { ErrorType } from '../classes/errors';
import { createExchangeCmd, ExchangeCmd } from '../classes/exchangeCommand';
import { createPassCmd } from '../classes/passCommand';
import { createPlaceCmd } from '../classes/placeCommand';
import { Column, Row } from '../classes/scrabble-board';
import { Vec2 } from '../classes/vec2';
import { ChatDisplayService } from './chat-display.service';
import { SoloGameService } from './solo-game.service';


const DEBUG_CMD = 'debug';
const EXCHANGE_CMD = 'échanger';
const PASS_CMD = 'passer';
const PLACE_CMD = 'placer';

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

        this.paramsMap.set(DEBUG_CMD,this.extractDebugParams);
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
    handleInput(userInput: string, isLocalPlayer:boolean) {  
        const playerName = isLocalPlayer?
            this.gameService.localPlayer.name:
            this.gameService.virtualPlayer.name; 
        userInput = this.trimSpaces(userInput);
        if(!this.isEmpty(userInput)){
            if(userInput.startsWith("!")) {
                const commandCreated = this.createCommand(userInput,isLocalPlayer);
                if(commandCreated){
                    const commandResult = commandCreated.execute();
                    if(commandResult === ErrorType.NoError){
                        if(commandCreated instanceof ExchangeCmd){
                            // Only exchange success message depends on who called the command
                            userInput= this.chatDisplayService.createExchangeMessage(isLocalPlayer, userInput);
                        }
                        // Command executed successfully
                        this.chatDisplayService.addPlayerEntry(isLocalPlayer,playerName,userInput);
                    }else{
                        // Command not executed successfully
                        this.chatDisplayService.addErrorMessage(commandResult,userInput);
                    }
                }
            } else {
                // Not a command input. Send normal chat message
                this.chatDisplayService.addPlayerEntry(isLocalPlayer, playerName, userInput);
            }
        }
    }
    
    
   private createCommand(commandInput:string,isLocalPlayer:boolean):Command|undefined{
        const splitInput = this.splitCommandInput(commandInput);
        const commandName = splitInput.shift() as string;
        // Validate command name entered after the !
        if(this.commandsMap.has(commandName)){
            // Get the function to create the command
            const createCmdFunction:Function = this.commandsMap.get(commandName) as Function;
            const defaultParams = {gameService:this.gameService,isFromLocalPlayer:isLocalPlayer};
            // Validate and return the command parameters
            const commandParams = this.extractCommandParams(defaultParams,commandName,splitInput);
            if(commandParams){
                return createCmdFunction.call(this,commandParams);
            }
            else{
                this.chatDisplayService.addErrorMessage(ErrorType.SyntaxError, commandInput);
            }
        }else{
            this.chatDisplayService.addErrorMessage(ErrorType.InvalidCommand, commandInput);
        }
        return undefined;
    }

    

    /**
     * Returns the parameters specific to the command entered if its syntax was valid
     * @param commandName string of the command to execute
     * @param paramsInput string[] split at the spaces of the command input (without the command name)
     * @returns Default parameters and the command specific parameters if it has some
     */
     private extractCommandParams(defaultParams:DefaultCommandParams,commandName:string,paramsInput:string[]):CommandParams|undefined{
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
     private isWithoutParams(defaultParams:DefaultCommandParams,paramsInput:string[]):CommandParams{
        if(paramsInput.length==0){
            return defaultParams;
        }
        return undefined;
    }

    private extractDebugParams(defaultParams:DefaultCommandParams,paramsInput:string[]):CommandParams{
        const isdefaultParams = this.isWithoutParams(defaultParams,paramsInput);
        if(isdefaultParams){
            return {defaultParams:defaultParams,specificParams:this.chatDisplayService};
        }
        return isdefaultParams;
    }

    /**
     * Returns the default command parameters, placing parameters and word to place if the syntax was valid.
     * @param defaultParams the game service and who the command is from
     * @param paramsInput the params entered after the command name. Should have 2 elements,
     *  the placing parameters and the word to place.
     * @returns Default parameteres and place commands parameters. If invalid syntax, returns undefined
     */
     private extractPlaceParams(defaultParams:DefaultCommandParams,paramsInput:string[]):CommandParams{
        if(paramsInput.length==2){
            const word = this.removeAccents(paramsInput[1]);
            const positionOrientation = paramsInput[0];

            if(this.isValidWordInput(word) && this.isAllLowerLetters(positionOrientation)){
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
     private extractExchangeParams(defaultParams:DefaultCommandParams,paramsInput:string[]): CommandParams{
        if(paramsInput.length === 1){
            const letters = paramsInput[0];
            const hasAccents = (letters !== this.removeAccents(letters));
            if(!hasAccents && this.isAllLowerLetters(letters)){
                const isValidLetterAmount = (letters.length > 0) && (letters.length < 8);
                if(isValidLetterAmount){
                    if(this.isValidExchangeWord(letters)){
                        return {defaultParams:defaultParams,specificParams:letters};
                    }
                }
            }
        }
        return undefined;
    }
    

    /**
     * Checks if the word is not empty and only has valid letters
     */
     private isValidWordInput(word:string):boolean{
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
     private isValidExchangeWord(letters:string):boolean{
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


    private removeAccents(letters:string):string{
        return letters.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Returns true if it is  a letter. False if it is not or has an accent or ç
     */
     private isValidLetter(letter:string):boolean{
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
    private convertToCoordinates(row: string, column: string):Vec2|undefined {
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
     * Takes the command input entered by player, removes the ! and splits the string at the white spaces. 
     * @param commandInput the string to split
     * @returns sintrg[]. Returns empty array if the input was empty or only had white spaces
     */
     private splitCommandInput(commandInput:string):string[]{
        if(commandInput.startsWith('!')){
            return commandInput.substring(1).split(' ');
        }
        return [];
    }


    /**
     * Removes white spaces at the beginning and end of a string.
     * @param userInput string Input from the user
     * @returns String without beginning and ending spaces. Returns empty string if it only had white spaces
     */
     private trimSpaces(userInput: string): string {
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
     private isEmpty(userInput:string){
        userInput = this.trimSpaces(userInput);
        return (userInput === '');
    }
    
    private isAllLowerLetters(letters:string):boolean{
        return (letters.toLowerCase() === letters);
    }

}
