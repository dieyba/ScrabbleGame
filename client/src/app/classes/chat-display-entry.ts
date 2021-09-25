export interface ChatDisplayEntry {
    authorType: AuthorType;
    color: ChatEntryColor;
    message: string;
}

// TODO : Déplacer (ou supprimer) enums dans un fichier séparé au besoin

// probably going to be replaced by a validation by chat display depending on user who sent msg vs user who receives msg.
export enum AuthorType {
    System = 'System',
    Adversary = 'Adversary',
    Player = 'Player',
}

// or change to const and put it directly in chat display
export enum ChatEntryColor {
    SystemColor = 'black',
    PlayerColor = 'blue',
    AdversaryColor = 'red',
}

// or add callable fonctions for each in chat display? depends what format each error msg needs to have
export enum ErrorType {
    SyntaxError,
    InvalidCommand,
    ImpossibleCommand,
}
