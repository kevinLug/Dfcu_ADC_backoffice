import {coreConstants} from "./coreReducer";
export const handleLogin = (data: any) => {
    return {
        type: coreConstants.coreLogin,
        payload: {...data},
    }
}

export const handleLogout = () => {
    return {
        type: coreConstants.coreLogout,
    }
}



