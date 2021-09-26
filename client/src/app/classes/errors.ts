export enum ErrorType {
    SyntaxError,
    InvalidCommand,
    ImpossibleCommand,
}

// TODO: Voir si inclure commande erronée dans le msg
export const ERROR_MESSAGES = new Map([
    [ErrorType.SyntaxError, 'Syntax error'],
    [ErrorType.InvalidCommand, 'Invalid command'],
    [ErrorType.ImpossibleCommand, 'Impossible command'],
]);