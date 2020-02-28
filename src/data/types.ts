import {ICoreState} from "./redux/coreReducer";
import {ICrmState} from "./redux/contacts/reducer";
import {IWorkflowState} from "./redux/workflows/reducer";
import {IUserState} from "./redux/users/reducer";

export interface BaseModel {
    id: string
    createdAt: Date
    lastUpdated?: Date | null
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
    workflows: IWorkflowState
    crm: ICrmState
    users: IUserState
    contacts: any
}


export interface ISearch {
    limit: number,
    skip: number,
    query?: string
}

export interface IOidcUser {
    access_token: string
    expires_at: number
    id_token: string
    profile: IOidcProfile
    refresh_token: string
    scope: string
    session_state: string
    state: string
    token_type: string
}

export interface IOidcProfile {
    amr: string[]
    auth_time: number
    given_name: string
    idp: string
    name: string
    preferred_username: string
    role: string
    sid: string
    sub: string
}



export interface GatewayMetadata {
    version:           number;
    versionMessage:    string;
    districts:         District[];
    businesses:        GatewayBusiness[];
    accountCategories: AccountCategory[];
}

export interface AccountCategory {
    name:     string;
    code:     string;
    type:     number;
    accounts: GatewayAccount[];
}

export interface GatewayAccount {
    name:       string;
    code:       string;
    documents:  GatewayDocument[];
    currencies: GatewayStatus[];
}

export interface GatewayStatus {
    name: string;
    code: string;
}

export interface GatewayDocument {
    required: boolean;
    name:     string;
    code:     string;
}

export interface GatewayBusiness {
    name:     string;
    code:     string;
    statuses: GatewayStatus[];
}

export interface District {
    name:     string;
    code:     string;
    counties: GatewayStatus[];
}
