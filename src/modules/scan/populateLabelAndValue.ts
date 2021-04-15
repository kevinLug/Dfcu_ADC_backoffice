import {IKeyValueMap} from "../../utils/collections/map";

export const populateLabelAndValue = (exceptions: string[] = [], pairs: IKeyValueMap<string, any>, valuePlaceHolder: any) => {

    exceptions.forEach(e => pairs.remove(e))

    pairs.keyValueMapToArray().map((kv) => {
        if (!kv.value)
            return pairs.replace(kv.key, valuePlaceHolder)
    })

    return pairs.keyValueMapToArray();
}