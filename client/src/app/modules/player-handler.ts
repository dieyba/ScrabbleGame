import { LocalPlayer } from '@app/classes/local-player';

export namespace PlayerHandler {
    let activePlayer: LocalPlayer;
    // let activeSocket: io.Socket;
    export function requestPlayer(/* activeSocket: io.Socket*/): LocalPlayer {
        if (activePlayer === undefined) {
            activePlayer = new LocalPlayer('' /* , activeSocket.id*/);
        }
        return activePlayer;
    }
}
