import { ChatDisplayEntry, ChatEntryColor, createErrorEntry } from '@app/classes/chat-display-entry/chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from '@app/classes/commands/commands';
import { ErrorType } from '@app/classes/errors';
import { GameService } from '@app/services/game.service/game.service';

export class ExchangeCmd extends Command {
    private gameService: GameService;
    private letters: string;

    constructor(defaultParams: DefaultCommandParams, letters: string) {
        super(defaultParams.player);
        this.gameService = defaultParams.serviceCalled as GameService;
        this.letters = letters;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.ExchangeCmd;
        const executionResult = this.gameService.exchangeLetters(this.player, this.letters);

        if (executionResult === ErrorType.ImpossibleCommand) {
            const commandAndLetters = commandMessage + ' ' + this.letters;
            executionMessages.push(createErrorEntry(executionResult, commandAndLetters));
        } else {
            this.isExecuted = true;
            const localPlayerName = this.gameService.game.getLocalPlayer().name;
            const opponentPlayerName = this.gameService.game.getOpponent().name;
            const isFromLocalPLayer = this.player.name === localPlayerName;
            const preMessage = isFromLocalPLayer ? localPlayerName : opponentPlayerName;
            const colorFirstMessage = isFromLocalPLayer ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer;
            const colorSecondMessage = !isFromLocalPLayer ? ChatEntryColor.RemotePlayer : ChatEntryColor.LocalPlayer;
            const executionMessageLocal = preMessage + ' >> ' + commandMessage + ' ' + this.createExchangeMessage(isFromLocalPLayer, this.letters);
            const executionMessageRemote = preMessage + ' >> ' + commandMessage + ' ' + this.createExchangeMessage(!isFromLocalPLayer, this.letters);
            executionMessages.push({ color: colorFirstMessage, message: executionMessageLocal });
            executionMessages.push({ color: colorSecondMessage, message: executionMessageRemote });
        }
        return { isExecuted: this.isExecuted, executionMessages };
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
