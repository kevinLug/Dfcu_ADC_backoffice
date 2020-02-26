import {coreConstants, IStoreDoc} from "./coreReducer";

export const handleLogin = (data: any) => {
    return {
        type: coreConstants.coreLogin,
        payload: {...data},
    }
}

export const loadMetadata = (data:any) => {
    return {
        type: coreConstants.coreLoadMetadata,
        payload: {...data},
    }
}

export const startLoading = () => {
    return {
        type: coreConstants.startLoading,
    }
}

export const stopLoading = () => {
    return {
        type: coreConstants.stopLoading
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



