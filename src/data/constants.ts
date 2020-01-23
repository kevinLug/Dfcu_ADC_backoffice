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
        Auth: 'https://localhost:44313',
        Crm: 'https://crmservice-test.laboremus.no',
        Case: 'http://localhost:6001',
        Kyc: "https://kyc-connector-staging.onboarding.dfcugroup.com",
        Notification: "https://emata-poc-smsservice-test.laboremus.no",
        Payments: "https://emata-poc-payments-test.laboremus.no",
    },
    sit:{
        Auth: 'https://authentication-test.onboarding.dfcugroup.com',
        Crm: 'https://crm-test.onboarding.dfcugroup.com',
        Case: 'https://casehandling-test.onboarding.dfcugroup.com',
        Gateway: 'https://gateway-test.onboarding.dfcugroup.com',
        Kyc: 'https://kyc-connector-test.onboarding.dfcugroup.com',
        Notification: 'https://notification-test.onboarding.dfcugroup.com',
        Accounts: 'https://finacle-connector-test.onboarding.dfcugroup.com',
        Log: 'https://logging-test.onboarding.dfcugroup.com'
    },
    uat:{
        Auth: "https://authentication-staging.onboarding.dfcugroup.com",
        Crm: "https://crm-staging.onboarding.dfcugroup.com",
        Case: "https://casehandling-staging.onboarding.dfcugroup.com",
        Gateway: "https://gateway-staging.onboarding.dfcugroup.com",
        Kyc: "https://kyc-connector-staging.onboarding.dfcugroup.com",
        Notification: "https://notification-staging.onboarding.dfcugroup.com",
        Accounts: "https://finacle-connector-staging.onboarding.dfcugroup.com",
        Log: "https://logging-staging.onboarding.dfcugroup.com"
    },
    production:{
        Auth: "https://authentication.onboarding.dfcugroup.com",
        Crm: "https://crm.onboarding.dfcugroup.com",
        Case: "https://casehandling.onboarding.dfcugroup.com",
        Gateway: "https://gateway.onboarding.dfcugroup.com",
        Kyc: "https://kyc-connector.onboarding.dfcugroup.com",
        Notification: "https://notification.onboarding.dfcugroup.com",
        Accounts: "https://finacle-connector.onboarding.dfcugroup.com",
        Log: "https://logging.onboarding.dfcugroup.com"
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



