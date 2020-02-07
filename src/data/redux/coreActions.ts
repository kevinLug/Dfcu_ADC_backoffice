import {coreConstants, IStoreDoc} from "./coreReducer";

export const handleLogin = (data: any) => {
    return {
        type: coreConstants.coreLogin,
        payload: {...data},
    }
}

export const saveDocument = (data: IStoreDoc) => {
    return {
        type: coreConstants.coreCreateDocument,
        payload: {...data},
    }
}

export const handleLogout = () => {
    return {
        type: coreConstants.coreLogout,
    }
}



