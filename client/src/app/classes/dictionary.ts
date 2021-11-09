export enum DictionaryType {
    Default = 0,
    English = 1, // TODO: see if we need to give each type a name instead of number (to display in forms when selecting a dictionary)
    // Other dictionaries
}


// TODO: to delete the rest from client

// import dict_path from 'src/assets/dictionnary.json';

// export class Dictionary {
//     title: string;
//     description: string;
//     words: string[];
//     constructor(type: DictionaryType) {
//         this.selectDictionary(type);
//     }

//     selectDictionary(type: DictionaryType): void {
//         switch (type) {
//             case DictionaryType.Default:
//                 this.initializeDictionary(dict_path as Dictionary);
//         }
//     }

//     initializeDictionary(dict: Dictionary) {
//         const currentDictionary = dict;
//         this.title = currentDictionary.title;
//         this.description = currentDictionary.description;
//         this.words = currentDictionary.words;
//     }
// }
