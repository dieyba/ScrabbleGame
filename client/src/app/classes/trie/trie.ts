import { Dictionary, DictionaryType } from '@app/classes/dictionary/dictionary';
import { Node } from '@app/classes/node/node';
// Implemented from www.codeguru.co.in/2021/10/implement-trie-data-structure-in.html
export class Trie {
    root: Node;
    constructor() {
        this.root = new Node();
        this.initializeDictionary();
    }
    initializeDictionary() {
        const dictionary: Dictionary = new Dictionary(DictionaryType.Default);
        for (const word of dictionary.words) {
            this.insert(word);
        }
    }
    insert(word: string): void {
        if (word === null) {
            return;
        }
        word = word.toLowerCase();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current = this.root;
        for (const character of word) {
            if (current.children.get(character) === undefined) {
                current.children.set(character, new Node(character));
            }
            current = current.children.get(character) as Node;
        }
        current.isWord = true;
    }
    find(word: string): boolean {
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            const ch = word.charAt(i);
            const node = current.children.get(ch);
            if (node == null) {
                return false;
            }
            current = node;
        }
        return current.isWord;
    }
}
