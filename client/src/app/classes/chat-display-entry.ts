export interface ChatDisplayEntry {
    authorType: AuthorType;
    color: ChatEntryColor;
    message: string;
}

export enum ChatEntryColor {
    SystemColor = 'black',
    LocalPlayer = 'blue',
    RemotePlayer = 'red',
}

export enum AuthorType {
    System = 'System',
    LocalPlayer = 'LocalPlayer',
    RemotePlayer = 'RemotePlayer',
}

