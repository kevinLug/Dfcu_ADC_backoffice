
import {ISelectKeyValue, ISelectKeyValueDefault} from "../../../modules/transfers/types";

export const selectConstants = {
    select: "DROPDOWN_SELECT"
}

export interface ISelectKeyValueState {
    select: ISelectKeyValue
}

export const initialState: ISelectKeyValueState = {
    select: ISelectKeyValueDefault
}

export const actionISelectKeyValue = (select: ISelectKeyValue) => {
    return {
        type: selectConstants.select,
        payload: select
    }
}

export const reducer = (state = initialState, action: any): ISelectKeyValueState => {
    switch (action.type) {
        case selectConstants.select:
            return {
                ...state, select: action.payload
            }
        default: {
            return state
        }
    }
}
