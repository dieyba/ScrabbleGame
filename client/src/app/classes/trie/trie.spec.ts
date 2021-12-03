import { Trie } from './trie';

describe('Trie', () => {
    let trie: Trie = new Trie();

    it('should create an instance', () => {
        expect(new Trie()).toBeTruthy();
    });

    it('insert should return true when word exists', () => {
        expect(trie.insert('arbre')).toBeTruthy();
    })

    it('find should return true if word exists', () => {
        expect(trie.find('arbre')).toBeTruthy();
    })

    it('find should return false if word does not exists', () => {
        expect(trie.find('glito')).toBeFalsy();
    })
});
