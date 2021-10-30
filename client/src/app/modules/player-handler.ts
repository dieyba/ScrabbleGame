import { LocalPlayer } from '@app/classes/local-player';

export namespace PlayerHandler {
    let activePlayer: LocalPlayer;
    // let activeSocket: io.Socket;
    export function requestPlayer(): LocalPlayer {
        if (activePlayer === undefined) {
            activePlayer = new LocalPlayer('dieyba');
        }
        return activePlayer;
    }
}
