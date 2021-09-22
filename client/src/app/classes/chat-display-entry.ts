// TODO : Déplacer enums dans un fichier séparé accessible par tous
export enum AuthorType {
    System = 'System',
    Adversary = 'Adversary',
    Player = 'Player',
}
export enum ChatEntryColor {
    SystemColor = 'black',
    PlayerColor = 'blue',
    AdversaryColor = 'red',
}

export enum ErrorType {
    SyntaxError,
    InvalidCommand,
    ImpossibleCommand,
}
export interface ChatDisplayEntry {
    authorType: AuthorType;
    color: ChatEntryColor;
    message: string;
}
