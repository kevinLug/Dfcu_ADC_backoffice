export interface BaseModel {
    id: string
    createdAt: Date
    lastUpdated?: Date
    isDeleted: boolean
}

export interface IUser {
    id: string
    avatar: string
    username: string
    email: string
    fullName: string
    roles: string[]
}

export interface ILoginResponse {
    token: string
    user: IUser
}

export interface IState {
    core: ICoreState
    contacts: any
}

export interface ICoreState {
    user: IUser
    token: string
}

export interface ISearch {
    limit: number,
    skip: number,
    query?: string
}
