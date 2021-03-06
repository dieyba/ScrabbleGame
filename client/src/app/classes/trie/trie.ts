import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { Node } from '@app/classes/node/node';
// Implemented from www.codeguru.co.in/2021/10/implement-trie-data-structure-in.html
export class Trie {
    root: Node;
    constructor(dictionary: DictionaryInterface) {
        this.root = new Node();
        this.initializeDictionary(dictionary);
    }

    initializeDictionary(dictionary: DictionaryInterface) {
        for (const word of dictionary.words) {
            this.insert(word);
        }
    }
    insert(word: string): boolean {
        word = word.toLowerCase();
        let current = this.root;
        for (const character of word) {
            if (current.children.get(character) === undefined) {
                current.children.set(character, new Node(character));
            }
            current = current.children.get(character) as Node;
        }
        return (current.isWord = true);
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
