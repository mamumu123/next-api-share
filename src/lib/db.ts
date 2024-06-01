// db.ts
import Dexie, { Table } from 'dexie';

interface IData {
    [key: string]: {
        channels: number
        width: number
        height: number
        data: number[]
    }
}

export interface FileData {
    id?: number;
    name: string;
    data: IData;
}

export class FileDexie extends Dexie {

    files!: Table<FileData>;


    constructor() {
        super('myDatabase');
        this.version(1).stores({
            files: '++id, name, data' // Primary key and indexed props
        });
    }
}

export const dbFileDexie = new FileDexie();