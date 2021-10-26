import { LocalPlayer } from '@app/classes/local-player';

export namespace PlayerHandler {
    let activePlayer: LocalPlayer;

    export function requestPlayer(): LocalPlayer {
        if (activePlayer === undefined) {
            activePlayer = new LocalPlayer('');
        }
        return activePlayer;
    }
}
