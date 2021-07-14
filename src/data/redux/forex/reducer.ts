import {IForex, IForexDefault} from "../../../modules/transfers/types";

export const forexConstants = {
    forex: "FOREX_DETAILS"
}

export interface IForexValueState {
    forexValue: IForex
}

export const initialState: IForexValueState = {
    forexValue: IForexDefault
}

export const actionIForexValue = (forexValue: IForex) => {
    return {
        type: forexConstants.forex,
        payload: forexValue
    }
}

export const reducer = (state = initialState, action: any): IForexValueState => {
    switch (action.type) {
        case forexConstants.forex:
            return {
                ...state, forexValue: action.payload
            }
        default: {
            return state
        }
    }
}
