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
    applications: '/applications',
    applicationsDetails: '/applications/:caseId',
    dashboard: '/dashboard',
    contacts: '/contacts',
    contactsDetails: '/contacts/:contactId',
    settings: '/settings',
}

const debug = process.env.NODE_ENV !== 'production'
export const url = debug ? 'https://localhost:44307' :
    'https://pro-demo.azurewebsites.net'


export const remoteRoutes = {
    login: url + '/api/auth/login',
    profile: url + '/api/auth/profile',
    register: url + '/api/auth/register',
    resetPass: url + '/reset',

    contacts: url + '/api/crm/contact',
}



