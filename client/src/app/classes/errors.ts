
// TODO: potentially to duplicate on server (à voir après avoir implémenté game service dans le serveur)

export enum ErrorType {
    NoError,
    SyntaxError,
    InvalidCommand,
    ImpossibleCommand,
}

export const ERROR_MESSAGES = new Map([
    [ErrorType.SyntaxError, 'Erreur de syntaxe, vérifiez les paramètres de commande entrés'],
    [ErrorType.InvalidCommand, 'Entrée invalide, vérifiez le nom de la commande entrée'],
    [ErrorType.ImpossibleCommand, 'Commande impossible à exécuter'],
]);
