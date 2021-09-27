import { Injectable } from '@angular/core';
import { ChatDisplayService } from './chat-display.service';
import { ErrorType } from '@app/classes/errors';
import { GameService, Command, DebugCmd, ExchangeCmd, PassTurnCmd, PlaceCmd, PlaceParams } from '../classes/commands';
import { Vec2 } from '../classes/vec2';
import { Row, Column } from '@app/classes/scrabble-board';

// TODO: voir leurs consignes pour les constantes
const DEBUG_CMD = 'debug';
const EXCHANGE_CMD = 'échanger';
const PASS_CMD = 'passer';
const PLACE_CMD = 'placer';
const COMMAND_LIST = [DEBUG_CMD,EXCHANGE_CMD,PASS_CMD,PLACE_CMD];
const EMPTY_STRING = '';
const SPACE_CHAR = ' ';
const ROW_OFFSET = 'a'.charCodeAt(0);
const COLUMN_OFFSET = 1;
const HORIZONTAL = 'h';
const VERTICAL = 'v';
const A_CHAR = 'a'.charCodeAt(0);
const Z_CHAR = 'z'.charCodeAt(0);
const ASTERISK_CHAR = '*'.charCodeAt(0);

type ExtractedParams = PlaceParams|string|undefined;


@Injectable({
    providedIn: 'root',
})
export class TextEntryService {
    commandNames : Set<string>;
    fakeGameService : GameService; 

    constructor(private chatDisplayService: ChatDisplayService) {
        this.fakeGameService = new GameService;
        this.commandNames = new Set;
        for(const i in COMMAND_LIST){
            this.commandNames.add(COMMAND_LIST[i].toString());
        }
    }

    /**
     * @description This function verifies if the input is a valid command or
     * just text. It doesn't check the command's arguments of the command.
     *
     * @param text Text input from user
     */
    handleInput(userInput: string) {   
        // TODO: Check who sent the message
        const isAdversaryMessage = false;
        // TODO: trim beginning and end?
        userInput = this.trimSpaces(userInput);

        if(!this.isEmpty(userInput)){
            if(userInput.startsWith("!")) {
                const splitInput = this.splitInput(userInput.substring(1));
                const command = this.createCommand(splitInput);
                if(command){
                    command.execute()?
                    this.chatDisplayService.addPlayerEntry(isAdversaryMessage, userInput):
                    this.chatDisplayService.addErrorMessage(ErrorType.ImpossibleCommand);
                }
            } else {
                this.chatDisplayService.addPlayerEntry(isAdversaryMessage, userInput);
            }
        }
    }

    
    // TODO: do that with a map and write a create commands for each commands?
    createCommand(commandInput:string[]):Command|undefined{
        const commandName = commandInput.shift() as string;
        if(this.isValidCommandName(commandName)){
            if(commandName === DEBUG_CMD){
                if(commandInput.length==0){
                    return new DebugCmd(this.fakeGameService);
                }
            }
            else if(commandName === EXCHANGE_CMD){
                const params = this.extractExchangeParams(commandInput);
                if(params){
                    return new ExchangeCmd(this.fakeGameService,params as string);
                }
            }
            else if(commandName === PASS_CMD){
                if(commandInput.length==0){
                    return new PassTurnCmd(this.fakeGameService);
                }
            }
            else if(commandName === PLACE_CMD){
                const params = this.extractPlaceParams(commandInput);
                if(params){
                    return new PlaceCmd(this.fakeGameService,params as PlaceParams);
                }
            }
            this.chatDisplayService.addErrorMessage(ErrorType.SyntaxError);
        }
        return undefined;
    }


    // !placer a15v mot
    extractPlaceParams(paramsInput:string[]):ExtractedParams{
        console.log(paramsInput);

        if(paramsInput.length==2){
            const word = paramsInput[1];
            const positionOrientation = paramsInput[0];
            if(this.isValidWord(word)){
                const row = positionOrientation.slice(0,1);
                const column = positionOrientation.slice(1,-1); //a_h or a__h
                const coordinates = this.convertToCoordinates(row, column);
                if(coordinates){
                    const orientation = positionOrientation.slice(-1).toLowerCase();
                    if(orientation === HORIZONTAL || orientation === VERTICAL){
                        const params: PlaceParams = {position: coordinates, orientation:orientation, letters:word};
                        console.log(params);
                        return params;
                    }
                }
            }
        }
        return undefined;
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


    // !échanger lettres
    extractExchangeParams(paramsInput:string[]): ExtractedParams{
        if(paramsInput.length === 1){
            const letters = paramsInput[0];
            const isValidLetterAmount = (letters.length > 0) && (letters.length < 8);
            if(isValidLetterAmount){
                if(this.isValidWord(letters)){
                    return letters;
                }
            }
        }
        return undefined;
    }


    isValidWord(letters:string):boolean{
        let isValid:boolean = false;
        if(!this.isEmpty(letters)){
            for(const letter of letters){
                isValid = this.isValidExchangeLetter(letter);
                if(!isValid){
                    break;
                }
            }
        }
        return isValid;
    }


    isValidExchangeLetter(letter:string):boolean{
        if(!this.isEmpty(letter)){
            const charCode = letter.toLowerCase().charCodeAt(0);
            return  (charCode >= A_CHAR && charCode <= Z_CHAR)|| (charCode == ASTERISK_CHAR);
        }
        return false;
    }

    
    /**
     * Checks if the command entered has a valid name. Sends error message if not.
     * @param commandInput string[] of the command entered split at the white spaces
     * @returns True if valid name
     */
     isValidCommandName(commandName:string):boolean{
        if(!this.commandNames.has(commandName)){
            this.chatDisplayService.addErrorMessage(ErrorType.InvalidCommand);
            return false;
        }
        return true;
    }



    splitInput(commandInput:string):string[]{
        if(!this.isEmpty(commandInput)){
            return commandInput.split(SPACE_CHAR);
        }
        return [];
    }


    /**
     * Removes white spaces at the beginning and end of a string.
     * @param userInput Input from the user
     * @returns String without beginning and ending spaces. Returns empty string if it only had white spaces
     */
     trimSpaces(userInput: string): string {
        while(userInput.startsWith(SPACE_CHAR)){
            userInput = userInput.substring(1);
        }
        while(userInput.endsWith(SPACE_CHAR)){
            userInput = userInput.substring(0,userInput.length-1);
        }
        
        return userInput;
    }

    /**
     * Checks if a string is empty.
     * @param userInput 
     * @returns True if empty string or white space only string
     */
    isEmpty(userInput:string){
        userInput = this.trimSpaces(userInput);
        return (userInput === EMPTY_STRING);
    }

}
