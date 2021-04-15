import {AUTH_TOKEN_KEY, AUTH_USER_KEY} from "../constants";
import {ILoginResponse, GatewayMetadata} from "../types";

export interface ICoreState {
    splash: boolean,
    user: any | null,
    isLoading: boolean,
    documents: any,
    metadata: GatewayMetadata
    startNewTransferRequest: boolean;
}


const initialState: ICoreState = {
    splash: true,
    user: null,
    isLoading: true,
    documents: {},
    metadata: {
        versionMessage: '',
        version: 0,
        districts: [],
        businesses: [],
        transferCategories: [],
    },
    startNewTransferRequest: false
}

export interface IStoreDoc {
    id: string
    url: string
}

export const coreConstants = {
    coreLogin: "CORE_LOGIN",
    startLoading: "CORE_START_LOADING",
    stopLoading: "CORE_STOP_LOADING",
    coreLogout: "CORE_LOGOUT",
    coreCreateDocument: "CORE_CREATE_DOC",
    coreLoadMetadata: "CORE_LOAD_METADATA",
    startNewTransferRequest: "CORE_START_NEW_TRANSFER_REQUEST"
}

export default function reducer(state = initialState, action: any) {
    switch (action.type) {
        case coreConstants.coreLogin: {
            const {token, user}: ILoginResponse = action.payload
            localStorage.setItem(AUTH_TOKEN_KEY, token)
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
            return {...state, user, isLoading: false, splash: false}
        }

        case coreConstants.coreCreateDocument: {
            const {id, url}: IStoreDoc = action.payload
            const documents = {...state.documents, [id]: url}
            return {...state, documents}
        }

        case coreConstants.coreLogout: {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            localStorage.removeItem(AUTH_USER_KEY)
            return {...state, user: null, isLoading: false, splash: false}
        }

        case coreConstants.stopLoading: {
            return {...state, isLoading: false}
        }

        case coreConstants.startLoading: {
            return {...state, isLoading: true}
        }

        case coreConstants.coreLoadMetadata: {
            const metadata: GatewayMetadata = action.payload
            return {...state, metadata}
        }

        case coreConstants.startNewTransferRequest: {
            return {...state, startNewTransferRequest:true}
        }

        default: {
            return state
        }
    }
}
