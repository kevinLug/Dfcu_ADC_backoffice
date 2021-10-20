import { IDBPDatabase, IDBPObjectStore, openDB } from "idb";

export interface IIndex {
  name: string;
  path: string;
  unique: boolean;
}

class IndexedDbManager {
  private readonly database: string;
  private db: any;

  private static objectStore: any;

  public static setObjectStore(objectStore: any): void {
    IndexedDbManager.objectStore = objectStore;
  }

  public static getObjectStore(): IDBPObjectStore {
    return IndexedDbManager.objectStore;
  }

  constructor(database: string) {
    this.database = database;
  }

  public async createObjectStore(tableNames: string[], indices?: Array<IIndex>) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }

            const store = db.createObjectStore(tableName, {keyPath: "branchCode" });

            if (indices && indices.length > 0) {
              for (const index of indices) {
                console.log("creating index:--> ", index.name, "unique:--> ", index.unique);
                store.createIndex(index.name, index.path, { unique: index.unique });
              }
            }

            IndexedDbManager.setObjectStore(store);
          }
        },
      });
    } catch (error) {}
  }

  public async getValue(tableName: string, id: any) {
    const tx = this.db.transaction(tableName, "readonly");

    const store = tx.objectStore(tableName);

    const result = await store.get(id);
    console.log("Get Data ", JSON.stringify(result));
    return result;
  }

  public async getAllValue(tableName: string) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    // console.log('Get All Data', JSON.stringify(result));
    return result;
  }

  public async clearStore(tableName: string) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    await store.clear();
    console.log("Clearing All Data");
  }

  public async putValue(tableName: string, value: object) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
    console.log("Put Data ", JSON.stringify(result));
    return result;
  }
  public async putBulkValue(tableName: string, values: object[]) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    for (const value of values) {
      const result = await store.put(value);
      console.log("Put Bulk Data ", JSON.stringify(result));
    }
    return this.getAllValue(tableName);
  }
  public async deleteValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      console.log("Id not found", id);
      return result;
    }
    await store.delete(id);
    console.log("Deleted Data", id);
    return id;
  }
}

export default IndexedDbManager;
