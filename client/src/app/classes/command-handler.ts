// en se basant sur le code présenté en classe

import { Command, DebugCmd } from "./commands";

const CMD_SEPARATOR = ' ';

const DEBUG_CMD = 'debug';
// const PASS_CMD = "pass";
// const PLACE_CMD = "place";
// const SWTICH_CMD = "switch";


// type placeCmdInput = {
//     row: string;
//     col: string;
//     word: string;
// }


// find better name?
type getCommandResult = Command|undefined;

export class CommandHandler {
    private commands : Map<string, Command>;
    private currentCmdName : string;
    private currentCmdParam : string[]
    // add attributes to keep the value of the current enteredCmd string?

    constructor(){
        this.currentCmdName = "Command";
        this.currentCmdParam = [];
        this.commands = new Map<string, Command>();
        this.commands.set(DEBUG_CMD, new DebugCmd); // what in the world did the teacher use here?
    }

    handleCommand(enteredCmd:string): Boolean {
        this.parsingCommand(enteredCmd); //test, to remove
        return true;
        
        // let result:getCommandResult = this.getCommand(enteredCmd);
        // if(result){
        //     result.execute();
        // }else{
        //     // add invalid command error type to chat display
        // }
    }


    privategetCommand(enteredCmd: string) : getCommandResult {
        if(this.commands.has(enteredCmd)){
            // return this.commands.get(enteredCmd); //find a way to add param if needed
        }
        return undefined;
    }

    private parsingCommand(enteredCmd:string): void{
        // add validation for word lenght ig?
        // if(enteredCmd.length > 1)
        this.currentCmdParam = [];
        this.currentCmdName = enteredCmd.substring(1); 
        
        if(this.currentCmdName.includes(CMD_SEPARATOR)){
            this.currentCmdParam = this.currentCmdName.split([CMD_SEPARATOR][0]); // determiner la limit de split à set.
            this.currentCmdName = this.currentCmdParam.pop()!; //is that good practice? or add validation to check if array is undefined
        }
    };
}
