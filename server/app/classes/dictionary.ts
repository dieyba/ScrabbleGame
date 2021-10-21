export enum DictionaryType {
    Default = 0,
    English = 1,
    // Other dictionaries
}

export class Dictionary {
    title: string;
    description: string;
    words: string[];
}
