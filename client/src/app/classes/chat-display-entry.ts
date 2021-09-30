export interface ChatDisplayEntry {
    color: ChatEntryColor;
    message: string;
}

export enum ChatEntryColor {
    SystemColor = 'black',
    LocalPlayer = 'blue',
    RemotePlayer = 'red',
}

