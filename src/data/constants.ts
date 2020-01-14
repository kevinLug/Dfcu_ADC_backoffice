export const AUTH_TOKEN_KEY = '__demo__dfcu__token'
export const AUTH_USER_KEY = '__demo__dfcu__user'

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

const servers: any = {
    dev: {
        Auth: 'https://authservice-test.laboremus.no',
        Crm: 'https://crmservice-test.laboremus.no',
        Case: 'http://localhost:6001',
        Kyc: "https://kyc-connector-staging.onboarding.dfcugroup.com",
        Notification: "https://emata-poc-smsservice-test.laboremus.no",
        Payments: "https://emata-poc-payments-test.laboremus.no",
    },
    test: {
        Auth: 'https://authservice-test.laboremus.no',
        Crm: 'https://emata-poc-crmservice-test.laboremus.no',
        Case: 'https://emata-poc-workeng-test.laboremus.no',
        Kyc: "https://kyc-connector-staging.onboarding.dfcugroup.com",
        Notification: "https://emata-poc-smsservice-test.laboremus.no",
        Payments: "https://emata-poc-payments-test.laboremus.no",
    },
    staging: {
        Auth: "",
        Crm: "",
        Case: "",
        Kyc: "",
        Notification: "",
        Payments: ""
    },
    production: {
        Auth: "",
        Crm: "",
        Case: "",
        Kyc: "",
        Notification: "",
        Payments: ""
    }
}

const evVar = process.env.REACT_APP_ENV || 'dev'
const environment = evVar.trim()
console.log(`############# Env : ${environment} ###############`)
const env = servers[environment]
const authURL = env.Auth
const crmURL = env.Crm
const caseHandlingURL = env.Case
const gatewayURL = env.Gateway
const kycURL = env.Kyc
const notificationURL = env.Notification


export const remoteRoutes = {
    authServer: authURL,
    login: authURL + '/api/test/login',
    profile: authURL + '/api/test/profile',
    register: authURL + '/api/auth/register',
    resetPass: authURL + '/reset',

    contacts: crmURL + '/api/crm/contact',
    workflows: caseHandlingURL + '/api/workflows',
    workflowsManual: caseHandlingURL + '/api/manual',
    samplePdf: caseHandlingURL + '/sample.pdf',
}



