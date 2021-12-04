import { ObjectId } from 'bson';
export interface DictionaryInterface {
    _id: ObjectId;
    title: string;
    description: string;
    words: string[];
}
