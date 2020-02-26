import {isEmpty} from "lodash";

export interface IOption {
    label: string
    value: any
}

export const toOptions = (data: string[]): IOption[] => {
    return data.map(it => ({label: it, value: it}))
}


export const hasValue = (text: any) => {
    return !isEmpty(text)
}

export const hasNoValue = (text: any) => {
    return isEmpty(text)
}
