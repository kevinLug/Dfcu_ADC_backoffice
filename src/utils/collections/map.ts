import { IList } from "./list";
import { List } from "./list";

export interface IKeyValueMap<K, V> extends Iterator<any> {
    put(key: K, value: V): void;

    putAll(map: IKeyValueMap<K, V>): void;

    remove(key: K): void;

    clear(): void;

    get(key: K): V | undefined;

    size(): number;

    isEmpty(): boolean;

    containsKey(key: K): boolean;

    replace(oldKey: K, newValue: V): V | undefined;

    getValues(): IList<V>;

    getKeys(): IList<K>;

    getKeyValuePair(): IKeyValueObject<K, V>;

    keyValueMapToArray(): IKeyValueObject<K, V>[];

    [Symbol.iterator](): Iterator<IKeyValueObject<K, V>>;

    // forEach(callback: (key:K,value:V, index: number) => V, thisArg?: any): void
}

export interface IKeyValueObject<K, V> {
    key: K;
    value: V;
}

export class KeyValueMap<K, V> implements IKeyValueMap<K, V> {
    private readonly pair: Map<K, V>;

    constructor() {
        this.pair = new Map<K, V>();
    }

    put(key: K, value: V): void {
        const kv: IKeyValueObject<K, V> = {
            key: key,
            value: value,
        };
        this.pair.set(kv.key, kv.value);
    }

    putAll(map: IKeyValueMap<K, V>): void {
        const listOfKeys = map.getKeys();
        for (let key of listOfKeys) {
            const value = map.get(key);
            // @ts-ignore
            this.put(key, value);
        }
    }

    remove(k: K): void {
        this.pair.delete(k);
    }

    clear(): void {
        this.pair.clear();
    }

    get(k: K): V | undefined {
        return this.pair.get(k);
    }

    size(): number {
        return this.pair.size;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    containsKey(k: K): boolean {
        return this.pair.has(k);
    }

    replace(oldK: K, newV: V): V | undefined {
        if (this.containsKey(oldK)) {
            this.remove(oldK);
            this.put(oldK, newV);
        }

        return this.get(oldK);
    }

    getValues(): IList<V> {
        const array = Array.from(this.pair.values());
        let list = new List<V>();
        list.arrayToList([...array]);
        return list;
    }

    getKeys(): IList<K> {
        const array = Array.from(this.pair.keys());
        let list = new List<K>();
        list.arrayToList([...array]);
        return list;
    }

    getKeyValuePair(): IKeyValueObject<K, V> {
        throw new Error("method not implement");

        // let newMap = new Map<K, V>();
        // this.pair.forEach((v, k) => newMap);
        // return newMap;
    }

    keyValueMapToArray(): IKeyValueObject<K, V>[] {
        return Array.from(this.pair, ([key, value]) => ({ key, value }));
    }

    *[Symbol.iterator](): Iterator<IKeyValueObject<K, V>> {
        const inArrayForm = this.keyValueMapToArray();
        for (let element of inArrayForm) {
            yield element;
        }
    }

    // forEach(callback: (key:K,value:V, index: number) => V, thisArg?: any): void {
    //     this[Symbol.iterator]()
    // }

    next(...args: [] | [undefined]): IteratorResult<any, any> {
        // @ts-ignore
        return undefined;
    }

    return(value?: any): IteratorResult<any, any> {
        // @ts-ignore
        return undefined;
    }

    throw(e?: any): IteratorResult<any, any> {
        // @ts-ignore
        return undefined;
    }
}