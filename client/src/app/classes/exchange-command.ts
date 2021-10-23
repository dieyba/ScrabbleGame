import { SoloGameService } from '@app/services/solo-game.service';
import { ChatDisplayEntry, createErrorEntry, createPlayerEntry } from './chat-display-entry';
import { Command, CommandName, DefaultCommandParams } from './commands';
import { ErrorType } from './errors';

export class ExchangeCmd extends Command {
    private gameService: SoloGameService;
    private letters: string;

    constructor(defaultParams: DefaultCommandParams, letters: string) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as SoloGameService;
        this.letters = letters;
    }

    execute(): ChatDisplayEntry[] {
        let executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.EXCHANGE_CMD;
        const executionResult = this.gameService.exchangeLetters(this.player, this.letters);
        
        if(executionResult === ErrorType.ImpossibleCommand){
            const commandAndLetters = commandMessage + ' ' + this.letters;
            executionMessages.push(createErrorEntry(executionResult,commandAndLetters));
        }else{
            const isFromLocalPLayer = this.player.name === this.gameService.localPlayer.name;
            const exchangeMessage = this.createExchangeMessage(isFromLocalPLayer, this.letters);
            const commandAndLetters = commandMessage + ' ' + exchangeMessage;
            executionMessages.push(createPlayerEntry(isFromLocalPLayer,this.player.name,commandAndLetters));
        }
        return executionMessages;
    }

    createExchangeMessage(isFromLocalPLayer: boolean, letters: string): string {
        if (isFromLocalPLayer) {
            return letters;
        } else {
            const lettersNum = letters.length.toString();
            return lettersNum + ' lettre(s)';
        }
    }
}

export const createExchangeCmd = (params: { defaultParams: DefaultCommandParams; specificParams: string }): ExchangeCmd => {
    return new ExchangeCmd(params.defaultParams, params.specificParams);
};
