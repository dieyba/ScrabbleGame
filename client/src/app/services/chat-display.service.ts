import { Injectable } from '@angular/core';
import { AuthorType, ChatDisplayEntry, ChatEntryColor } from '@app/classes/chat-display-entry';
import { ErrorType, ERROR_MESSAGES } from '@app/classes/errors';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    entries: ChatDisplayEntry[] = [];

    /**
     * @description Add normal text and validated commands.
     *
     * @param isAdversary Bool that indicates if the message comes from adversary
     * @param playerMessage Text or executed command
     */
    addPlayerEntry(isLocalPlayer: boolean, playerMessage: string): void {
        this.entries.push({
            // TODO:see if keep author type or juste take a player object to get his name and whether hes active or not.
            authorType: isLocalPlayer ? AuthorType.LocalPlayer : AuthorType.RemotePlayer,
            color: isLocalPlayer ? ChatEntryColor.LocalPlayer : ChatEntryColor.RemotePlayer,
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
