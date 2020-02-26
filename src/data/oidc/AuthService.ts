import {Log, User, UserManager, WebStorageStateStore} from 'oidc-client';

import {remoteRoutes} from "../constants";

class AuthService {
    public userManager: UserManager;
    private clientRoot=`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
    constructor() {
        const clientRoot = this.clientRoot
        const settings = {
            client_id: 'dfcu:backoffice',
            redirect_uri: `${clientRoot}/signin-callback.html`,
            post_logout_redirect_uri: clientRoot,
            response_type: 'token id_token',
            scope: 'openid profile offline_access roles agent_details Crm CaseHandling KycConnector Gateway IdentityServerApi',
            authority: remoteRoutes.authServer,
            silent_redirect_uri: `${clientRoot}/silent_renew.html`,
            automaticSilentRenew: true,
            filterProtocolClaims: true,
            loadUserInfo: true,
            userStore: new WebStorageStateStore({store: window.localStorage})
        };
        this.userManager = new UserManager(settings);
        Log.logger = console;
        Log.level = Log.INFO;
    }

    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }

    public async login(): Promise<void> {
        await this.userManager.signinRedirect();
    }

    public renewToken(): Promise<User> {
        return this.userManager.signinSilent();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }
}

const authService = new AuthService();

export default authService
