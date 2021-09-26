export interface ChatDisplayEntry {
    authorType: AuthorType;
    color: ChatEntryColor;
    message: string;
}

export enum ChatEntryColor {
    SystemColor = 'black',
    PlayerColor = 'blue',
    AdversaryColor = 'red',
}

// TODO : Déplacer (ou supprimer) enums dans un fichier séparé au besoin
// probably going to be replaced by a validation by chat display depending on user who sent msg vs user who receives msg.
export enum AuthorType {
    System = 'System',
    Adversary = 'Adversary',
    Player = 'Player',
}

