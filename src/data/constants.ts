export const AUTH_TOKEN_KEY = '__demo__eva__token'
export const AUTH_USER_KEY = '__demo__eva__user'


export const systemRoles = {
    contacts: {
        view: 'contacts_view',
        edit: 'contacts_edit',
        chc: 'contacts_chc',
        teams: 'contacts_teams',
    }
}


export const redux = {
    doLogin: 'DO_LOGIN',
    doLogout: 'DO_LOGOUT',
    doSearch: 'DO_SEARCH',
};

export const localRoutes = {
    callback: '/callback',
    pending: '/pending',
    applications: '/applications',
    applicationsDetails: '/applications/:caseId',
    dashboard: '/dashboard',
    contacts: '/contacts',
    contactsDetails: '/contacts/:contactId',
    settings: '/settings',
}

const debug = process.env.NODE_ENV !== 'production'
export const url = debug ? 'http://localhost:6001' :
    'https://emata-poc-workeng-test.laboremus.no'


export const remoteRoutes = {
    authServer: 'https://authservice-test.laboremus.no',
    login: url + '/api/test/login',
    profile: url + '/api/test/profile',
    register: url + '/api/auth/register',
    resetPass: url + '/reset',

    contacts: url + '/api/crm/contact',
    workflows: url + '/api/workflows',
}



