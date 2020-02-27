import {IUserView} from "../../../modules/settings/users/types";

export const userConstants = {
    usersCommitFetch: "usersCommitFetch",
    userCommitFetch: "userCommitFetch",
}

export interface IUserState {
    loading: boolean
    selected?: IUserView
    data: IUserView[]
}

const initialState: IUserState = {
    selected: undefined,
    data: [],
    loading: false
}

export default function reducer(state = initialState, action: any): IUserState {
    switch (action.type) {

        case userConstants.usersCommitFetch: {
            const data: IUserView[] = action.payload
            return {...state, data}
        }

        case userConstants.userCommitFetch: {
            const selected: IUserView = action.payload
            return {...state, selected}
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

export function usersCommitFetch(payload: any) {
    return {
        type: userConstants.userCommitFetch,
        payload
    }
}


