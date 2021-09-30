import { ChatDisplayService } from "@app/services/chat-display.service";
import { Command, DebugParams, DefaultCommandParams } from "./commands";
import { ErrorType } from "./errors";

export class DebugCmd extends Command {
    chatDisplayService:ChatDisplayService;
    constructor(defaultParams:DefaultCommandParams, chatDisplayService:ChatDisplayService) {
        super(defaultParams);
        this.chatDisplayService = chatDisplayService;
    }
    
    execute(): ErrorType {
        return this.chatDisplayService.invertDebugState();
    }
}

export const createDebugCmd = function (params:{defaultParams:DefaultCommandParams,specificParams:DebugParams}){
    if(params){
        return new DebugCmd(params.defaultParams,params.specificParams);
    }
    return undefined;
};