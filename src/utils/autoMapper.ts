

interface IS {
    a: number;
}

export interface ID {
    b: number;
}

interface IMapProperties {
    map: () => any;
}

const printValue = (value: any) => {
    console.log({value});
};

const srcOne: IS = {
    a: 1,
};

printValue(srcOne);

// const keysOf = keys<IS>()



export class AutoMapper {
    // private mapProperties: Map<any, any>;

    sourceProperties(){

    }

    // destinationProperties(dest: IDestination): string[] {
    //     return Object.keys(dest);
    // }

    mappingPropertiesLinear(sourcePropertyNames: string[], destPropertyNames: string[]): void {
        const mapSingleProperty: IMapProperties = {
            map() {
                sourcePropertyNames.forEach((key, index) => {
                    destPropertyNames[index] = key;
                });
                console.log(destPropertyNames);
            },
        };
        mapSingleProperty.map();
    }
}
// : Array<keyof T>
export function keyss<T extends object>() {

}


export const test = () => {
    const obj = new AutoMapper();
    // declare const source: ISource
    // declare const dest: IDestination
// obj.mappingPropertiesLinear(obj.sourceProperties(source), obj.destinationProperties(dest))
//     const src = {} as ISource
//     const keysOfSource = keys<IS>();
//     let IS;
//     const i = typeof (IS)
    console.log(new Array<keyof IS>())
    // const keysOfDest = keys<ID>();
    // console.log(obj.sourceProperties())
    // obj.mappingPropertiesLinear(keysOfSource,keysOfDest);
}