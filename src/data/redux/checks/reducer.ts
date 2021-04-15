import {ICheckKeyValue, ICheckKeyValueDefault} from "../../../modules/transfers/types";

export const checksConstants = {
    check: "BOOLEAN_CHECK"
}

export interface ICheckKeyValueState {
    check: ICheckKeyValue
}

export const initialState: ICheckKeyValueState = {
    check: ICheckKeyValueDefault
}

export const actionICheckKeyValue = (check: ICheckKeyValue) => {
    return {
        type: checksConstants.check,
        payload: check
    }
}

export const reducer = (state = initialState, action: any): ICheckKeyValueState => {
    switch (action.type) {
        case checksConstants.check:
            return {
                ...state, check: action.payload
            }
        default: {
            return state
        }
    }
}
