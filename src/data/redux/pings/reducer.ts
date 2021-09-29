import {IServerPingValue, IServerPingValueDefault} from "../../../modules/transfers/types";

export const serverPingConstants = {
    ping: "SERVER_PING"
}

export interface IServerPingValueState {
    serverPingValue: IServerPingValue
}

export const initialState: IServerPingValueState = {
    serverPingValue: IServerPingValueDefault
}

export const actionIServerPingValue = (serverPingValue: IServerPingValue) => {
    return {
        type: serverPingConstants.ping,
        payload: serverPingValue
    }
}

export const reducer = (state = initialState, action: any): IServerPingValueState => {
    switch (action.type) {
        case serverPingConstants.ping:
            return {
                ...state, serverPingValue: action.payload
            }
        default: {
            return state
        }
    }
}
