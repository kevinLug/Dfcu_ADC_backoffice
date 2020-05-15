import {IUserView} from "../../../modules/settings/users/types";

export const userConstants = {
    usersCommitFetch: "usersCommitFetch",
    usersStartFetch: "usersStartFetch",
    usersStopFetch: "usersStopFetch",
    userCommitFetch: "userCommitFetch",
    userStartFetch: "userStartFetch",
}

export interface IUserState {
    loading: boolean
    selected?: IUserView
    data: IUserView[],
    loadingSingle: boolean
}

const initialState: IUserState = {
    selected: undefined,
    data: [],
    loading: false,
    loadingSingle: false
}

export default function reducer(state = initialState, action: any): IUserState {
    switch (action.type) {

        case userConstants.usersStartFetch: {
            return {...state, loading: true}
        }
        case userConstants.usersCommitFetch: {
            const data: IUserView[] = action.payload
            return {...state, data, loading: false}
        }

        case userConstants.userStartFetch: {
            return {...state, loadingSingle: true}
        }

        case userConstants.usersStopFetch: {
            return {...state, loading: false}
        }
        case userConstants.userCommitFetch: {
            const selected: IUserView = action.payload
            return {...state, selected,loadingSingle:false}
        }

        default: {
            return state
        }
    }
}

export function userCommitFetch(payload: any) {
    return {
        type: userConstants.userCommitFetch,
        payload
    }
}

export function usersStartFetch() {
    return {
        type: userConstants.usersStartFetch
    }
}

export function usersStopFetch() {
    return {
        type: userConstants.usersStopFetch
    }
}

export function usersCommitFetch(payload: any) {
    return {
        type: userConstants.usersCommitFetch,
        payload
    }
}


