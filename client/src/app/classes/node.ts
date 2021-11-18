export class Node {
    isWord: boolean;
    content: string;
    children: Map<string, Node> = new Map<string, Node>();
    constructor(content?: string) {
        this.content = '';
        this.isWord = false;
        if (content) {
            this.content = content;
        }
    }
}
