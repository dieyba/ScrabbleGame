import { Injectable } from '@angular/core';
import { AuthorType, ChatDisplayEntry, ChatEntryColor, ErrorType } from '@app/classes/chat-display-entry';

const ERROR_MESSAGES = new Map([
    [ErrorType.SyntaxError, 'Syntax error'],
    [ErrorType.InvalidCommand, 'Invalid command'],
    [ErrorType.ImpossibleCommand, 'Impossible command'],
]);

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    entries: ChatDisplayEntry[] = [];

    // TODO: calculer valeur de isAdversary selon l'identite de l'auteur du message
    /**
     * @description Add normal text and validated commands.
     *
     * @param isAdversary Bool that indicates if the message comes from adversary
     * @param playerMessage Text or executed command
     */
    addPlayerEntry(isAdversary: boolean, playerMessage: string): void {
        this.entries.push({
            authorType: isAdversary ? AuthorType.Adversary : AuthorType.Player,
            color: isAdversary ? ChatEntryColor.AdversaryColor : ChatEntryColor.PlayerColor,
            message: playerMessage,
        });
    }

    /**
     * @description Error message to be sent by "system". Follow this format:
     * ERROR_TYPE: INVALID_COMMAND
     * Example: Commande invalide: !placerr
     *
     * @param errorMessage Error message to be sent by "system"
     */
    addErrorMessage(errorType: ErrorType): void {
        this.entries.push({
            authorType: AuthorType.System,
            color: ChatEntryColor.SystemColor,
            message: ERROR_MESSAGES.get(errorType) as string,
        });
    }
}
