import { ChatDisplayService } from '@app/services/chat-display.service';
import { ChatDisplayEntry, ChatEntryColor, createPlayerEntry } from './chat-display-entry';
import { Command, CommandName, CommandResult, DefaultCommandParams } from './commands';

const HELP_INTRO_MESSAGE = 'Il y a 6 commandes:';
const HELP_MESSAGE = '!aide : affiche une explication des commandes';
const HELP_DEBUG = '!debug : affiche des messages de débogage';
const HELP_EXCHANGE = '!échanger lettres: échange des lettres du chevalet avec la réserve';
const HELP_PASS = '!passer: permet de passer son tour';
const HELP_PLACE = '!placer rangéeColonneOrientation mot: permet de valider et placer un mot sur le plateau.';
const HELP_PLACE_PARAMS = '(rangée: a-o, colonne: 1-15, orientation: h ou v, mot: lettres blanches en majuscule)';
const HELP_STOCK = '!réserve : affiche les lettres restantes dans la réserve';
export const HELP_MESSAGES = [HELP_INTRO_MESSAGE, HELP_MESSAGE, HELP_DEBUG, HELP_EXCHANGE, HELP_PASS, HELP_PLACE, HELP_PLACE_PARAMS, HELP_STOCK];

const IS_FROM_LOCAL_PLAYER = true;

export class HelpCmd extends Command {
    chatDisplayService: ChatDisplayService;

    constructor(defaultParams: DefaultCommandParams) {
        super(defaultParams.player);
        this.chatDisplayService = defaultParams.serviceCalled as ChatDisplayService;
    }

    execute(): CommandResult {
        const executionMessages: ChatDisplayEntry[] = [];
        const commandMessage = '!' + CommandName.HelpCmd;
        executionMessages.push(createPlayerEntry(IS_FROM_LOCAL_PLAYER, this.player.name, commandMessage));
        this.isExecuted = true;
        for (const message of HELP_MESSAGES) {
            executionMessages.push({ color: ChatEntryColor.SystemColor, message });
        }
        return { isExecuted: this.isExecuted, executionMessages };
    }
}

export const createHelpCmd = (defaultParams: DefaultCommandParams): HelpCmd => {
    return new HelpCmd(defaultParams);
};
