import {IKeyValueMap} from "../../utils/collections/map";

export const populateLabelAndValue = (exclusions: string[] = [], pairs: IKeyValueMap<string, any>, valuePlaceHolder: any) => {

    exclusions.forEach(e => pairs.remove(e))

    // eslint-disable-next-line array-callback-return
    pairs.keyValueMapToArray().map(kv => {
        if (kv.value === null || kv.value === undefined || kv.value === '')
            return pairs.replace(kv.key, valuePlaceHolder)
    })

    return pairs.keyValueMapToArray();
}

export const getChecksToPopulate = (checks: IKeyValueMap<string, boolean>) => {
    let data = {}
    checks.keyValueMapToArray().forEach(kv => {
        // @ts-ignore
        data[kv.key] = kv.value
    })
    return data;
}

export const getDropdownSelectsToPopulate = (checks: IKeyValueMap<string, boolean>) => {
    let data = {}
    checks.keyValueMapToArray().forEach(kv => {
        // @ts-ignore
        data[kv.key] = kv.value
    })
    return data;
}
