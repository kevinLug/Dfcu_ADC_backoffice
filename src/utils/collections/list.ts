export interface IList<T> extends Iterable<T> {
    size(): number;

    add(element: T): void;

    isEmpty(): boolean;

    contains(element: T): boolean;

    remove(item: T): boolean;

    clear(): void;

    get(index: number): T;

    toArray(): Array<T>;

    arrayToList(array: Array<T>): IList<T>;

    [Symbol.iterator](): Iterator<T>;
}

export class List<T> implements IList<T> {
    private items: Array<T>;

    constructor() {
        this.items = new Array<T>();
    }

    size(): number {
        return this.items.length;
    }

    add(item: T) {
        const newArray = [item];
        this.items.push(...newArray);
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    contains(item: T): boolean {
        return this.toArray().indexOf(item) !== -1;
    }

    remove(item: T): boolean {
        if (this.contains(item)) {
            const position: number = this.items.indexOf(item);
            this.items.splice(position, 1);
            return true;
        } else {
            return false;
        }
    }

    clear(): void {
        this.items = new Array<T>();
    }

    get(index: number): T {
        return this.items[index];
    }

    toArray(): Array<T> {
        return [...this.items];
    }

    arrayToList(array: Array<T>): IList<T> {
        this.clear();
        array.forEach((e) => this.add(e));
        return this;
    }

    *[Symbol.iterator](): Iterator<T> {
        for (let element of this.items) {
            yield element;
        }
    }
}
