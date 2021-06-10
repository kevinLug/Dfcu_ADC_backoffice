import {IDBPDatabase, openDB} from "idb";

class IndexedDbHandler {

    private idb: any;

    // private idbTransaction: any; // This line should only be needed if it is needed to support the object's constants for older browsers
    //
    // private idbKeyRange: any;

    private dbRequest: any;

    private db: IDBPDatabase<any> | undefined;

    constructor() {
        // @ts-ignore
        // this.idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        // // @ts-ignore
        // this.idbTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}
        // // @ts-ignore
        // this.idbKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        // this.openDb()
    }

    async setUpDb(dbName: string) {
        this.db = await openDB(dbName, 1, {

        });
    }

    async setUpStore(storeName:string){
        // @ts-ignore
        this.db.createObjectStore(storeName);
    }

    isSupported() {

        return window.indexedDB;

    }
    //
    // private openDb() {
    //     this.dbRequest = this.idb.open("testing_db");
    //     this.onUpgradeNeeded();
    // }

    private onUpgradeNeeded() {
        this.dbRequest.onupgradeneeded = () => {
            this.db = this.dbRequest.result;
        }
    }

    public getDb() {
        return this.db;
    }

    getDbRequest() {
        return this.dbRequest;
    }


}

let idbHandler = new IndexedDbHandler()

export default idbHandler